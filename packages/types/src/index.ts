// Document frontmatter types
export interface DocumentFrontmatter {
  title: string
  description: string
  slug: string
  tags: string[]
  connections?: DocumentConnection[]
}

export interface DocumentConnection {
  type: 'prerequisite' | 'next' | 'related' | 'seealso'
  target: string
}

// Document with parsed content
export interface Document {
  frontmatter: DocumentFrontmatter
  content: string
  path: string
}

// Flow graph types
export interface FlowNode {
  id: string
  type: string
  data: {
    label: string
    document: DocumentFrontmatter
  }
  position: { x: number; y: number }
}

export interface FlowEdge {
  id: string
  source: string
  target: string
  type: 'prerequisite' | 'next' | 'related' | 'seealso'
  label?: string
}
