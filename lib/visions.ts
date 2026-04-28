import { createClient } from '@supabase/supabase-js'
import { Vision, visionFromDb, SEED_VISIONS } from './types/forge'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function fetchVisions(): Promise<Vision[]> {
  const { data, error } = await supabase
    .from('visions')
    .select('*')
    .order('display_order', { ascending: true })

  if (error || !data || data.length === 0) {
    if (error) console.warn('fetchVisions:', error.message)
    return SEED_VISIONS
  }

  return data.map(row => visionFromDb(row as Record<string, unknown>))
}

export async function updateVision(id: string, patch: Partial<Vision>): Promise<void> {
  const dbMap: Record<string, string> = {
    floorLink:    'floor_link',
    timeHorizon:  'time_horizon',
    gameWeight:   'game_weight',
    displayOrder: 'display_order',
  }
  const out: Record<string, unknown> = { updated_at: new Date().toISOString() }
  for (const [k, v] of Object.entries(patch)) {
    out[dbMap[k] ?? k] = v
  }

  const { error } = await supabase.from('visions').update(out).eq('id', id)
  if (error) throw new Error(error.message)
}
