---
id: ADR-0003
title: Use React Flow for document graph visualization
date: 2025-01-01
status: accepted
deciders: [Development Team]
consulted: []
informed: [All Contributors]
---

# ADR-0003: Use React Flow for Document Graph Visualization

## Status

Accepted

## Context

Flodoc's core feature is visualizing connections between documentation pages as an interactive flow graph. The visualization needs to:
- Display documents as nodes with connections as edges
- Support different connection types (prerequisite, next, related, seealso)
- Allow interactive navigation (click node to view document)
- Handle potentially large graphs (100+ documents)
- Support multiple layout modes (knowledge graph, navigation tree, learning path)
- Provide zoom, pan, and other interaction controls
- Be performant and responsive

## Decision Drivers

- Quality of interactive graph visualization
- Performance with large graphs
- Customization capabilities
- TypeScript support
- React integration
- Layout algorithm support
- Active maintenance

## Considered Options

### Option 1: React Flow (@xyflow/react)

**Description**: Modern React library for building node-based UIs and diagrams

**Pros**:
- Built specifically for React with hooks
- Excellent performance with virtualization
- Rich customization (custom nodes, edges)
- Built-in controls (zoom, pan, minimap)
- TypeScript support
- Active development and community
- Multiple layout algorithms available
- Professional documentation
- Free for MIT license

**Cons**:
- Learning curve for complex customizations
- Larger bundle size than simple graph libraries
- Layout algorithms require additional libraries (dagre, elkjs)

**Effort**: Medium - comprehensive but requires learning

### Option 2: Cytoscape.js

**Description**: Graph theory library for visualization and analysis

**Pros**:
- Powerful graph algorithms built-in
- Multiple layout algorithms
- Good performance
- Extensive features
- Mature library

**Cons**:
- Not React-specific (requires wrapper)
- Imperative API (less React-like)
- Steeper learning curve
- TypeScript support less comprehensive
- UI feels less modern

**Effort**: High - requires integration work

### Option 3: D3.js Force Graph

**Description**: Build custom graph visualization with D3.js

**Pros**:
- Maximum flexibility
- Powerful force-directed layouts
- D3 ecosystem
- Fine-grained control

**Cons**:
- Requires significant custom development
- Not React-specific
- Higher maintenance burden
- Steeper learning curve
- More code to write and maintain
- Performance optimization manual

**Effort**: Very High - build from scratch

### Option 4: vis.js Network

**Description**: Dynamic network visualization library

**Pros**:
- Built-in physics simulation
- Good default styling
- Easy to get started
- Good documentation

**Cons**:
- Not React-specific
- Less customization
- TypeScript support limited
- Less active development
- Older architecture

**Effort**: Medium - but less modern

## Decision

**Chosen**: Option 1 - React Flow (@xyflow/react)

**Rationale**:

React Flow is the best fit for Flodoc's requirements:

1. **React-First**: Built for React, uses hooks, integrates naturally
2. **Customization**: Can create custom node components with full React capabilities
3. **Performance**: Handles large graphs with built-in virtualization
4. **Modern DX**: TypeScript support, good documentation, active community
5. **Feature Rich**: Built-in controls, minimap, background patterns
6. **Extensible**: Can integrate layout libraries (dagre for hierarchical, elkjs for complex layouts)
7. **Professional**: Used in production by many companies
8. **Alignment**: Matches project's React + TypeScript focus

The library provides the right balance of:
- Out-of-the-box functionality
- Customization capabilities
- Performance
- Developer experience

## Consequences

### Positive

- Rich interactive graph visualization
- Can customize nodes to show document metadata
- Built-in interaction controls (zoom, pan, fit view)
- Good performance even with many nodes
- Easy to integrate with React state management
- Professional-looking visualization

### Negative

- Adds ~200KB to bundle (acceptable for core feature)
- Need to learn React Flow concepts
- Layout algorithms require additional libraries
- Some advanced features require paid Pro version (not needed initially)

### Neutral

- Need to choose and configure layout algorithm
- Custom node/edge styling requires CSS
- May need to optimize for very large graphs (1000+ nodes)

## Action Items

- [x] Install React Flow package (@xyflow/react)
- [x] Add to dependencies in apps/web
- [ ] Create initial flow visualization component
- [ ] Implement document node component
- [ ] Add edge styling for different connection types
- [ ] Integrate dagre or elkjs for automatic layout
- [ ] Add controls for different view modes
- [ ] Implement click-to-navigate functionality

## Follow-up

- Evaluate performance with real document graphs
- Test different layout algorithms (dagre, elkjs, force-directed)
- Consider whether Pro features are needed
- Monitor library updates and new features

## Related Decisions

- ADR-0002: TanStack Router (navigation on node click)
- Related to future MDX loading (F-001)

## References

- [React Flow Documentation](https://reactflow.dev)
- [React Flow Examples](https://reactflow.dev/examples)
- [Layout Algorithms](https://reactflow.dev/learn/layouting/layouting)

---

**Notes**:
- Core feature of Flodoc - critical decision
- User specifically requested react-flow
- Visualization quality is key differentiator
