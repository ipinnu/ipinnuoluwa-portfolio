export type Planet = 'forge' | 'chronicle' | 'archive' | 'dream'

export const PLANET_CONFIG = {
  forge: {
    name: 'The Forge',
    subtitle: 'Built things',
    color: '#E8FF47',
    glowColor: 'rgba(232,255,71,0.25)',
    textColor: '#1a1e05',
    size: 130,
    scrollSection: 2,
    parallaxSpeed: 0.8,
  },
  chronicle: {
    name: 'The Chronicle',
    subtitle: 'Thoughts & words',
    color: '#534AB7',
    glowColor: 'rgba(83,74,183,0.3)',
    textColor: '#EEEDFE',
    size: 110,
    scrollSection: 3,
    parallaxSpeed: 0.65,
  },
  archive: {
    name: 'The Archive',
    subtitle: 'Deep work',
    color: '#1D9E75',
    glowColor: 'rgba(29,158,117,0.25)',
    textColor: '#E1F5EE',
    size: 95,
    scrollSection: 4,
    parallaxSpeed: 0.55,
  },
  dream: {
    name: 'The Dream',
    subtitle: 'Not yet. But soon.',
    color: '#993C1D',
    glowColor: 'rgba(153,60,29,0.25)',
    textColor: '#FAECE7',
    size: 115,
    scrollSection: 5,
    parallaxSpeed: 0.45,
  },
} as const

export interface CelestialNode {
  id: string
  planet: Planet
  title: string
  summary: string | null
  content: string | null
  tags: string[]
  image_url: string | null
  project_slug: string | null
  external_url: string | null
  status: 'active' | 'forming' | 'archived'
  orbit_speed: number
  published: boolean
  created_at: string
}

export interface CometData {
  id: string
  title: string
  summary: string | null
  content: string | null
  link_url: string | null
  active: boolean
  updated_at: string
}

// Asset Manager types (localStorage only)
export type AssetClass = 'A' | 'B' | 'C'
export type ReturnType = 'revenue' | 'impact' | 'brand' | 'strategic'
export type AssetStatus = 'active' | 'forming' | 'monitor'

export interface Asset {
  id: string
  name: string
  assetClass: AssetClass
  allocation: number
  returnTypes: ReturnType[]
  status: AssetStatus
  mandateText: string
  mandateProgress: number
  scores: { revenue: number; impact: number; strategic: number; momentum: number }
  actions: { text: string; done: boolean }[]
  lastReviewed: string
  thesis?: string
  links?: { playStore?: string; github?: string; caseStudy?: string }
}

export const SEED_ASSETS: Asset[] = [
  {
    id: 'nysc-saed',
    name: 'NYSC SAED',
    assetClass: 'A',
    allocation: 35,
    returnTypes: ['revenue', 'impact', 'brand'],
    status: 'active',
    mandateText: 'Complete current training cohort. Document outcomes. Explore state expansion.',
    mandateProgress: 80,
    scores: { revenue: 4, impact: 5, strategic: 4, momentum: 5 },
    actions: [
      { text: 'Deliver current training cohort', done: true },
      { text: 'Document outcomes with data', done: false },
      { text: 'Pitch state expansion to 1 partner', done: false },
      { text: 'Write case study for portfolio', done: false },
    ],
    lastReviewed: '2025-04-01',
    links: { caseStudy: '/work/nysc-saed' },
  },
  {
    id: 'autodrive',
    name: 'AutoDrive',
    assetClass: 'A',
    allocation: 30,
    returnTypes: ['revenue', 'strategic'],
    status: 'active',
    mandateText: 'Ship v2 feature set. Improve driver onboarding flow. Reach 500 active drivers.',
    mandateProgress: 65,
    scores: { revenue: 4, impact: 3, strategic: 5, momentum: 4 },
    actions: [
      { text: 'Ship v2 feature set', done: false },
      { text: 'Improve driver onboarding', done: true },
      { text: 'Reach 500 active drivers', done: false },
    ],
    lastReviewed: '2025-04-01',
    links: { github: '#', caseStudy: '/work/autodrive' },
  },
  {
    id: 'brainbox',
    name: 'Freelance / BrainBox',
    assetClass: 'A',
    allocation: 20,
    returnTypes: ['revenue', 'brand'],
    status: 'active',
    mandateText: 'Maintain 2 active client retainers. Build public brand through portfolio.',
    mandateProgress: 70,
    scores: { revenue: 5, impact: 2, strategic: 3, momentum: 4 },
    actions: [
      { text: 'Close Q2 retainer client', done: false },
      { text: 'Ship portfolio site', done: true },
    ],
    lastReviewed: '2025-04-01',
  },
  {
    id: 'diaspora-app',
    name: 'Diaspora App',
    assetClass: 'B',
    allocation: 8,
    returnTypes: ['strategic', 'impact'],
    status: 'forming',
    mandateText: 'Define MVP scope. Identify 3 early pilot users. Build waitlist landing page.',
    mandateProgress: 20,
    scores: { revenue: 2, impact: 5, strategic: 4, momentum: 2 },
    actions: [
      { text: 'Define MVP scope', done: false },
      { text: 'Identify 3 early pilot users', done: false },
      { text: 'Build waitlist landing page', done: false },
    ],
    lastReviewed: '2025-03-15',
  },
  {
    id: 'security-co',
    name: 'Security Company',
    assetClass: 'B',
    allocation: 7,
    returnTypes: ['strategic'],
    status: 'forming',
    mandateText: 'Research regulatory requirements. Find 1 co-founder with ops background.',
    mandateProgress: 10,
    scores: { revenue: 3, impact: 3, strategic: 5, momentum: 1 },
    actions: [
      { text: 'Research regulatory requirements', done: false },
      { text: 'Find co-founder with ops background', done: false },
    ],
    lastReviewed: '2025-03-01',
  },
  {
    id: 'proden',
    name: 'Proden',
    assetClass: 'C',
    allocation: 0,
    returnTypes: ['strategic'],
    status: 'monitor',
    mandateText: 'Thesis only.',
    mandateProgress: 0,
    scores: { revenue: 3, impact: 4, strategic: 4, momentum: 0 },
    actions: [],
    lastReviewed: '2025-01-01',
  },
  {
    id: 'ncc-app',
    name: 'NCC App',
    assetClass: 'C',
    allocation: 0,
    returnTypes: ['revenue'],
    status: 'monitor',
    mandateText: 'Thesis only.',
    mandateProgress: 0,
    scores: { revenue: 4, impact: 3, strategic: 2, momentum: 0 },
    actions: [],
    lastReviewed: '2025-01-01',
  },
  {
    id: 'real-estate-ar',
    name: 'Real Estate AR',
    assetClass: 'C',
    allocation: 0,
    returnTypes: ['revenue'],
    status: 'monitor',
    mandateText: 'Thesis only.',
    mandateProgress: 0,
    scores: { revenue: 5, impact: 2, strategic: 3, momentum: 0 },
    actions: [],
    lastReviewed: '2025-01-01',
  },
  {
    id: 'sacred-place',
    name: 'Sacred Place',
    assetClass: 'C',
    allocation: 0,
    returnTypes: ['strategic'],
    status: 'monitor',
    mandateText: 'Thesis only.',
    mandateProgress: 0,
    scores: { revenue: 1, impact: 5, strategic: 5, momentum: 0 },
    actions: [],
    lastReviewed: '2025-01-01',
  },
]
