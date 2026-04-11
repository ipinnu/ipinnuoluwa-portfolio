import { createClient } from '@supabase/supabase-js'
import type { CelestialNode, CometData } from './types/celestial'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function getCelestialNodes(): Promise<CelestialNode[]> {
  const { data, error } = await supabase
    .from('celestial_nodes')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching celestial nodes:', error)
    return SEED_NODES
  }

  return (data as CelestialNode[]) ?? SEED_NODES
}

export async function getActiveComet(): Promise<CometData | null> {
  const { data, error } = await supabase
    .from('comet')
    .select('*')
    .eq('active', true)
    .single()

  if (error) return null
  return data as CometData
}

// Seed data fallback — shown when Supabase has no data yet
const SEED_NODES: CelestialNode[] = [
  // The Forge
  { id: 'f1', planet: 'forge', title: 'AutoDrive', summary: 'Fleet management platform for Lagos drivers.', content: null, tags: ['Flutter', 'Node.js', 'Supabase'], image_url: null, project_slug: 'autodrive', external_url: null, status: 'active', orbit_speed: 1, published: true, created_at: '' },
  { id: 'f2', planet: 'forge', title: 'NYSC SAED', summary: 'Skills acquisition platform for NYSC corps members.', content: null, tags: ['React', 'Next.js'], image_url: null, project_slug: 'nysc-saed', external_url: null, status: 'active', orbit_speed: 0.8, published: true, created_at: '' },
  { id: 'f3', planet: 'forge', title: 'My Health Padi', summary: 'Healthcare access app for Nigerians.', content: null, tags: ['React Native'], image_url: null, project_slug: 'my-health-padi', external_url: null, status: 'active', orbit_speed: 0.65, published: true, created_at: '' },
  { id: 'f4', planet: 'forge', title: 'iNSDEC', summary: 'Industrial safety and compliance system.', content: null, tags: ['Next.js', 'Supabase'], image_url: null, project_slug: 'insdec', external_url: null, status: 'active', orbit_speed: 0.55, published: true, created_at: '' },
  // The Chronicle
  { id: 'c1', planet: 'chronicle', title: 'On shipping before you\'re ready', summary: 'A reflection on the AutoDrive launch and what I learned.', content: null, tags: ['product', 'shipping'], image_url: null, project_slug: null, external_url: null, status: 'active', orbit_speed: 0.9, published: true, created_at: '' },
  { id: 'c2', planet: 'chronicle', title: 'Why mechanical engineers make good PMs', summary: 'Systems thinking applied to product management.', content: null, tags: ['product', 'engineering'], image_url: null, project_slug: null, external_url: null, status: 'active', orbit_speed: 0.7, published: true, created_at: '' },
  { id: 'c3', planet: 'chronicle', title: 'The thing about Lagos', summary: 'Building in Nigeria — a short observation.', content: null, tags: ['Lagos', 'Africa'], image_url: null, project_slug: null, external_url: null, status: 'active', orbit_speed: 0.55, published: true, created_at: '' },
  // The Archive
  { id: 'a1', planet: 'archive', title: 'Flutter vs React Native in 2025', summary: 'Cross-platform development — a technical comparison.', content: null, tags: ['Flutter', 'React Native', 'mobile'], image_url: null, project_slug: null, external_url: null, status: 'active', orbit_speed: 0.8, published: true, created_at: '' },
  { id: 'a2', planet: 'archive', title: 'AutoDrive architecture deep dive', summary: 'How the fleet system was designed at scale.', content: null, tags: ['architecture', 'systems'], image_url: null, project_slug: 'autodrive', external_url: null, status: 'active', orbit_speed: 0.6, published: true, created_at: '' },
  // The Dream
  { id: 'd1', planet: 'dream', title: 'Diaspora App', summary: 'Connecting the African diaspora with home.', content: null, tags: ['mobile', 'diaspora'], image_url: null, project_slug: null, external_url: null, status: 'forming', orbit_speed: 1.1, published: true, created_at: '' },
  { id: 'd2', planet: 'dream', title: 'Security Company', summary: 'Physical + digital security for Nigerian enterprises.', content: null, tags: ['security', 'enterprise'], image_url: null, project_slug: null, external_url: null, status: 'forming', orbit_speed: 0.75, published: true, created_at: '' },
  { id: 'd3', planet: 'dream', title: 'Proden', summary: 'Still gathering energy.', content: null, tags: [], image_url: null, project_slug: null, external_url: null, status: 'forming', orbit_speed: 0.6, published: true, created_at: '' },
  { id: 'd4', planet: 'dream', title: 'Sacred Place', summary: 'An idea about space and meaning.', content: null, tags: ['architecture'], image_url: null, project_slug: null, external_url: null, status: 'forming', orbit_speed: 0.5, published: true, created_at: '' },
]
