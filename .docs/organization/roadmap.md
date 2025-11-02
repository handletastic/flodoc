# Product Roadmap

Strategic direction and planned development for Flodoc.

## Vision

Create the best documentation tool for developers who want git-driven, offline-first, visually connected documentation with MDX support.

## Guiding Principles

1. **Git-Driven**: All content in files, version controlled
2. **Offline-First**: Works without network dependency
3. **Developer-Friendly**: Markdown-like authoring, component embedding
4. **Visual Connections**: Show relationships between documents
5. **Type-Safe**: TypeScript throughout
6. **Open Source**: MIT license, community-driven

---

## Timeline Overview

```
2025
│
├── Q1: Foundation & Core Features
│   ├── ✅ M1: Project Setup (Jan)
│   ├── M2: Core Documentation (Feb-Mar)
│   └── M3: Flow Visualization (Mar-Apr)
│
├── Q2: Advanced Features
│   ├── M4: CMS Integration (Apr-Jun)
│   └── Polish & Performance
│
├── Q3: Production Ready
│   ├── Testing & QA
│   ├── Deployment Automation
│   └── v1.0 Release Candidate
│
└── Q4: v1.0 & Growth
    ├── v1.0 Release
    ├── Community Building
    └── Feature Refinement
```

---

## Current Milestone (M1) ✅

**Status**: Completed (2025-01-01)
**Version**: 0.1.0

### Delivered

- [x] Bun monorepo structure
- [x] React + TypeScript + Vite setup
- [x] TanStack Router configuration
- [x] MDX pipeline with plugins
- [x] Tailwind + Shadcn UI
- [x] Sample documentation
- [x] Comprehensive meta-documentation

---

## Next Milestone (M2) 📅

**Target**: February-March 2025
**Version**: 0.2.0
**Theme**: Core Documentation Features

### Goals

Make Flodoc usable for viewing documentation with navigation and search.

### Features

| Feature                        | Priority | Effort | Status     |
| ------------------------------ | -------- | ------ | ---------- |
| F-002: MDX Loading             | High     | Large  | 📅 Planned |
| F-004: Navigation & Search     | High     | Large  | 📅 Planned |
| F-005: Dark Mode               | Medium   | Small  | 📅 Planned |
| F-006: Responsive Mobile       | Medium   | Medium | 📅 Planned |
| F-007: Tags & Metadata         | Medium   | Medium | 📅 Planned |
| F-008: Code Block Enhancements | Medium   | Medium | 📅 Planned |
| F-015: Table of Contents       | Medium   | Medium | 📅 Planned |

### Success Criteria

- ✅ Can view any MDX document at `/docs/[slug]`
- ✅ Navigation sidebar with all documents
- ✅ Search finds documents quickly
- ✅ Dark mode works perfectly
- ✅ Mobile layout is usable
- ✅ Performance <100ms page loads

### User Stories

- US-001, US-002, US-005, US-006, US-007, US-008

---

## M3: Flow Visualization 📅

**Target**: March-April 2025
**Version**: 0.3.0
**Theme**: Interactive Graph

### Goals

Visualize document connections with interactive React Flow graph.

### Features

| Feature                  | Priority | Effort  | Status      |
| ------------------------ | -------- | ------- | ----------- |
| F-003: Flow Graph        | High     | X-Large | 📅 Planned  |
| R-001: Layout Algorithms | Medium   | Small   | 📅 Research |
| F-013: Search Index      | Medium   | Large   | 📅 Planned  |

### Success Criteria

- ✅ Flow graph at `/flow` shows all documents
- ✅ Click node to navigate to document
- ✅ Multiple layout modes available
- ✅ Handles 100+ documents smoothly
- ✅ Connection types visually distinct

### User Stories

- US-004

---

## M4: CMS Integration 💭

**Target**: Q2 2025
**Version**: 0.4.0
**Theme**: Content Editing

### Goals

Enable in-browser editing with TinaCMS.

### Features

| Feature              | Priority | Effort  | Status    |
| -------------------- | -------- | ------- | --------- |
| F-009: TinaCMS       | Medium   | X-Large | 💭 Future |
| F-014: Doc Templates | Low      | Small   | 💭 Future |

### Success Criteria

- ✅ Can edit documents at `/admin`
- ✅ Changes save to GitHub
- ✅ Client-side only (no server)
- ✅ Non-technical users can edit

### User Stories

- US-009, US-013

---

## M5: Production Ready 💭

**Target**: Q3-Q4 2025
**Version**: 1.0.0
**Theme**: Polish & Deploy

### Goals

Production-ready with deployment, tests, and documentation.

### Features

| Feature              | Priority | Effort | Status    |
| -------------------- | -------- | ------ | --------- |
| F-010: GitHub Pages  | High     | Medium | 💭 Future |
| F-012: PWA Support   | Medium   | Large  | 💭 Future |
| F-011: Export/Import | Low      | Large  | 💭 Future |
| Testing Suite        | High     | Large  | 💭 Future |

### Success Criteria

- ✅ Automated deployment works
- ✅ Test coverage >80%
- ✅ Lighthouse score >90
- ✅ WCAG AA compliant
- ✅ Complete documentation
- ✅ Real-world usage successful

### User Stories

- US-010, US-012, US-011

---

## Beyond 1.0 🚀

### Possible Future Features

**Versioning (v1.1)**

- F-016: Multiple documentation versions
- Version switcher UI
- Per-version content management

**Collaboration (v1.2)**

- F-017: Comments on documents
- Suggestion workflow
- User attribution

**Advanced Features (v1.x)**

- AI-powered search
- Documentation analytics
- Automated link checking
- Multi-language support
- Custom themes
- Plugin system

**Enterprise Features (v2.0)**

- Access control
- SSO integration
- Audit logging
- Custom domains
- SLA support

---

## Feature Prioritization

### How We Prioritize

Features are prioritized using:

1. **User Value**: Impact on user experience
2. **Strategic Fit**: Aligns with vision
3. **Technical Risk**: Complexity and dependencies
4. **Effort**: Development time required
5. **Dependencies**: What's blocked by this

### Priority Matrix

| Priority   | Criteria                       | Examples                  |
| ---------- | ------------------------------ | ------------------------- |
| **High**   | Core value + Low risk          | MDX loading, Navigation   |
| **Medium** | Nice-to-have + Moderate effort | Dark mode, Tags           |
| **Low**    | Future value + High effort     | Versioning, Collaboration |

---

## Success Metrics

### v0.2.0 (M2)

- 5+ features completed
- Navigation working smoothly
- Search finds documents <100ms
- Mobile usable
- No critical bugs

### v0.3.0 (M3)

- Flow graph renders 100+ nodes
- Visual layouts work well
- Performance acceptable
- Positive user feedback

### v1.0.0 (M5)

- Test coverage >80%
- Lighthouse >90
- 10+ real users
- GitHub stars >100
- Documentation complete

---

## Release Strategy

### Pre-1.0 (Current)

- **Cadence**: When milestones complete
- **Versioning**: 0.x.0 for features, 0.0.x for fixes
- **Breaking Changes**: OK, document in changelog

### Post-1.0

- **Cadence**: Monthly releases
- **Versioning**: Semantic (major.minor.patch)
- **Breaking Changes**: Major version only
- **LTS**: Consider after 2.0

---

## Go-to-Market

### Phase 1: Private Development (Current)

- Build core features
- Internal testing
- Documentation

### Phase 2: Alpha (M2)

- Invite early testers
- Gather feedback
- Fix major issues

### Phase 3: Beta (M3-M4)

- Public repository
- Community feedback
- Polish and refine

### Phase 4: v1.0 Launch (M5)

- Product Hunt launch
- Show HN post
- Documentation site
- Blog posts
- Social media

### Phase 5: Growth (Post-1.0)

- Conference talks
- Tutorial content
- Integrations
- Ecosystem building

---

## Risk Management

### Known Risks

| Risk                           | Impact | Probability | Mitigation                   |
| ------------------------------ | ------ | ----------- | ---------------------------- |
| React Flow performance issues  | High   | Low         | Virtualization, optimization |
| MDX bundle size bloat          | Medium | Medium      | Code splitting, lazy loading |
| GitHub Pages limitations       | Medium | Low         | Alternative hosts available  |
| TinaCMS integration complexity | High   | Medium      | Start simple, iterate        |
| Community adoption slow        | Medium | Medium      | Marketing, quality, docs     |

---

## Dependencies & Blockers

### External Dependencies

- None currently - all open source
- GitHub Pages for hosting (free)
- GitHub API for TinaCMS (free tier sufficient)

### Potential Blockers

- None identified for M2
- TinaCMS client-side limitations (for M4)
- Browser API availability for PWA (for M5)

---

## Community Feedback Loop

### How We Listen

1. GitHub Issues for bug reports
2. GitHub Discussions for ideas
3. User interviews (when we have users)
4. Analytics (post-1.0, privacy-respecting)

### How We Decide

1. Review feedback monthly
2. Prioritize based on criteria above
3. Discuss in issues/discussions
4. Document decisions in ADRs
5. Update roadmap quarterly

---

## Roadmap Updates

This roadmap is a living document:

- **Review**: End of each milestone
- **Update**: Quarterly or as major changes occur
- **Changes**: Document in changelog
- **Communication**: Announce in GitHub discussions

---

**Last Updated**: 2025-01-01
**Next Review**: End of M2 (March 2025)
**Maintained By**: Development team and community
