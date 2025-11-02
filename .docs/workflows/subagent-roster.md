# Claude Code Subagent Roster

A reference guide for specialized Claude Code subagents and when to use them for Flodoc development.

## Core Development Subagents

### frontend-developer
**Use When**: Building UI components, React features, styling
**Strengths**: React, TypeScript, Tailwind CSS, component architecture
**Example Tasks**:
- Creating new React components
- Implementing UI features
- Styling with Tailwind
- React Flow customization

### fullstack-developer
**Use When**: Features spanning frontend and backend/data loading
**Strengths**: End-to-end feature implementation
**Example Tasks**:
- Implementing full features from data to UI
- TanStack Query + Router integration
- MDX loading with frontend display

### typescript-pro
**Use When**: Complex TypeScript types, advanced generics, type safety
**Strengths**: TypeScript expertise, type system mastery
**Example Tasks**:
- Creating complex type definitions
- Fixing type errors
- Improving type safety
- Generic type utilities

---

## Specialized Technical Subagents

### react-specialist
**Use When**: Advanced React patterns, performance optimization
**Strengths**: React hooks, context, performance, modern patterns
**Example Tasks**:
- Complex state management
- Performance optimization
- Custom hooks
- React patterns

### nextjs-developer
**Use When**: (Not currently applicable - we use Vite)
**Note**: Could be relevant if we consider SSR/SSG in future

### build-engineer
**Use When**: Build configuration, bundling, optimization
**Strengths**: Vite, build tools, performance
**Example Tasks**:
- Vite configuration
- Build optimization
- Bundle analysis
- Code splitting

### dx-optimizer
**Use When**: Improving developer experience, tooling
**Strengths**: DX improvements, workflow optimization
**Example Tasks**:
- Development server improvements
- Hot reload optimization
- Better error messages
- Development tooling

---

## Content & Documentation Subagents

### documentation-engineer
**Use When**: Creating technical documentation, MDX components
**Strengths**: Doc structure, MDX, technical writing
**Example Tasks**:
- MDX component library
- Documentation structure
- Content organization
- Authoring guides

### technical-writer
**Use When**: Writing user-facing documentation, guides
**Strengths**: Clear technical writing, user guides
**Example Tasks**:
- User documentation
- Tutorial creation
- README updates
- API documentation

---

## Quality & Testing Subagents

### test-automator
**Use When**: Setting up testing infrastructure, writing tests
**Strengths**: Test frameworks, E2E testing, CI/CD testing
**Example Tasks**:
- Setting up Jest/Vitest
- Writing component tests
- E2E test setup with Playwright
- Test automation

### qa-expert
**Use When**: Quality assurance, test strategy, manual testing
**Strengths**: QA processes, test planning
**Example Tasks**:
- Test plan creation
- Quality standards
- Manual test scenarios
- Bug reproduction

### code-reviewer
**Use When**: Code review, best practices, quality checks
**Strengths**: Code quality, security, patterns
**Example Tasks**:
- Pre-commit code review
- Security vulnerability checks
- Pattern recommendations
- Refactoring suggestions

---

## Architecture & Planning Subagents

### Plan (Explore mode)
**Use When**: Planning features, exploring codebase, understanding code
**Strengths**: Research, planning, code exploration
**Example Tasks**:
- Exploring codebase structure
- Understanding existing patterns
- Planning feature implementation
- Technology research

### architect-reviewer
**Use When**: Reviewing architecture decisions, system design
**Strengths**: System design, scalability, architecture
**Example Tasks**:
- Architecture validation
- Scalability review
- Design pattern recommendations
- System design decisions

### refactoring-specialist
**Use When**: Major refactoring, code restructuring
**Strengths**: Safe refactoring, pattern application
**Example Tasks**:
- Large-scale refactoring
- Design pattern implementation
- Code organization improvements
- Technical debt reduction

---

## Data & State Management Subagents

### api-designer
**Use When**: Designing data structures, API contracts
**Strengths**: API design, data modeling
**Example Tasks**:
- Frontmatter schema design
- Type definitions for data
- API structure planning
- Data flow design

### database-optimizer
**Use When**: (Limited applicability - mostly client-side)
**Note**: Could be useful for future backend features

---

## UI/UX Subagents

### ui-designer
**Use When**: Visual design, UI/UX decisions, accessibility
**Strengths**: Design systems, accessibility, UX
**Example Tasks**:
- Component visual design
- Accessibility improvements
- User flow design
- Design system decisions

### accessibility-tester
**Use When**: Ensuring WCAG compliance, accessibility
**Strengths**: A11y testing, ARIA, screen readers
**Example Tasks**:
- Accessibility audits
- ARIA implementation
- Screen reader testing
- WCAG compliance

---

## DevOps & Deployment Subagents

### devops-engineer
**Use When**: CI/CD, deployment, infrastructure
**Strengths**: GitHub Actions, deployment pipelines
**Example Tasks**:
- GitHub Actions workflows
- GitHub Pages deployment
- Build pipeline optimization
- Environment configuration

### deployment-engineer
**Use When**: Deployment strategies, release management
**Strengths**: Deployment processes, releases
**Example Tasks**:
- Release automation
- Deployment scripts
- Rollback procedures
- Version management

---

## Git & Version Control Subagents

### code-committer
**Use When**: Making commits with proper messages and staging
**Strengths**: Git workflow, commit messages, staging
**Example Tasks**:
- Creating well-structured commits
- Conventional commit messages
- Proper file staging
- Commit history management

### git-workflow-manager
**Use When**: Complex Git operations, branch management
**Strengths**: Git operations, branching strategies
**Example Tasks**:
- Branch management
- Merge conflict resolution
- Git workflow optimization
- Repository maintenance

---

## Specialized Feature Subagents

### search-specialist
**Use When**: Implementing search functionality
**Strengths**: Search algorithms, indexing
**Example Tasks**:
- Client-side search implementation
- Search index optimization
- Search UI components
- Full-text search

### nlp-engineer
**Use When**: (Future) Natural language processing features
**Note**: Could be useful for smart search, content analysis

---

## Decision Making & Management

### debugger / debugger-master
**Use When**: Complex bugs, systematic debugging
**Strengths**: Root cause analysis, debugging strategies
**Example Tasks**:
- Complex bug investigation
- Performance debugging
- Error pattern analysis
- Systematic troubleshooting

### performance-engineer
**Use When**: Performance optimization, profiling
**Strengths**: Performance analysis, optimization
**Example Tasks**:
- Bundle size optimization
- Runtime performance
- React Flow performance
- Load time optimization

---

## Most Commonly Used for Flodoc

Based on current project needs:

1. **frontend-developer** - Primary for React/UI work
2. **typescript-pro** - Type safety and definitions
3. **documentation-engineer** - MDX and content features
4. **Plan (Explore)** - Feature planning and research
5. **code-reviewer** - Quality assurance
6. **devops-engineer** - Deployment and CI/CD
7. **test-automator** - Testing setup

---

## Usage Guidelines

### When to Use Multiple Subagents

Use multiple subagents in sequence for complex features:

1. **Plan** → Research and understand
2. **architect-reviewer** → Design the solution
3. **frontend-developer** → Implement UI
4. **typescript-pro** → Add type safety
5. **test-automator** → Add tests
6. **code-reviewer** → Review quality
7. **code-committer** → Commit changes

### When to Use Single Subagent

Use a single subagent for focused tasks:
- Bug fixes → **debugger**
- New component → **frontend-developer**
- Documentation → **technical-writer**
- Type definitions → **typescript-pro**

---

**Last Updated**: 2025-01-01
**Review**: Update as new subagents are added or usage patterns change
