# Building a Playwright MCP Server

This guide explains how to create a Model Context Protocol (MCP) server for Playwright to enhance Claude Code's testing capabilities.

## What is an MCP Server?

An MCP server exposes tools and resources that Claude Code can use during conversations. For Playwright, an MCP server can:

- Run tests and return results
- View traces and extract debugging information
- Generate test reports
- Manage test artifacts
- Provide test insights and suggestions

## Architecture

```
┌─────────────────┐
│  Claude Code    │
│                 │
└────────┬────────┘
         │ MCP Protocol
         │
┌────────▼────────┐
│ Playwright MCP  │
│     Server      │
└────────┬────────┘
         │
    ┌────▼────┐
    │Playwright│
    │  APIs    │
    └─────────┘
```

## Implementation

### Directory Structure

```
flodoc/
├── mcp-servers/
│   └── playwright/
│       ├── package.json
│       ├── tsconfig.json
│       ├── src/
│       │   ├── index.ts         # MCP server entry point
│       │   ├── tools/           # Tool implementations
│       │   │   ├── runTests.ts
│       │   │   ├── viewTrace.ts
│       │   │   ├── getReport.ts
│       │   │   └── index.ts
│       │   └── types.ts         # Type definitions
│       └── README.md
```

### Step 1: Create Package Structure

```bash
# From project root
mkdir -p mcp-servers/playwright/src/tools
cd mcp-servers/playwright
```

### Step 2: Initialize package.json

```json
{
  "name": "@flodoc/playwright-mcp",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./dist/index.js",
  "bin": {
    "playwright-mcp": "./dist/index.js"
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "latest",
    "@playwright/test": "^1.48.0",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.3.0"
  }
}
```

### Step 3: Create TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Step 4: Implement MCP Server

**`src/index.ts`:**

```typescript
#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import * as tools from './tools/index.js';

// Create MCP server
const server = new Server(
  {
    name: 'playwright-mcp',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'run_tests',
        description: 'Run Playwright tests with specified options',
        inputSchema: {
          type: 'object',
          properties: {
            project: {
              type: 'string',
              description: 'Browser project to run (chromium, firefox, webkit)',
            },
            grep: {
              type: 'string',
              description: 'Filter tests by name pattern',
            },
            testFile: {
              type: 'string',
              description: 'Specific test file to run',
            },
            headed: {
              type: 'boolean',
              description: 'Run in headed mode',
              default: false,
            },
          },
        },
      },
      {
        name: 'get_test_results',
        description: 'Get results from the last test run',
        inputSchema: {
          type: 'object',
          properties: {
            format: {
              type: 'string',
              enum: ['summary', 'detailed', 'json'],
              description: 'Result format',
              default: 'summary',
            },
          },
        },
      },
      {
        name: 'view_trace',
        description: 'Extract information from a Playwright trace file',
        inputSchema: {
          type: 'object',
          properties: {
            tracePath: {
              type: 'string',
              description: 'Path to trace.zip file',
            },
          },
          required: ['tracePath'],
        },
      },
      {
        name: 'get_failing_tests',
        description: 'Get list of failing tests with error details',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'generate_test_skeleton',
        description: 'Generate test file skeleton for a new feature',
        inputSchema: {
          type: 'object',
          properties: {
            featureName: {
              type: 'string',
              description: 'Name of feature to test',
            },
            testType: {
              type: 'string',
              enum: ['navigation', 'documentation', 'visual', 'flow'],
              description: 'Type of test',
            },
          },
          required: ['featureName', 'testType'],
        },
      },
    ],
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'run_tests':
      return await tools.runTests(args);

    case 'get_test_results':
      return await tools.getTestResults(args);

    case 'view_trace':
      return await tools.viewTrace(args);

    case 'get_failing_tests':
      return await tools.getFailingTests();

    case 'generate_test_skeleton':
      return await tools.generateTestSkeleton(args);

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Playwright MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
```

**`src/tools/runTests.ts`:**

```typescript
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

interface RunTestsArgs {
  project?: string;
  grep?: string;
  testFile?: string;
  headed?: boolean;
}

export async function runTests(args: RunTestsArgs) {
  const { project, grep, testFile, headed = false } = args;

  // Build command
  let cmd = 'npx playwright test';

  if (project) {
    cmd += ` --project=${project}`;
  }

  if (grep) {
    cmd += ` --grep="${grep}"`;
  }

  if (testFile) {
    cmd += ` ${testFile}`;
  }

  if (headed) {
    cmd += ' --headed';
  }

  try {
    const { stdout, stderr } = await execAsync(cmd, {
      cwd: path.join(process.cwd(), 'apps/web/e2e'),
      timeout: 300000, // 5 minutes
    });

    return {
      content: [
        {
          type: 'text',
          text: `Test run completed successfully:\n\n${stdout}\n\nErrors (if any):\n${stderr}`,
        },
      ],
    };
  } catch (error: any) {
    return {
      content: [
        {
          type: 'text',
          text: `Test run failed:\n\n${error.stdout}\n\nErrors:\n${error.stderr}`,
        },
      ],
      isError: true,
    };
  }
}
```

**`src/tools/getTestResults.ts`:**

```typescript
import fs from 'fs/promises';
import path from 'path';

interface GetTestResultsArgs {
  format?: 'summary' | 'detailed' | 'json';
}

export async function getTestResults(args: GetTestResultsArgs) {
  const { format = 'summary' } = args;

  try {
    const resultsPath = path.join(
      process.cwd(),
      'apps/web/e2e/test-results/results.json'
    );

    const data = await fs.readFile(resultsPath, 'utf-8');
    const results = JSON.parse(data);

    if (format === 'json') {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(results, null, 2),
          },
        ],
      };
    }

    // Parse results
    const stats = results.stats || {};
    const tests = results.suites?.flatMap((s: any) => s.specs || []) || [];

    const failing = tests.filter((t: any) =>
      t.tests.some((test: any) =>
        test.results.some((r: any) => r.status === 'failed')
      )
    );

    const passing = tests.filter((t: any) =>
      t.tests.every((test: any) =>
        test.results.every((r: any) => r.status === 'passed')
      )
    );

    let summary = `Test Results Summary:\n`;
    summary += `Total: ${stats.expected || 0}\n`;
    summary += `Passed: ${passing.length}\n`;
    summary += `Failed: ${failing.length}\n`;
    summary += `Skipped: ${stats.skipped || 0}\n`;
    summary += `Duration: ${stats.duration || 0}ms\n\n`;

    if (format === 'detailed' && failing.length > 0) {
      summary += `Failing Tests:\n`;
      failing.forEach((test: any) => {
        summary += `\n- ${test.title}\n`;
        test.tests.forEach((t: any) => {
          t.results.forEach((r: any) => {
            if (r.status === 'failed') {
              summary += `  Error: ${r.error?.message || 'Unknown error'}\n`;
            }
          });
        });
      });
    }

    return {
      content: [
        {
          type: 'text',
          text: summary,
        },
      ],
    };
  } catch (error: any) {
    return {
      content: [
        {
          type: 'text',
          text: `Failed to read test results: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
}
```

**`src/tools/index.ts`:**

```typescript
export { runTests } from './runTests.js';
export { getTestResults } from './getTestResults.js';
export { viewTrace } from './viewTrace.js';
export { getFailingTests } from './getFailingTests.js';
export { generateTestSkeleton } from './generateTestSkeleton.js';
```

### Step 5: Configure in Claude Code

Add to `.claude/mcp.json` (or Claude Desktop config):

```json
{
  "mcpServers": {
    "playwright": {
      "command": "node",
      "args": ["/absolute/path/to/flodoc/mcp-servers/playwright/dist/index.js"]
    }
  }
}
```

## Usage Examples

### Running Tests via MCP

```typescript
// Claude Code can now use these tools:

// Run specific tests
await mcp.playwright.run_tests({
  grep: "navigation",
  project: "chromium"
});

// Get test results
await mcp.playwright.get_test_results({
  format: "detailed"
});

// View trace
await mcp.playwright.view_trace({
  tracePath: "apps/web/e2e/test-results/trace.zip"
});

// Get failing tests
await mcp.playwright.get_failing_tests();
```

## Benefits

1. **Automated Test Running**: Claude can run tests without manual commands
2. **Result Analysis**: Automatic parsing and summarization of test results
3. **Trace Inspection**: Extract debugging info from traces programmatically
4. **Test Generation**: Generate test skeletons for new features
5. **Failure Diagnosis**: Automatically identify and categorize failures

## Future Enhancements

- Visual diff analysis for failed screenshots
- Automatic test fix suggestions
- Performance regression detection
- Coverage trend analysis
- Auto-update visual baselines after review

## Additional Resources

- [MCP SDK Documentation](https://github.com/modelcontextprotocol/sdk)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [MCP Server Examples](https://github.com/modelcontextprotocol/servers)

## Implementation Status

- [ ] Create directory structure
- [ ] Implement base MCP server
- [ ] Implement `run_tests` tool
- [ ] Implement `get_test_results` tool
- [ ] Implement `view_trace` tool
- [ ] Implement `get_failing_tests` tool
- [ ] Implement `generate_test_skeleton` tool
- [ ] Configure in Claude Code
- [ ] Test and validate all tools
- [ ] Document usage patterns

---

**Note**: This is a blueprint for future implementation. The MCP server will significantly enhance Claude Code's ability to work with Playwright tests autonomously.
