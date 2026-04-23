# Brainbox / My World — Full Blueprint + Build Prompt
### app/brainbox/page.tsx · Next.js 14 · Framer Motion · CSS · Supabase

---

## What This Page Is

A single immersive page that replaces the blog entirely. It represents Ipinnuoluwa's
mind as a navigable spatial experience — not a feed, not a grid, not a list.
Visitors explore floating nodes on a dark canvas, click to dive deep, and return
via breadcrumbs. Chaotic in feel, precise in architecture.

URL: /brainbox  (also reachable as /my-world — redirect both)
Nav label: "My World"

---

## The 4-Act Visitor Journey

### Act 1 — The Portal (entry, ~2 seconds)
- Full-viewport dark canvas (#0A0A0A) with the subtle 48px grid (same as hero)
- A single sphere pulses at the center — slow rotation, faint #E8FF47 glow on border
- Text fades in below it: "Welcome to my world." (Syne, 18px, #888884)
- After 1500ms: nodes drift outward from the center with staggered Framer Motion
  (initial: scale 0, opacity 0 at center → final: scale 1, opacity 1 at orbit position)
- Sphere stays as the permanent hub anchor

### Act 2 — The Hub (main view)
- Nodes orbit the central sphere in 3 loose rings, separated by type:
  - Ring 1 (closest):   Thoughts — small floating circles, semi-transparent
  - Ring 2 (mid):       Projects — tiles/squares with slight 3D tilt
  - Ring 3 (outer):     Papers — tall rectangles like scrolls
  - Ring 3 (outer):     Wonders — diamond/irregular shapes, photo thumbnails
- Canvas is pannable/draggable on desktop (pointer events, translateX/Y)
- Nodes have a slow CSS orbit animation (different durations per node = feels alive)
- Hovering a node: orbit pauses, node scales up, preview card appears beside it
- A filter strip floats at bottom-center: [All] [Thoughts] [Projects] [Papers] [Wonders]
- A breadcrumb floats top-left: "My World"
- Node count badge top-right: "12 nodes" in JetBrains Mono

### Act 3 — The Realm (deep dive, triggered by node click)
Each node type expands differently:

THOUGHT realm:
  - Canvas blurs/dims (backdrop: rgba(0,0,0,0.85))
  - Node expands via Framer Motion layoutId into a full readable card
  - Card: dark surface, subtle paper texture (CSS noise), the thought text in full
  - Timestamp, tags, a "related thoughts" row at bottom

PROJECT realm:
  - Node tile flips (CSS perspective 3D rotateY) to reveal full project info
  - Front: project name + thumbnail
  - Back: stack tags, description, KPIs, GitHub/live links
  - Or: expands to a case study modal (links to /work/[slug])

PAPER realm:
  - Node expands into a scrollable side panel (60vw on desktop, full on mobile)
  - Slides in from right (Framer Motion x: '100%' → 0)
  - Full MDX content renders inside — same as blog posts
  - Reading progress bar at top of panel

WONDER realm:
  - Full-viewport immersive takeover
  - Photo/image fills the screen with parallax effect
  - Short reflection text overlaid at bottom (Syne, large, semi-transparent)
  - Slow Ken Burns effect on the image (CSS animation)

### Act 4 — The Return
- Breadcrumb updates: "My World → Thoughts → [title]"
- Escape key closes realm and returns to hub
- Click anywhere on the dimmed canvas closes realm
- Breadcrumb "My World" click always returns to hub center

---

## Node Data Schema (Supabase)

```sql
create table brainbox_nodes (
  id            uuid default gen_random_uuid() primary key,
  type          text not null check (type in ('thought','project','paper','wonder')),
  title         text not null,
  summary       text,                    -- preview text (max 120 chars)
  content       text,                    -- full content (MDX string for papers/thoughts)
  tags          text[],
  image_url     text,                    -- for wonders and project thumbnails
  project_slug  text,                    -- if type=project, links to /work/[slug]
  external_url  text,                    -- optional external link
  orbit_ring    int default 2,           -- 1=inner, 2=mid, 3=outer
  orbit_angle   float,                   -- degrees (0-360), set on creation
  orbit_speed   float default 1.0,       -- multiplier for animation speed
  published     boolean default true,
  created_at    timestamptz default now()
);

alter table brainbox_nodes enable row level security;
create policy "Public read published" on brainbox_nodes
  for select using (published = true);
```

Seed with at least:
- 3 thoughts (ipinnuoluwa's actual reflections or placeholders)
- 3 projects (Autodrive, My Health Padi, iNSDEC — link to /work/[slug])
- 1–2 papers (long-form writing, can be placeholder MDX)
- 2 wonders (places, ideas, or phenomena that inspire him — use Unsplash URLs)

---

## Visual Language — Node Shapes & Colors

| Type     | Shape         | Color    | Hex     | Motion              |
|----------|---------------|----------|---------|---------------------|
| Thought  | Circle        | Purple   | #7F77DD | Slow float + drift  |
| Project  | Square/tile   | Accent   | #E8FF47 | Slow 3D tilt rotate |
| Paper    | Tall rect     | Teal     | #1D9E75 | Gentle sway         |
| Wonder   | Diamond/star  | Coral    | #D85A30 | Pulse + scale       |

Node sizes:
- Thought: 48×48px circle
- Project: 56×56px square, border-radius 8px
- Paper: 40×56px rect, border-radius 4px
- Wonder: 52×52px rotated 45deg square (diamond)

All nodes: border 0.5px solid [type-color], background [type-color] at 8% opacity
On hover: border increases to 1px, brightness 1.2, orbit pauses

---

## Preview Card (on hover)

Appears beside the node (right side, or left if near right edge).
Framer Motion: opacity 0→1, y 4→0, 150ms ease.

```
background: #111111
border: 0.5px solid #222220
border-radius: 12px
padding: 14px 16px
width: 220px
z-index: 10
pointer-events: none
```

Contents:
- Type badge (colored pill, JetBrains Mono 10px)
- Title (Syne 14px weight 700, #F5F5F0)
- Summary (DM Sans 12px weight 300, #888884, max 2 lines)
- Tags row (JetBrains Mono 10px, #444440)
- "Click to explore →" (11px, #E8FF47, appears after 300ms)

---

## Filter Strip (bottom-center, floating)

```
position: fixed, bottom: 28px, left: 50%, transform: translateX(-50%)
background: rgba(17,17,17,0.9)
border: 0.5px solid #222220
border-radius: 99px
padding: 8px 16px
display: flex, gap: 4px
backdrop-filter: blur(8px)
z-index: 10
```

Buttons: [All] [● Thoughts] [■ Projects] [▬ Papers] [◆ Wonders]
Active: bg #E8FF47, color #0A0A0A, border-radius 99px
Inactive: color #444440, hover color #F5F5F0
Clicking a type: non-matching nodes fade to opacity 0.1, scale 0.85

---

## Breadcrumb (top-left, floating)

```
position: fixed, top: 80px (below nav), left: 24px
font: JetBrains Mono 11px, color #444440
z-index: 10
```

States:
- Hub: "My World"
- Realm: "My World → Thoughts → On shipping fast"
Each segment is clickable. "My World" always returns to hub.

---

## Mobile Fallback

On screens ≤768px, the orbital canvas becomes a vertical scroll feed:
- Same dark background and grid
- Nodes appear as full-width cards (same visual language, colors, shapes as icons)
- Staggered fade-up on scroll (IntersectionObserver)
- Filter strip stays at bottom
- No drag/pan (not needed)
- Realm views are full-screen modals (same as desktop)
- The entry portal sphere still plays (reduced to 80px, centered)

This is NOT a degraded experience — it's a different but equally intentional layout.

---

## Performance Rules (non-negotiable)

1. Three.js: dynamic import ONLY for the entry sphere. Wrapped in Next.js dynamic()
   with { ssr: false }. Loads after the rest of the page.
   If Three.js fails or takes >3s, show a simple CSS pulsing circle fallback.

2. Node orbits: pure CSS animation (animation: orbit [Xs] linear infinite).
   No JavaScript physics. No canvas per node. No requestAnimationFrame loops
   per node. One CSS keyframe handles all orbit motion.

3. Lazy loading: IntersectionObserver fires when node enters viewport.
   Nodes start as opacity:0, transform:scale(0.8). Observer triggers entrance.

4. Images (Wonders): next/image with loading="lazy" and placeholder="blur".
   No full-res images in the orbit view — use thumbnails (400px wide max).
   Full image loads only when Wonder realm opens.

5. MDX (Papers): next/dynamic with suspense. Content renders only after click.

6. Supabase: fetch all published nodes on page load (single query, <50 nodes max).
   Cache in React state. No per-node fetching.

7. Animation budget: max 2 simultaneous CSS animations per node at any time.
   Orbit + hover-pause = fine. Orbit + hover + entrance + pulse = too much.

---

## File Structure

```
app/
  brainbox/
    page.tsx              ← main page, fetches nodes, renders canvas
    loading.tsx           ← entry portal (sphere + "Welcome to my world.")

components/
  brainbox/
    BrainboxCanvas.tsx    ← draggable canvas wrapper
    OrbitNode.tsx         ← individual node (type-aware rendering)
    NodePreview.tsx       ← hover preview card
    FilterStrip.tsx       ← bottom filter bar
    Breadcrumb.tsx        ← floating breadcrumb

    realms/
      ThoughtRealm.tsx    ← expanded thought card
      ProjectRealm.tsx    ← 3D flip project card / modal
      PaperRealm.tsx      ← sliding MDX panel
      WonderRealm.tsx     ← full-viewport immersive view

  three/
    EntrySphere.tsx       ← Three.js sphere, dynamically imported

lib/
  brainbox.ts             ← Supabase fetch for brainbox_nodes
  types/brainbox.ts       ← TypeScript types for node data
```

---

## TypeScript Types

```ts
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
```

---

## Framer Motion Patterns to Use

Entry stagger (nodes drifting out from center):
```ts
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 1.5 } }
}
const nodeVariants = {
  hidden: { opacity: 0, scale: 0, x: 0, y: 0 },
  show: (node: BrainboxNode) => ({
    opacity: 1, scale: 1,
    x: Math.cos(node.orbit_angle * Math.PI/180) * RING_RADIUS[node.orbit_ring],
    y: Math.sin(node.orbit_angle * Math.PI/180) * RING_RADIUS[node.orbit_ring],
    transition: { type: 'spring', stiffness: 60, damping: 15 }
  })
}
```

Realm open (shared element):
```ts
// OrbitNode and realm both use layoutId={`node-${node.id}`}
// Framer Motion animates between them automatically
<motion.div layoutId={`node-${node.id}`} />
```

Realm close:
```ts
// AnimatePresence wraps the realm
// exit: { opacity: 0, scale: 0.95 }, transition: { duration: 0.2 }
```

---

## Entry Sphere (Three.js — minimal)

```ts
// components/three/EntrySphere.tsx
// Wireframe icosahedron, slow Y rotation, accent color edges
// Size: 60px rendered, 1.0 units in Three.js
// No textures, no lighting complexity — just geometry

const geometry = new THREE.IcosahedronGeometry(1, 1)
const material = new THREE.MeshBasicMaterial({
  color: 0xE8FF47,
  wireframe: true,
  transparent: true,
  opacity: 0.6
})
// Rotate: mesh.rotation.y += 0.003 in animate loop
// After 1500ms: dispatch event to trigger node entrance
```

---

## Content to Seed (add real content or placeholders)

THOUGHTS (3):
1. "On shipping before you're ready" — reflection on Autodrive launch
2. "Why mechanical engineers make good product managers" — personal take
3. "The thing about Lagos" — short observation about building in Nigeria

PROJECTS (3 — link to existing /work entries):
1. Autodrive — orbit_ring: 2, link to /work/autodrive
2. My Health Padi — orbit_ring: 2, link to /work/my-health-padi
3. iNSDEC — orbit_ring: 2, link to /work/insdec

PAPERS (1):
1. "Cross-platform in 2025: Flutter vs React Native" — medium-length technical piece

WONDERS (2):
1. "The overview effect" — astronaut perspective on Earth (Unsplash space photo)
2. "What Lagos looks like from above" — aerial city photo + reflection

---

## Do NOT

- Do not use react-three-fiber for the nodes — only for the entry sphere
- Do not animate with JS setInterval or setTimeout loops per node
- Do not use position:fixed on any node (only on UI layer: breadcrumb, filter strip)
- Do not load all MDX content upfront — lazy load on realm open
- Do not add sound without a clearly muted-by-default toggle
- Do not use any prebuilt "galaxy" or "particle" Three.js library
- Do not replicate a standard blog layout anywhere on this page
- Do not use Lorem Ipsum — use real placeholder content from the seed list above

---

## Acceptance Criteria

- [ ] Entry portal sphere appears and nodes drift out within 2 seconds
- [ ] All 4 node types render with correct shapes and colors
- [ ] Hover preview cards appear/disappear cleanly
- [ ] Clicking each node type opens the correct realm
- [ ] Escape key and breadcrumb both close realms
- [ ] Filter strip correctly shows/hides node types
- [ ] Mobile layout renders as vertical scroll feed
- [ ] No layout shift or flash on realm open/close
- [ ] Three.js sphere has a CSS fallback if it fails to load
- [ ] Lighthouse performance score ≥ 85 (Three.js is the only heavy dep)
- [ ] All nodes fetched in a single Supabase query on page load

---

*This is the most experimental page on the site. Prioritize feel and exploration
over pixel-perfection. The chaos is intentional. The navigation is not.*
