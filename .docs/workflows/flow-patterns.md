# Claude Code Subagent Flow Patterns

Common workflows and patterns for coordinating multiple Claude Code subagents on Flodoc.

## Pattern 1: Initial Project Setup (Used for Flodoc Bootstrap)

**Use Case**: Setting up a new project from scratch

**Flow**:
1. **Human** → Describes project vision and requirements
2. **Main Claude** → Asks clarifying questions via `AskUserQuestion`
3. **Plan Agent** → Research tech stack options, feasibility
4. **Main Claude** → Present plan via `ExitPlanMode`
5. **Human** → Approves plan
6. **Main Claude with TodoWrite** → Creates todo list
7. **Main Claude** → Executes setup tasks:
   - Create directory structure
   - Configure build tools
   - Set up dependencies
   - Create initial files
   - Verify build works

**Actual Example (Flodoc Jan 2025)**:
```
User: "I want to create flodoc using Bun, TanStack, Shadcn, React Flow..."
Claude: [Asks 4 clarifying questions via AskUserQuestion]
User: [Answers: monorepo, hybrid approach, TanStack libs, etc.]
Plan Agent: [Researches architecture options]
Claude: [Presents comprehensive plan]
User: [Approves]
Claude: [Creates 8-item todo list]
Claude: [Executes sequentially, marking todos complete]
Result: ✅ Fully working dev environment
```

**Key Learnings**:
- Ask ALL clarifying questions upfront
- Use TodoWrite to track progress
- Mark todos complete as you go
- Verify with actual commands (bun run dev)

---

## Pattern 2: Feature Development Workflow

**Use Case**: Implementing a new feature

**Flow**:
1. **Plan Agent** → Explore codebase, understand existing patterns
2. **architect-reviewer** → Design feature architecture
3. **frontend-developer** → Implement UI components
4. **typescript-pro** → Add/refine types
5. **test-automator** → Write tests
6. **code-reviewer** → Review code quality
7. **code-committer** → Create commit(s)

**Example (Hypothetical: MDX Loading Feature)**:
```
1. Plan: Research current routing, understand MDX processing
2. Architect: Design MDX loader with TanStack Query
3. Frontend Dev: Create MDX renderer component, route
4. TypeScript Pro: Define frontmatter types, loader types
5. Test Automator: Write component tests, integration tests
6. Code Reviewer: Check accessibility, performance
7. Code Committer: git commit with conventional message
```

---

## Pattern 3: Bug Investigation & Fix

**Use Case**: Fixing a complex bug

**Flow**:
1. **debugger-master** → Systematic investigation, evidence gathering
2. **error-detective** → Pattern analysis if error is recurring
3. **frontend-developer** or **backend-developer** → Implement fix
4. **test-automator** → Add regression test
5. **code-committer** → Commit with bug reference

**When to Use**:
- Complex bugs requiring investigation
- Recurring errors needing pattern analysis
- Performance issues needing profiling

---

## Pattern 4: Refactoring

**Use Case**: Improving code structure without changing behavior

**Flow**:
1. **code-reviewer** → Identify code smells, tech debt
2. **refactoring-specialist** → Design refactoring approach
3. **typescript-pro** → Update types as needed
4. **test-automator** → Ensure test coverage before refactor
5. **refactoring-specialist** → Execute refactoring
6. **test-automator** → Verify tests still pass
7. **code-reviewer** → Validate improvements
8. **code-committer** → Commit with refactor message

---

## Pattern 5: Performance Optimization

**Use Case**: Improving application performance

**Flow**:
1. **performance-engineer** → Profile, identify bottlenecks
2. **Plan Agent** → Research optimization strategies
3. **frontend-developer** → Implement optimizations
4. **build-engineer** → Optimize bundle if needed
5. **performance-engineer** → Verify improvements
6. **code-committer** → Commit with perf metrics

**Example (Hypothetical: React Flow Performance)**:
```
1. Perf Engineer: Profile React Flow with 100+ nodes
2. Plan: Research virtualization, memoization patterns
3. Frontend Dev: Implement React.memo, useMemo
4. Build Engineer: Configure code splitting
5. Perf Engineer: Verify 50% render time improvement
6. Code Committer: commit: "perf: optimize flow rendering"
```

---

## Pattern 6: Documentation Creation

**Use Case**: Creating comprehensive documentation

**Flow**:
1. **technical-writer** → Outline documentation structure
2. **documentation-engineer** → Set up MDX infrastructure
3. **technical-writer** → Write content
4. **ui-designer** → Design documentation components
5. **frontend-developer** → Implement custom MDX components
6. **code-reviewer** → Review for clarity, accuracy

**Used For**:
- User documentation
- API documentation
- Developer guides
- Tutorial creation

---

## Pattern 7: Deployment Setup

**Use Case**: Setting up CI/CD and deployment

**Flow**:
1. **devops-engineer** → Design deployment pipeline
2. **deployment-engineer** → Configure GitHub Actions
3. **build-engineer** → Optimize production build
4. **devops-engineer** → Test deployment process
5. **code-reviewer** → Review pipeline security
6. **code-committer** → Commit workflow files

---

## Pattern 8: Architecture Decision

**Use Case**: Making a significant technical decision

**Flow**:
1. **Plan Agent** → Research options, gather info
2. **architect-reviewer** → Evaluate architectures
3. **Main Claude** → Draft ADR document
4. **Human** → Review and approve decision
5. **Main Claude** → Finalize ADR in `.docs/decisions/`

**Example (Used for All Flodoc ADRs)**:
```
1. Plan: Research Bun vs pnpm vs npm
2. Architect: Evaluate pros/cons/effort for each
3. Claude: Draft ADR-0001 with decision matrix
4. Human: Approve (via plan mode)
5. Claude: Create ADR file in .docs/decisions/
```

---

## Pattern 9: Code Review Before Merge

**Use Case**: Reviewing code before merging PR

**Flow**:
1. **code-reviewer** → Check code quality, patterns
2. **security-auditor** → Security scan (if needed)
3. **accessibility-tester** → A11y check (if UI changes)
4. **test-automator** → Verify test coverage
5. **Main Claude** → Summarize review findings

---

## Pattern 10: Meta-Documentation Creation (This File!)

**Use Case**: Creating project meta-documentation

**Flow**:
1. **Main Claude** → Ask clarifying questions about structure
2. **Plan Agent** → Research documentation best practices
3. **Main Claude** → Present plan for approval
4. **Main Claude with TodoWrite** → Track documentation creation
5. **Main Claude** → Create:
   - Directory structure
   - Templates
   - ADRs documenting past decisions
   - Feature tracking files
   - User stories
   - Workflow documentation (this file)
   - History and organization files

**Used For**: This exact meta-documentation you're reading!

---

## Anti-Patterns to Avoid

### ❌ Starting Coding Without Planning

**Wrong**:
```
User: "Add dark mode"
Claude: [Immediately starts coding]
```

**Right**:
```
User: "Add dark mode"
Claude: [Uses Plan agent to research approach]
Claude: [Presents options, gets approval]
Claude: [Then implements]
```

### ❌ Not Using TodoWrite for Complex Tasks

**Wrong**:
```
[Complex multi-step task]
[Tries to remember all steps]
[Forgets something]
```

**Right**:
```
[Complex task]
[Creates todo list]
[Marks items complete as you go]
[Nothing forgotten]
```

### ❌ Single Subagent for Complex Work

**Wrong**:
```
frontend-developer: [Tries to do architecture, implementation, testing, review all at once]
```

**Right**:
```
Plan → Architect → Frontend Dev → TypeScript Pro → Test → Review → Commit
```

---

## Choosing the Right Pattern

| Task Type | Pattern | Primary Subagents |
|-----------|---------|------------------|
| New project | Pattern 1 | Plan, Main Claude |
| New feature | Pattern 2 | Plan, Frontend/Fullstack, TypeScript, Test |
| Bug fix | Pattern 3 | Debugger, Error Detective |
| Refactor | Pattern 4 | Refactoring Specialist, Code Reviewer |
| Performance | Pattern 5 | Performance Engineer |
| Documentation | Pattern 6 | Technical Writer, Doc Engineer |
| Deployment | Pattern 7 | DevOps Engineer |
| Tech decision | Pattern 8 | Plan, Architect, Main Claude |

---

**Last Updated**: 2025-01-01
**Living Document**: Add new patterns as they emerge
