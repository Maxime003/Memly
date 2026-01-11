// Core structure for the Mind Map
export interface MindMapNode {
  id: string
  text: string
  description?: string
  children?: MindMapNode[]
}

// Subject Object
export interface Subject {
  id: string
  title: string
  context: 'course' | 'book' | 'article' | 'idea'
  rawNotes: string
  mindMap: MindMapNode
  difficultyFactor: number
  reviewCount: number
  lastInterval: number
  createdAt: Date
  nextReviewAt: Date
}
