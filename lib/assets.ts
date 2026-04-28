import { createClient } from '@supabase/supabase-js'
import { Asset, assetFromDb, assetToDb, SEED_FORGE_ASSETS } from './types/forge'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function fetchAssets(): Promise<Asset[]> {
  const { data, error } = await supabase
    .from('assets')
    .select('*')
    .order('asset_class', { ascending: true })

  if (error || !data || data.length === 0) {
    if (error) console.warn('fetchAssets:', error.message)
    return SEED_FORGE_ASSETS
  }

  return data.map(row => assetFromDb(row as Record<string, unknown>))
}

export async function updateAsset(id: string, patch: Partial<Asset>): Promise<void> {
  const { error } = await supabase
    .from('assets')
    .update(partialToDb(patch))
    .eq('id', id)

  if (error) throw new Error(error.message)
}

export async function createAsset(asset: Asset): Promise<void> {
  const { error } = await supabase.from('assets').insert(assetToDb(asset))
  if (error) throw new Error(error.message)
}

export async function seedIfEmpty(): Promise<void> {
  const { data } = await supabase.from('assets').select('id').limit(1)
  if (data && data.length > 0) return

  const rows = SEED_FORGE_ASSETS.map(assetToDb)
  const { error } = await supabase.from('assets').insert(rows)
  if (error) console.warn('seedIfEmpty:', error.message)
}

function partialToDb(patch: Partial<Asset>): Record<string, unknown> {
  const map: Record<string, string> = {
    assetClass:      'asset_class',
    returnTypes:     'return_types',
    mandateText:     'mandate_text',
    mandateProgress: 'mandate_progress',
    lastReviewed:    'last_reviewed',
    exitCondition:   'exit_condition',
    visionIds:       'vision_ids',
  }
  const out: Record<string, unknown> = { updated_at: new Date().toISOString() }
  for (const [k, v] of Object.entries(patch)) {
    const dbKey = map[k] ?? k
    out[dbKey] = v
  }
  return out
}
