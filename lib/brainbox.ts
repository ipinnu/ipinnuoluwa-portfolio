import { supabase } from '@/lib/supabase'
import type { BrainboxNode } from '@/lib/types/brainbox'

// Mock seed data for dev/fallback
const MOCK_NODES: BrainboxNode[] = [
  {
    id: '1', type: 'thought', title: 'On shipping before you\'re ready',
    summary: 'A reflection on the Autodrive launch and why waiting kills momentum.',
    content: `When we launched Autodrive, nothing was perfect. The reminders didn't fire on time, the UI had a weird scroll bug on older Androids, and we had three users on day one — two of whom were me. But we launched anyway.\n\nThe version you ship will always embarrass the version you are six months later. That's the point. The market doesn't care about your perfect v2 that lives in Figma. It cares about what's live.\n\nShipping is a skill. You get better at it by doing it, not by waiting until conditions are perfect. Conditions will never be perfect.`,
    tags: ['product', 'shipping', 'startups'], image_url: null, project_slug: null, external_url: null,
    orbit_ring: 1, orbit_angle: 45, orbit_speed: 0.8, created_at: '2025-01-15T00:00:00Z'
  },
  {
    id: '2', type: 'thought', title: 'Why mechanical engineers make good PMs',
    summary: 'Systems thinking, tolerance for ambiguity, and knowing when to over-engineer.',
    content: `My engineering background wasn't in software. It was in systems — how components interact, where tolerances matter, where they don't. That framing turns out to be deeply useful in product work.\n\nProduct management is mostly constraint navigation. You have user needs, technical limits, business goals, and a timeline that was optimistic from day one. Mechanical engineers spend four years learning to navigate exactly this.\n\nThe mental model I use most: know which tolerances matter. In mechanical design, a 0.1mm variance in a load-bearing joint is catastrophic; in a cosmetic cover panel it's irrelevant. In product: a 100ms latency difference on a checkout button matters enormously; on a settings page it doesn't. Same thinking, different domain.`,
    tags: ['product', 'engineering', 'career'], image_url: null, project_slug: null, external_url: null,
    orbit_ring: 1, orbit_angle: 200, orbit_speed: 0.9, created_at: '2025-02-10T00:00:00Z'
  },
  {
    id: '3', type: 'thought', title: 'The thing about Lagos',
    summary: 'What it actually means to build software in a city that moves this fast.',
    content: `Building in Lagos is a specific experience. The city doesn't have time for your pivot deck. It either uses what you built or it doesn't, and it tells you immediately.\n\nThe user feedback loop here is shorter and harsher than anywhere else I know. If your app doesn't work on a 3G connection, nobody coddles you about it — they just stop using it. If your onboarding is three screens too long, you find out because nobody completes it.\n\nThere's a clarity to that. The constraints force honesty. You can't hide behind "we're still in beta" for too long when 20 million potential users are walking past your idea every morning.`,
    tags: ['lagos', 'africa', 'building'], image_url: null, project_slug: null, external_url: null,
    orbit_ring: 1, orbit_angle: 310, orbit_speed: 1.1, created_at: '2025-03-01T00:00:00Z'
  },
  {
    id: '4', type: 'project', title: 'Autodrive Nigeria',
    summary: 'Vehicle document management app. Next.js marketing site + Flutter Android app.',
    content: null, tags: ['flutter', 'mobile', 'product'],
    image_url: null, project_slug: 'autodrive-website', external_url: null,
    orbit_ring: 2, orbit_angle: 30, orbit_speed: 0.7, created_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '5', type: 'project', title: 'My Health Padi',
    summary: 'Personal health tracking app for Nigerians. Flutter + Firebase.',
    content: null, tags: ['flutter', 'health', 'mobile'],
    image_url: null, project_slug: 'my-health-padi', external_url: null,
    orbit_ring: 2, orbit_angle: 150, orbit_speed: 0.75, created_at: '2024-06-01T00:00:00Z'
  },
  {
    id: '6', type: 'project', title: 'iNSDEC',
    summary: 'NYSC-SAED enterprise system. 10,000+ users, 99.8% uptime.',
    content: null, tags: ['enterprise', 'flutter', 'government'],
    image_url: null, project_slug: 'insdec', external_url: null,
    orbit_ring: 2, orbit_angle: 270, orbit_speed: 0.65, created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '7', type: 'paper', title: 'Cross-platform in 2025: Flutter vs React Native',
    summary: 'A technical breakdown of where each framework actually wins.',
    content: `# Cross-platform in 2025: Flutter vs React Native\n\nThe framework wars have been fought for years. Everybody has an opinion. Here's mine, built from shipping production apps in both.\n\n## Where Flutter Wins\n\n**Pixel-perfect consistency.** Flutter's renderer (Impeller in 2025) draws everything itself. Your UI looks identical on a Pixel 9 and a Samsung S24 and a five-year-old Tecno. For consumer apps where brand consistency matters, this is decisive.\n\n**Performance on animation-heavy UIs.** If your product involves complex transitions, custom widgets, or 60fps interactions, Flutter's ahead. The widget tree is compiled; the bridge overhead that haunts React Native simply doesn't exist.\n\n**Dart is underrated.** Null safety, strong typing, excellent tooling. Once you're past the learning curve, it's genuinely pleasant.\n\n## Where React Native Wins\n\n**Web code reuse.** If you have a React web team and you're adding mobile, React Native is the rational choice. The mental model is the same. Components translate. Engineers don't need to context-switch.\n\n**Third-party ecosystem.** npm is enormous. Pub.dev is growing but smaller. For anything involving payments, analytics, or third-party hardware, React Native usually has the battle-tested library already.\n\n**Hiring.** JavaScript developers are everywhere. Dart developers are not.\n\n## My Take\n\nFor a new mobile product with a small team and no existing web codebase: Flutter.\n\nFor a product that already has a React web team and needs to move fast on mobile: React Native.\n\nBoth are production-ready in 2025. The question is your team, not the technology.`,
    tags: ['flutter', 'react-native', 'mobile', 'technical'],
    image_url: null, project_slug: null, external_url: null,
    orbit_ring: 3, orbit_angle: 80, orbit_speed: 0.5, created_at: '2025-02-20T00:00:00Z'
  },
  {
    id: '8', type: 'wonder', title: 'The overview effect',
    summary: 'What astronauts see when they look back at Earth — and what it changes.',
    content: 'Astronauts who return from space report a permanent cognitive shift: the borders that seemed so important from below disappear. You see one small, fragile thing floating in black. Edgar Mitchell called it an "instant global consciousness." The overview effect.',
    tags: ['space', 'philosophy', 'perspective'],
    image_url: 'https://images.unsplash.com/photo-1446941611757-91d2c3bd3d45?w=800',
    project_slug: null, external_url: null,
    orbit_ring: 3, orbit_angle: 220, orbit_speed: 0.55, created_at: '2024-12-01T00:00:00Z'
  },
  {
    id: '9', type: 'wonder', title: 'Lagos from above',
    summary: 'What the density actually looks like when you step back far enough.',
    content: 'From the air, Lagos looks like a circuit board someone forgot to clean up. Roads that turn into markets. Markets that become roads again. Twenty million decisions made every day in forty square kilometers. There\'s no other city that looks like it.',
    tags: ['lagos', 'cities', 'africa'],
    image_url: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800',
    project_slug: null, external_url: null,
    orbit_ring: 3, orbit_angle: 340, orbit_speed: 0.6, created_at: '2025-01-10T00:00:00Z'
  },
]

export async function getBrainboxNodes(): Promise<BrainboxNode[]> {
  try {
    const { data, error } = await (supabase as any)
      .from('brainbox_nodes')
      .select('*')
      .eq('published', true)
      .order('orbit_ring', { ascending: true })

    if (error || !data || data.length === 0) {
      return MOCK_NODES
    }
    return data as unknown as BrainboxNode[]
  } catch {
    return MOCK_NODES
  }
}
