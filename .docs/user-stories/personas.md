# User Personas

Understanding who uses Flodoc and their needs.

## Primary Personas

### 📝 Persona 1: Documentation Author (Alex)

**Role**: Software Developer / Technical Writer
**Age**: 28-45
**Technical Level**: High

#### Background

Alex writes technical documentation for software projects. They understand code and enjoy creating clear, helpful documentation. They want their docs to be more than static pages - they want to show relationships and guide readers through learning paths.

#### Goals

- Write documentation efficiently in a format they know (Markdown)
- Embed interactive examples and components
- Define relationships between documents
- See how their documentation connects visually
- Version control everything with Git
- Work offline without cloud dependencies

#### Frustrations

- Static documentation feels disconnected
- Hard to show learning paths and prerequisites
- Limited interactivity in standard Markdown
- Dependencies on online platforms/CMSs
- Difficult to visualize documentation structure

#### Needs from Flodoc

- MDX format (familiar Markdown + components)
- Simple frontmatter for metadata
- Git-based workflow
- Local development server
- Component library for rich content
- Visual feedback on document structure

#### Quote

> "I want to write docs like code - in my editor, with version control, and the ability to embed anything I need."

---

### 📖 Persona 2: Documentation Reader (Jordan)

**Role**: Developer / Student / End User
**Age**: 20-50
**Technical Level**: Varies (Beginner to Expert)

#### Background

Jordan uses documentation to learn new technologies, solve problems, and understand complex systems. They get frustrated when documentation is poorly organized or when they can't find what they need.

#### Goals

- Find information quickly
- Understand prerequisites before diving in
- See related topics easily
- Follow structured learning paths
- Access docs offline
- Switch between light and dark mode

#### Frustrations

- Getting lost in large documentation sites
- Not knowing what to read first
- Missing related or prerequisite information
- Slow documentation sites
- Poor search functionality
- Broken navigation

#### Needs from Flodoc

- Clear navigation and structure
- Visual representation of doc relationships
- Fast search
- Mobile-friendly interface
- Progressive disclosure of complexity
- Table of contents for long docs

#### Quote

> "I just want to understand this topic without getting lost. Show me where to start and where to go next."

---

### 🔧 Persona 3: Documentation Maintainer (Sam)

**Role**: Open Source Maintainer / Team Lead
**Age**: 30-55
**Technical Level**: High

#### Background

Sam maintains documentation for an open source project or internal tool. They need to ensure docs stay up-to-date, accept contributions from the community, and provide a great documentation experience.

#### Goals

- Easy for contributors to add/update docs
- Review documentation changes like code (PRs)
- Maintain consistent structure and quality
- Deploy automatically on commits
- Track documentation coverage
- Low hosting costs

#### Frustrations

- Documentation platforms with monthly costs
- Difficult contribution process
- Lack of version control
- Complicated deployment
- Platform lock-in

#### Needs from Flodoc

- Git-based workflow (PRs, reviews)
- GitHub Pages deployment
- No hosting costs
- Markdown familiarity for contributors
- Visual validation of doc structure
- Offline-first approach

#### Quote

> "Documentation should be as easy to contribute to as code, with the same tools and workflows."

---

## Secondary Personas

### 🎓 Persona 4: Technical Educator (Taylor)

**Role**: Teacher / Course Creator
**Age**: 25-50
**Technical Level**: High

#### Background

Taylor creates courses and educational content. They need to guide learners through structured learning paths and provide clear prerequisites.

#### Goals

- Define clear learning paths
- Show prerequisite relationships
- Embed interactive examples
- Track learning progress (future)

#### Needs from Flodoc

- Strong support for learning path visualization
- Prerequisites and next steps
- Interactive components
- Progress tracking (future feature)

---

### 💼 Persona 5: Enterprise Team Member (Morgan)

**Role**: Enterprise Developer / Technical Writer
**Age**: 25-55
**Technical Level**: Medium to High

#### Background

Morgan works in a large company with internal documentation needs. They need to create internal wikis and documentation that teams can collaborate on.

#### Goals

- Internal documentation hosting
- Team collaboration
- Search across all team docs
- Access control (future)
- Company branding

#### Needs from Flodoc

- Self-hosted solution
- No external dependencies
- Team contribution workflow
- Customizable branding
- Search functionality

---

## Anti-Personas

### ❌ Non-technical Content Manager

Someone who has never used Markdown or Git and needs a WYSIWYG editor. Flodoc is not currently designed for this user (though TinaCMS integration may help in the future).

### ❌ Enterprise User Needing Access Control

Currently, Flodoc doesn't support authentication or authorization. It's designed for public documentation.

---

## Summary

| Persona | Priority | Key Need | Pain Point |
|---------|----------|----------|------------|
| Documentation Author | Primary | Git-based workflow | Limited tools for rich docs |
| Documentation Reader | Primary | Clear navigation | Getting lost |
| Documentation Maintainer | Primary | Easy contributions | Expensive platforms |
| Technical Educator | Secondary | Learning paths | Showing progression |
| Enterprise Team | Secondary | Self-hosted | External dependencies |

---

**Last Updated**: 2025-01-01
