export type NodeType = 'thought' | 'project' | 'paper' | 'wonder'

export interface BrainboxNode {
  id: string
  type: NodeType
  title: string
  summary: string | null
  content: string | null
  tags: string[]
  image_url: string | null
  project_slug: string | null
  external_url: string | null
  orbit_ring: 1 | 2 | 3
  orbit_angle: number
  orbit_speed: number
  created_at: string
}

export const NODE_COLORS: Record<NodeType, string> = {
  thought: '#7F77DD',
  project: '#E8FF47',
  paper:   '#1D9E75',
  wonder:  '#D85A30',
}

export const NODE_SIZES: Record<NodeType, { w: number; h: number; radius: number }> = {
  thought: { w: 48, h: 48, radius: 24 },
  project: { w: 56, h: 56, radius: 8 },
  paper:   { w: 40, h: 56, radius: 4 },
  wonder:  { w: 52, h: 52, radius: 4 },
}

export const RING_RADIUS: Record<1 | 2 | 3, number> = {
  1: 160,
  2: 280,
  3: 400,
}
