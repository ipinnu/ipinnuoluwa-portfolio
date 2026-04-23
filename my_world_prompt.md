# My World — Solar System Blueprint + Build Prompt
### app/my-world/page.tsx · Next.js 14 · Three.js · Framer Motion · Supabase
### Reference aesthetic: petralithe.com — layered parallax depth, immersive scroll

---

## The Concept

A scrollable space experience. The visitor flies through a living solar system
representing Ipinnuoluwa's mind. Vertical scroll moves you deeper into space
(closer to or further from the sun). Horizontal scroll orbits within a planet's
system to see its moons. Every celestial body is a piece of content.

This page replaces the blog entirely.
URL: /my-world
Nav label: "My World"

---

## The Solar System — Full Cosmology

### ☀️ The Source (the sun)
- Abstract, pulsing, warm — not a person, a concept
- Represents the origin of all thought and creative energy
- Visual: large glowing sphere, #E8FF47 core fading to deep amber corona
- Slow rotation, subtle ray pulses outward (CSS animation)
- Not clickable. Cannot be entered. It just is.
- Text that fades in on first load near it: "Everything starts here."
- Position: center of the canvas, visible from the entry point

### 🪐 Planet 1 — The Forge
- Category: Active / executed projects. Real things that shipped.
- Color: #E8FF47 (accent) with dark industrial texture
- Texture feel: dense, metallic, like a working world with surface detail
- Ring: thin debris ring around it (CSS, not Three.js)
- Moons (each = one project):
  - Autodrive — largest moon, closest orbit
  - NYSC SAED — second moon
  - My Health Padi — third moon
  - iNSDEC — fourth moon
  - [New projects add as new moons automatically from Supabase]
- Hidden artifact: the Lock (see Asset Manager section below)

### 🌌 Planet 2 — The Chronicle
- Category: Thoughts, blogs, articles, personal philosophy
- Color: deep purple #534AB7 with gaseous swirling surface
- Texture feel: cloud-like, swirling, like a thought forming in real time
- No rings
- Moons (each = one post/article):
  - "On shipping before you're ready"
  - "Why mechanical engineers make good product managers"
  - "The thing about Lagos"
  - [New posts add as moons automatically]
- Moon appearance: softer, slightly translucent — thoughts are less solid than projects

### 🌊 Planet 3 — The Archive
- Category: Papers, prototypes, patents, concepts, technical marvels
- Color: deep teal #085041 with icy precise surface
- Texture feel: frozen, crystalline, like a research station on an ice world
- Has a faint glow — like light refracting through ice
- Moons (each = one piece of deep work):
  - "Cross-platform in 2025: Flutter vs React Native"
  - [Technical papers, prototype docs, patent ideas]
- Moon appearance: angular, more geometric — precision objects

### 🌒 Planet 4 — The Dream
- Category: Ideas not yet executed. Still gathering energy.
- Color: deep coral/amber #993C1D fading to near-black edges
- Texture feel: gaseous, undefined edges — a planet still forming, not yet solid
- Moons are visibly dimmer, slightly blurred, with a shimmer/haze effect
- Moons (each = one idea in progress):
  - Diaspora App
  - Security Company ("Of God")
  - Proden
  - Sacred Place
  - NCC App
  - Real Estate AR
- Moon label style: italic, slightly transparent — these aren't real yet

### ☄️ The Comet — featured / current obsession
- One fast-moving element that crosses the entire system
- Represents: current obsession, featured content, or monthly highlight
- Visual: elongated bright streak with a tail (CSS motion path)
- Clicking the comet opens a full-screen feature card
- Updated monthly via Supabase (single `comet` table row)
- Animation: travels across the canvas on a curved CSS motion path,
  loops every 30 seconds, subtle trail effect

---

## The Parallax Depth System (Petralithe technique)

The core visual magic. Multiple layers at different z-depths, each moving
at a different speed relative to scroll. This creates genuine 3D depth
without WebGL per-scene rendering.

### Layer Stack (back to front):

```
Layer 0 (z: 0)    — Deep space background. Pure #0A0A0A. Static.
Layer 1 (z: 1)    — Distant star field. Tiny dots, opacity 0.3. Moves at 0.1x scroll.
Layer 2 (z: 2)    — Mid stars + nebula hints. Slightly larger dots. Moves at 0.2x scroll.
Layer 3 (z: 3)    — The Source (sun). Moves at 0.3x scroll. Always somewhat visible.
Layer 4 (z: 4)    — The Dream (furthest planet). Moves at 0.45x scroll.
Layer 5 (z: 5)    — The Archive. Moves at 0.55x scroll.
Layer 6 (z: 6)    — The Chronicle. Moves at 0.65x scroll.
Layer 7 (z: 7)    — The Forge (closest planet, largest). Moves at 0.8x scroll.
Layer 8 (z: 8)    — Planet moons. Move at 0.9x scroll + own CSS orbit.
Layer 9 (z: 9)    — The Comet. Moves on independent motion path.
Layer 10 (z: 10)  — UI: breadcrumb, planet labels, filter. Fixed position.
```

### Implementation:
```ts
// On scroll, update CSS custom properties
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY
  document.documentElement.style.setProperty('--scroll', `${scrollY}px`)
})

// Each layer uses:
// transform: translateY(calc(var(--scroll) * -[SPEED]))
// where SPEED is the layer's parallax multiplier
```

This is the SAME technique as Petralithe — no Three.js for the parallax.
Three.js is used ONLY for the planet sphere geometries themselves.

---

## Scroll Journey — Section by Section

### Section 1: Entry (viewport 1)
- Pure dark canvas
- Star field fades in over 1s
- The Source glows into existence at center
- Text: "Welcome to my world." fades in below the sun (Syne, muted)
- Scroll indicator: subtle animated chevron at bottom

### Section 2: The Forge enters (viewport 2)
- Scrolling down brings The Forge in from the lower-right
- Planet grows as you approach (scale increases with scroll proximity)
- Planet label fades in: "The Forge — Built things"
- Moons become visible orbiting as you get closer
- Horizontal scroll hint appears: "← orbit →"

### Section 3: The Chronicle (viewport 3)
- The Forge recedes as The Chronicle rises from lower-left
- Color shift in the ambient light: purple hue bleeds into the star field
- Swirling surface animation becomes visible

### Section 4: The Archive (viewport 4)
- Teal light from The Archive creates a cool tone shift
- Ice-crystal refraction effect on nearby stars

### Section 5: The Dream (viewport 5)
- The furthest, haziest planet
- Stars are sparser here — you're at the edge of the known system
- The Dream's moons flicker slightly — still forming
- Text near it: "Not yet. But soon."

### Section 6: Deep space (viewport 6)
- Beyond The Dream — pure darkness
- A single text line: "The universe is still expanding."
- Comet passes through this section
- Footer navigation back to main site appears here

---

## Moon Interaction System

### Hover state:
- Moon slows its orbit
- Glows brighter (filter: brightness 1.4)
- Name label appears above it
- Cursor: pointer

### Click state:
- Canvas dims (rgba(0,0,0,0.85) overlay, Framer Motion)
- Moon expands via layoutId into a realm panel
- Each planet type has its own realm style:

**Forge realm (project):**
  - Dark card, full project details
  - Stack tags, role, outcome/KPIs
  - Screenshots if available
  - Links: GitHub, Play Store, live site
  - "View full case study →" → /work/[slug]

**Chronicle realm (thought/blog):**
  - Full MDX content renders in a scrollable panel
  - Reading time, date, tags
  - Share buttons: Twitter thread, LinkedIn, copy link

**Archive realm (paper/prototype):**
  - Scrollable technical panel
  - Code snippets supported (rehype-pretty-code)
  - External links for papers

**Dream realm (idea):**
  - Status indicators: gathering resources, early ideation, etc.
  - What it is, why it matters, what's needed to start
  - "Follow this dream" — optional email notification (Supabase)

---

## The Hidden Asset Manager (inside The Forge)

### The Lock Artifact
- A small, subtle artifact floating near The Forge
- Visually: looks like a small metallic gear or compass artifact
- First-time visitors have no reason to click it — it blends in
- No label, no tooltip, no hint

### The 3-Click Trigger
```ts
let clickCount = 0
let clickTimer: NodeJS.Timeout

artifact.addEventListener('click', () => {
  clickCount++
  clearTimeout(clickTimer)

  if (clickCount === 3) {
    openPasswordField()
    clickCount = 0
  } else {
    // Subtle feedback: artifact rotates slightly each click
    artifact.style.transform = `rotate(${clickCount * 45}deg)`
    clickTimer = setTimeout(() => {
      clickCount = 0
      artifact.style.transform = 'rotate(0deg)'
    }, 800)
  }
})
```

### Password Field Appearance
```
Framer Motion: opacity 0 → 1, scale 0.9 → 1, blur 8px → 0
Centered on screen, dark modal
Single input: type="password", placeholder="..."
Font: JetBrains Mono
On correct password: transition to Asset Manager dashboard
On wrong password: input shakes (CSS keyframe), clears
```

Password: set via environment variable `ASSET_MANAGER_PASSWORD`
Checked client-side (this is personal use, not security-critical)

### Asset Manager Dashboard (post-login)
Lives at the same URL, just a different view state.
Full spec in: asset_manager_prompt.md

---

## Supabase Schema

```sql
-- Celestial bodies (all content nodes)
create table celestial_nodes (
  id            uuid default gen_random_uuid() primary key,
  planet        text not null check (planet in ('forge','chronicle','archive','dream')),
  title         text not null,
  summary       text,
  content       text,           -- MDX string
  tags          text[],
  image_url     text,
  project_slug  text,           -- links to /work/[slug] for forge items
  external_url  text,
  status        text default 'active',  -- active | forming | archived
  orbit_speed   float default 1.0,
  published     boolean default true,
  created_at    timestamptz default now()
);

-- The comet (current obsession / featured)
create table comet (
  id          uuid default gen_random_uuid() primary key,
  title       text not null,
  summary     text,
  content     text,
  link_url    text,
  active      boolean default true,
  updated_at  timestamptz default now()
);

alter table celestial_nodes enable row level security;
alter table comet enable row level security;

create policy "Public read" on celestial_nodes for select using (published = true);
create policy "Public read comet" on comet for select using (active = true);
```

---

## TypeScript Types

```ts
export type Planet = 'forge' | 'chronicle' | 'archive' | 'dream'

export const PLANET_CONFIG = {
  forge: {
    name: 'The Forge',
    subtitle: 'Built things',
    color: '#E8FF47',
    textColor: '#1a1e05',
    size: 120,         // px radius
    scrollSection: 2,
    parallaxSpeed: 0.8,
    texture: 'industrial',
  },
  chronicle: {
    name: 'The Chronicle',
    subtitle: 'Thoughts & words',
    color: '#534AB7',
    textColor: '#EEEDFE',
    size: 100,
    scrollSection: 3,
    parallaxSpeed: 0.65,
    texture: 'gaseous',
  },
  archive: {
    name: 'The Archive',
    subtitle: 'Deep work',
    color: '#085041',
    textColor: '#E1F5EE',
    size: 90,
    scrollSection: 4,
    parallaxSpeed: 0.55,
    texture: 'crystalline',
  },
  dream: {
    name: 'The Dream',
    subtitle: 'Not yet. But soon.',
    color: '#993C1D',
    textColor: '#FAECE7',
    size: 110,
    scrollSection: 5,
    parallaxSpeed: 0.45,
    texture: 'forming',
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
  created_at: string
}
```

---

## File Structure

```
app/
  my-world/
    page.tsx              ← main page, data fetch, canvas setup
    loading.tsx           ← entry animation (stars + sun fade in)

components/
  my-world/
    SpaceCanvas.tsx       ← scroll listener, parallax layer manager
    StarField.tsx         ← procedurally generated star dots
    TheSun.tsx            ← Three.js sun sphere, corona pulse
    Planet.tsx            ← Three.js planet sphere, type-aware texture
    Moon.tsx              ← orbiting moon, click to open realm
    Comet.tsx             ← CSS motion path comet with trail
    LockArtifact.tsx      ← hidden 3-click artifact
    PlanetLabel.tsx       ← fade-in label as planet approaches
    Breadcrumb.tsx        ← floating navigation
    realms/
      ForgeRealm.tsx
      ChronicleRealm.tsx
      ArchiveRealm.tsx
      DreamRealm.tsx
    asset-manager/
      PasswordGate.tsx    ← 3-click trigger + password modal
      Dashboard.tsx       ← full asset manager (see separate prompt)
```

---

## Performance Rules

1. Three.js: used for planet spheres only (not the parallax, not the stars)
   Loaded via next/dynamic with ssr: false
   Max 4 sphere geometries + 1 for the sun = 5 Three.js objects total

2. Stars: pure CSS + SVG — absolutely no canvas per star
   Generate ~150 star dots procedurally in JS, render as divs with CSS

3. Parallax: CSS custom property scroll technique (see above)
   Zero requestAnimationFrame loops — scroll event → CSS var update only

4. Moons: CSS animation for orbit (animation: orbit Xs linear infinite)
   Different animation-duration per moon = organic feel, zero JS cost

5. Content: fetch all published celestial_nodes in ONE Supabase query on load
   Realm content (full MDX) loads lazily only when moon is clicked

6. Comet: CSS @keyframes with offset-path motion path
   Single element, single animation, near-zero cost

7. Mobile: parallax reduces to 50% intensity
   Planets stack vertically (no orbital canvas on mobile)
   Same realm interactions work identically on touch

---

## Seed Content

### The Forge moons:
- Autodrive (project_slug: autodrive, status: active)
- NYSC SAED (project_slug: nysc-saed, status: active)
- My Health Padi (project_slug: my-health-padi, status: active)
- iNSDEC (project_slug: insdec, status: active)

### The Chronicle moons:
- "On shipping before you're ready" (blog post)
- "Why mechanical engineers make good PMs" (philosophy)
- "The thing about Lagos" (personal reflection)

### The Archive moons:
- "Flutter vs React Native in 2025" (technical paper)
- "AutoDrive architecture deep dive" (prototype doc)

### The Dream moons (status: forming):
- Diaspora App
- Security Company
- Proden
- Sacred Place

### Comet (initial):
- Title: "What I'm obsessed with right now"
- Content: placeholder — update monthly

---

## Do NOT

- Do not use react-three-fiber — use vanilla Three.js only
- Do not animate stars with JS — CSS only
- Do not make the Lock artifact obvious — no tooltip, no label, no hint
- Do not use Lorem Ipsum — use seed content above
- Do not add audio without a clearly hidden muted-by-default toggle
- Do not replicate a blog layout anywhere on this page
- Do not use position:fixed on planets or moons — only on UI layer
- Do not build the Asset Manager dashboard in this prompt —
  that lives in asset_manager_prompt.md and is a separate build task

---

## Acceptance Criteria

- [ ] Parallax depth effect visible on scroll (at least 4 distinct depth layers)
- [ ] All 4 planets render with correct colors and sizes
- [ ] Moons orbit each planet with CSS animation
- [ ] Comet traverses the canvas on a curved path
- [ ] Clicking any moon opens the correct realm type
- [ ] Lock artifact exists in The Forge, invisible to casual visitors
- [ ] 3 clicks on artifact reveals password field
- [ ] Escape / breadcrumb closes all realms
- [ ] Mobile renders as vertical stack with same visual language
- [ ] Single Supabase query fetches all nodes on page load
- [ ] Lighthouse performance ≥ 82 (Three.js accepted cost)

---

*The chaos is the point. The navigation is not optional.*
*Every visitor should feel like they discovered something.*
