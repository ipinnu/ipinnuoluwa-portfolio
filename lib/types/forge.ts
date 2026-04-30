export type AssetClass  = 'A' | 'B' | 'C'
export type AssetStatus = 'active' | 'forming' | 'monitor'
export type ReturnType  = 'revenue' | 'impact' | 'brand' | 'strategic'
export type VisionStatus = 'active' | 'forming' | 'realized' | 'paused'
export type FloorSignal  = 'stable' | 'pressured' | 'shaking'

export interface Asset {
  id: string
  name: string
  assetClass: AssetClass
  allocation: number
  returnTypes: ReturnType[]
  status: AssetStatus
  mandateText: string
  mandateProgress: number
  mandateDue?: string
  scores: { revenue: number; impact: number; strategic: number; momentum: number }
  actions: { text: string; done: boolean }[]
  lastReviewed: string
  thesis?: string
  exitCondition?: string
  visionIds: string[]
  links?: { playStore?: string; github?: string; caseStudy?: string }
}

export interface Vision {
  id: string
  title: string
  description: string
  floorLink: string
  timeHorizon: string
  gameWeight: number
  status: VisionStatus
  displayOrder: number
}

export interface FloorState {
  peace: FloorSignal
  sovereignty: FloorSignal
  lastUpdated: string
}

export interface GameSnapshot {
  dominantVision: Vision
  compiledWeight: number
  assetsPerVision: Record<string, Asset[]>
  floatingAssets: Asset[]
  currentPhase: string
}

// ── DB ↔ TS mappers ───────────────────────────────────────────────────────────

export function assetFromDb(row: Record<string, unknown>): Asset {
  return {
    id:              row.id as string,
    name:            row.name as string,
    assetClass:      row.asset_class as AssetClass,
    allocation:      row.allocation as number,
    returnTypes:     (row.return_types as string[]) as ReturnType[],
    status:          row.status as AssetStatus,
    mandateText:     row.mandate_text as string,
    mandateProgress: row.mandate_progress as number,
    mandateDue:      row.mandate_due as string | undefined,
    scores:          row.scores as Asset['scores'],
    actions:         row.actions as Asset['actions'],
    lastReviewed:    row.last_reviewed as string,
    thesis:          row.thesis as string | undefined,
    exitCondition:   row.exit_condition as string | undefined,
    visionIds:       (row.vision_ids as string[]) ?? [],
    links:           row.links as Asset['links'],
  }
}

export function assetToDb(a: Asset): Record<string, unknown> {
  return {
    id:               a.id,
    name:             a.name,
    asset_class:      a.assetClass,
    allocation:       a.allocation,
    return_types:     a.returnTypes,
    status:           a.status,
    mandate_text:     a.mandateText,
    mandate_progress: a.mandateProgress,
    mandate_due:      a.mandateDue ?? null,
    scores:           a.scores,
    actions:          a.actions,
    last_reviewed:    a.lastReviewed,
    thesis:           a.thesis ?? null,
    exit_condition:   a.exitCondition ?? null,
    vision_ids:       a.visionIds,
    links:            a.links ?? null,
    updated_at:       new Date().toISOString(),
  }
}

export function visionFromDb(row: Record<string, unknown>): Vision {
  return {
    id:           row.id as string,
    title:        row.title as string,
    description:  row.description as string,
    floorLink:    row.floor_link as string,
    timeHorizon:  row.time_horizon as string,
    gameWeight:   row.game_weight as number,
    status:       row.status as VisionStatus,
    displayOrder: row.display_order as number,
  }
}

// ── Seed fallbacks (shown if Supabase table empty/unavailable) ────────────────

export const SEED_VISIONS: Vision[] = [
  {
    id: 'sovereign-ground',
    title: 'Sovereign Ground',
    description: 'Move out. Own my space. Remove the last physical constraint on autonomy. My environment should be mine — my rules, my peace, my rhythm.',
    floorLink: 'Sovereignty — physical environment is the most tangible expression of autonomy. You cannot fully own your life in someone else\'s space.',
    timeHorizon: '12 months',
    gameWeight: 35,
    status: 'active',
    displayOrder: 1,
  },
  {
    id: 'income-independence',
    title: 'Income Independence',
    description: 'Build income streams I own completely. No single employer controls my stability. Revenue from what I build, not from permission someone else grants.',
    floorLink: 'Sovereignty — financial autonomy is the economic expression of the floor. Income you don\'t own is autonomy you\'re renting.',
    timeHorizon: '18 months',
    gameWeight: 30,
    status: 'active',
    displayOrder: 2,
  },
  {
    id: 'the-living-room',
    title: 'The Living Room',
    description: 'Build a vivid community and place to express, connect, and share innately. A space where who I am has a spot — not waiting for the world to make room.',
    floorLink: 'Peace — the deep floor statement: who I am has a spot in the world. Expression is downstream of sovereignty being intact.',
    timeHorizon: '3 years',
    gameWeight: 35,
    status: 'active',
    displayOrder: 3,
  },
]

export const SEED_FORGE_ASSETS: Asset[] = [
  { id: 'nysc-saed',       name: 'NYSC SAED',            assetClass: 'A', allocation: 35, returnTypes: ['revenue','impact','brand'],    status: 'active',  mandateText: 'Complete current training cohort. Document outcomes. Explore state expansion.',       mandateProgress: 80, scores: { revenue:4, impact:5, strategic:4, momentum:5 }, actions: [{ text:'Deliver current training cohort', done:true },{ text:'Document outcomes with data', done:false },{ text:'Pitch state expansion to 1 partner', done:false }], lastReviewed: '2025-04-01', visionIds: ['income-independence','the-living-room'],   exitCondition: 'Program ends OR income threshold reached OR state expansion secured', links: { caseStudy:'/work/nysc-saed' } },
  { id: 'autodrive',       name: 'AutoDrive',             assetClass: 'A', allocation: 30, returnTypes: ['revenue','strategic'],         status: 'active',  mandateText: 'Ship v2 feature set. Improve driver onboarding flow. Reach 500 active drivers.',          mandateProgress: 65, scores: { revenue:4, impact:3, strategic:5, momentum:4 }, actions: [{ text:'Ship v2 feature set', done:false },{ text:'Improve driver onboarding', done:true },{ text:'Reach 500 active drivers', done:false }],              lastReviewed: '2025-04-01', visionIds: ['income-independence','sovereign-ground'],  exitCondition: '10,000 active users OR ₦500k/month revenue OR acquisition offer received',    links: { caseStudy:'/work/autodrive' } },
  { id: 'brainbox',        name: 'Freelance / BrainBox',  assetClass: 'A', allocation: 20, returnTypes: ['revenue','brand'],            status: 'active',  mandateText: 'Maintain 2 active client retainers. Build public brand through portfolio.',                mandateProgress: 70, scores: { revenue:5, impact:2, strategic:3, momentum:4 }, actions: [{ text:'Close Q2 retainer client', done:false },{ text:'Ship portfolio site', done:true }],                                                                         lastReviewed: '2025-04-01', visionIds: ['income-independence','sovereign-ground'],  exitCondition: 'Replaced by product revenue exceeding freelance income 3 months running' },
  { id: 'diaspora-app',    name: 'Diaspora App',          assetClass: 'B', allocation:  8, returnTypes: ['strategic','impact'],         status: 'forming', mandateText: 'Define MVP scope. Identify 3 early pilot users. Build waitlist landing page.',               mandateProgress: 20, scores: { revenue:2, impact:5, strategic:4, momentum:2 }, actions: [{ text:'Define MVP scope', done:false },{ text:'Identify 3 early pilot users', done:false },{ text:'Build waitlist landing page', done:false }],          lastReviewed: '2025-03-15', visionIds: ['the-living-room','income-independence'],   exitCondition: 'MVP live with 100 users OR co-founder found and funded' },
  { id: 'security-co',     name: 'Security Company',      assetClass: 'B', allocation:  7, returnTypes: ['strategic'],                 status: 'forming', mandateText: 'Research regulatory requirements. Find 1 co-founder with ops background.',                   mandateProgress: 10, scores: { revenue:3, impact:3, strategic:5, momentum:1 }, actions: [{ text:'Research regulatory requirements', done:false },{ text:'Find co-founder with ops background', done:false }],                                   lastReviewed: '2025-03-01', visionIds: ['sovereign-ground','income-independence'],  exitCondition: 'Whitepaper complete + co-founder identified OR concept pivoted' },
  { id: 'proden',          name: 'Proden',                assetClass: 'C', allocation:  0, returnTypes: ['strategic'],                 status: 'monitor', mandateText: 'Thesis only.',                                                                                mandateProgress:  0, scores: { revenue:3, impact:4, strategic:4, momentum:0 }, actions: [],                                                                                                                                                                    lastReviewed: '2025-01-01', visionIds: ['the-living-room'],                         exitCondition: 'Enters active development OR archived after 12 months idle' },
  { id: 'ncc-app',         name: 'NCC App',               assetClass: 'C', allocation:  0, returnTypes: ['revenue'],                  status: 'monitor', mandateText: 'Thesis only.',                                                                                mandateProgress:  0, scores: { revenue:4, impact:3, strategic:2, momentum:0 }, actions: [],                                                                                                                                                                    lastReviewed: '2025-01-01', visionIds: ['income-independence'],                     exitCondition: 'Market validation complete OR archived' },
  { id: 'real-estate-ar',  name: 'Real Estate AR',        assetClass: 'C', allocation:  0, returnTypes: ['revenue'],                  status: 'monitor', mandateText: 'Thesis only.',                                                                                mandateProgress:  0, scores: { revenue:5, impact:2, strategic:3, momentum:0 }, actions: [],                                                                                                                                                                    lastReviewed: '2025-01-01', visionIds: ['income-independence'],                     exitCondition: 'Funded prototype OR archived after 6 months' },
  { id: 'sacred-place',    name: 'Sacred Place',          assetClass: 'C', allocation:  0, returnTypes: ['strategic'],                status: 'monitor', mandateText: 'Thesis only.',                                                                                mandateProgress:  0, scores: { revenue:1, impact:5, strategic:5, momentum:0 }, actions: [],                                                                                                                                                                    lastReviewed: '2025-01-01', visionIds: ['the-living-room'],                         exitCondition: 'Development begins OR merged into another project' },
]
