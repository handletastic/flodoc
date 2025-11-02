# Flodoc Meta-Documentation

This directory contains **development and project management documentation** for Flodoc itself, not documentation about how to use Flodoc (that goes in `content/docs/`).

## Purpose

These files preserve:
- **Decision history**: Why we made technical choices
- **Feature tracking**: What we're building and its status
- **Development workflows**: How to work on the project
- **Project evolution**: How we got to where we are
- **Team coordination**: Subagent patterns and collaboration

## For Claude Code Instances

This meta-documentation enables any Claude Code instance to:
1. Understand the project's current state
2. See the reasoning behind past decisions
3. Know what features are planned/in-progress/completed
4. Follow established workflows and patterns
5. Maintain consistency with project history

## Directory Structure

### 📋 `/decisions` - Architecture Decision Records (ADRs)
Records of significant technical decisions with:
- Context and problem statement
- Alternatives considered
- Decision rationale and consequences

### 🎯 `/features` - Feature Tracking
- `backlog.md` - Planned features
- `in-progress.md` - Active development
- `completed.md` - Shipped features
- Feature specifications with YAML frontmatter

### 👥 `/user-stories` - User Stories & Personas
- User personas and their needs
- User stories in "As a... I want... so that..." format
- Acceptance criteria and priority

### 🔄 `/workflows` - Development Workflows
- `subagent-roster.md` - Available Claude Code subagents
- `flow-patterns.md` - Common multi-agent patterns
- `development-workflow.md` - Standard processes
- `code-review-checklist.md` - Quality standards
- `testing-workflow.md` - E2E testing processes

### 📚 `/guides` - Tool & Technology Guides
- Quick reference guides for technologies
- Setup and configuration guides
- Best practices and patterns
- Currently: Playwright testing guide

### 📖 `/history` - Project Evolution
- `changelog.md` - What changed and when
- `milestones.md` - Major achievements
- `/retrospectives/` - Lessons learned

### 🏢 `/organization` - Project Organization
- `project-status.md` - Current state snapshot
- `tech-stack.md` - Technology choices and rationale
- `roadmap.md` - Future plans and priorities

## Quick Navigation

**Starting a new feature?** → Read `/workflows/development-workflow.md` and create a feature spec in `/features/`

**Making a significant decision?** → Document it in `/decisions/` using the ADR template

**Need to understand why we chose X?** → Check `/decisions/` and `/organization/tech-stack.md`

**Want to see what's next?** → Check `/features/backlog.md` and `/organization/roadmap.md`

**Looking for project history?** → See `/history/changelog.md` and `/history/milestones.md`

**Need a tool guide?** → Check `/guides/` for Playwright, TinaCMS, and other technology guides

## Integration with GitHub

We use a **hybrid approach**:
- **Local files** (`.docs/`): Permanent history and detailed documentation
- **GitHub Issues**: Active task tracking with labels and assignments
- **GitHub Projects**: Visual board for sprint planning
- **Sync**: Completed work flows from Issues → `.docs/history/changelog.md`

## Contributing to Meta-Docs

When you:
- Make a significant technical decision → Create an ADR
- Start a new feature → Add to features and update status
- Complete a feature → Move to `completed.md` and update changelog
- Learn something valuable → Add to retrospectives
- Create a useful subagent flow → Document in workflows

## Templates

Use these templates for consistency:
- `decisions/template.md` - ADR template
- `features/feature-template.md` - Feature spec template
- `user-stories/story-template.md` - User story template
- `history/retrospectives/template.md` - Retrospective template

---

**Last Updated**: 2025-01-01 (Project initialization)
**Maintained By**: Development team and Claude Code instances
