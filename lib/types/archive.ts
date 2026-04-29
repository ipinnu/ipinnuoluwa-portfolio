export interface ArchiveCategory {
  id:           string
  name:         string
  colorHex:     string
  colorRgb:     string
  isDefault:    boolean
  displayOrder: number
}

export interface ArchiveType {
  id:         string
  categoryId: string
  name:       string
}

export interface Footnote {
  noteId:      string
  statement:   string
  excerpt:     string
  superscript: number
}

export interface ArchiveNote {
  id:          string
  title:       string
  content:     string
  categoryId:  string | null
  typeId:      string | null
  topic:       string | null
  tags:        string[]
  connections: string[]
  aiCluster:   string | null
  aiFootnotes: Footnote[]
  wordCount:   number
  status:      'active' | 'archived'
  createdAt:   string
  updatedAt:   string
}

export interface ArchiveConnection {
  id:        string
  noteA:     string
  noteB:     string
  strength:  number
  type:      'explicit' | 'keyword' | 'semantic'
  confirmed: boolean
}

export interface GraphNode {
  id:              string
  title:           string
  categoryId:      string | null
  aiCluster:       string | null
  connectionCount: number
  x:               number
  y:               number
}

// Default categories with glass colors
export const DEFAULT_CATEGORIES: ArchiveCategory[] = [
  { id: 'philosophy',    name: 'Philosophy',    colorHex: '#7F77DD', colorRgb: '127, 119, 221', isDefault: true,  displayOrder: 1 },
  { id: 'technology',    name: 'Technology',    colorHex: '#1D9E75', colorRgb: '29, 158, 117',  isDefault: true,  displayOrder: 2 },
  { id: 'business',      name: 'Business',      colorHex: '#EF9F27', colorRgb: '239, 159, 39',  isDefault: true,  displayOrder: 3 },
  { id: 'finance',       name: 'Finance',       colorHex: '#D4AF37', colorRgb: '212, 175, 55',  isDefault: true,  displayOrder: 4 },
  { id: 'politics',      name: 'Politics',      colorHex: '#4A6FA5', colorRgb: '74, 111, 165',  isDefault: true,  displayOrder: 5 },
  { id: 'health',        name: 'Health',        colorHex: '#A3C4B4', colorRgb: '163, 196, 180', isDefault: true,  displayOrder: 6 },
  { id: 'culture',       name: 'Culture',       colorHex: '#D85A30', colorRgb: '216, 90, 48',   isDefault: true,  displayOrder: 7 },
  { id: 'spirituality',  name: 'Spirituality',  colorHex: '#534AB7', colorRgb: '83, 74, 183',   isDefault: true,  displayOrder: 8 },
  { id: 'lagos-nigeria', name: 'Lagos/Nigeria', colorHex: '#E8FF47', colorRgb: '232, 255, 71',  isDefault: true,  displayOrder: 9 },
  { id: 'art',           name: 'Art',           colorHex: '#C4647A', colorRgb: '196, 100, 122', isDefault: true,  displayOrder: 10 },
]
