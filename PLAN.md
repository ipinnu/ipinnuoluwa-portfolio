# Portfolio Site — Master Plan
**Owner:** Ipinnuoluwa Oladipo  
**Stack:** Next.js 14 · React 18 · Framer Motion · Supabase · Three.js · Tailwind · Claude API  
**Deployed:** Netlify (main branch auto-deploys)  
**Date last updated:** 2026-04-28

---

## 1. What This Site Is

A personal portfolio with three distinct layers:

| Layer | URL | Purpose |
|---|---|---|
| Public portfolio | `/`, `/work`, `/about`, `/services`, `/hire` | Show work, attract clients |
| Blog | `/blog`, `/blog/[slug]` | MDX-based writing, view tracking |
| My World | `/my-world` | Interactive celestial universe — private tools + public showcase |
| Brainbox | `/brainbox` | 3D orbiting knowledge/ideas system |

The **My World** section is the creative core — a space canvas with four planets, each containing a different tool or content type. Most of this is what we've been actively building.

---

## 2. Tech Stack

```
Next.js 14.2 (App Router)
React 18
Framer Motion 12         — all animations
Supabase                 — database + storage + auth-adjacent
Three.js 0.183           — 3D canvas (Brainbox, entry sphere)
Tailwind CSS 3.4         — utility styling
JetBrains Mono + DM Sans + Syne — typography trio
Claude API (Anthropic)   — AI content adaptation in Chronicle
```

**Key env vars:**
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ANTHROPIC_API_KEY
NEXT_PUBLIC_CHRONICLE_KEY      — btoa-encoded password for Chronicle Studio
NEXT_PUBLIC_ASSET_MANAGER_KEY  — btoa-encoded password for Asset Manager
```

**Supabase tables:**
```
chronicle_articles     — articles (title, content, summary, tags, status, cover_image_url, slug)
social_vault           — staged social posts (article_id, platform, content, status)
celestial_nodes        — My World planet nodes (planet, title, summary, tags, status, project_slug)
brainbox_nodes         — Brainbox knowledge nodes
comet                  — active comet data (single active row)
contact_submissions    — hire form submissions
post_views             — blog view counts (slug → count)
chronicle-images       — Supabase Storage bucket (covers/, inline/)
```

---

## 3. Site Sections — Current State

### 3.1 Public Pages (`/`, `/work`, `/about`, etc.)

**Built and working:**
- Hero section with intro
- Marquee strip
- Services preview (accordion-style)
- Featured work grid (sourced from `lib/projects.ts` — hardcoded array)
- Process section
- Bottom CTA
- Project case study pages (`/work/[slug]`)
- About page
- Services page
- Hire page with contact form → saves to `contact_submissions` Supabase table

**Project images** stored in `/public/images/projects/`

### 3.2 Blog (`/blog`)

**Built and working:**
- MDX blog posts in `content/blog/`
- View counting (GET/POST `/api/views/[slug]` → Supabase `post_views`)
- Reading progress bar
- Copy link button
- Dynamic OG image generation (`/api/og`)
- Syntax highlighting (rehype-pretty-code + Shiki)

**Currently:** 1 published post — `how-i-shipped-autodrive-to-the-play-store.mdx`

### 3.3 Brainbox (`/brainbox`)

**Built and working:**
- 3D orbiting system with 4 node types: thought / project / paper / wonder
- Each node type has a different orbital ring radius and color
- Click node → detail panel slides in
- Filter strip (filter by type)
- Mobile version (`BrainboxMobile.tsx`)
- Data from Supabase `brainbox_nodes` (with seed fallback)

### 3.4 My World (`/my-world`)

The main creative section. A `SpaceCanvas` component renders:

- Background starfield
- The Sun (top-left, with glow)
- Comet (animated, sourced from Supabase `comet` table)
- 4 Planets orbiting in the space
- Artifacts: LockArtifact (opens Asset Manager), InkArtifact (opens Chronicle Studio)
- Click planet → opens planet realm scene

**Planet assignments:**
| Planet | Body | Accent Color | Content |
|---|---|---|---|
| The Forge | Mercury | `#E8FF47` (neon yellow) | Deployed projects |
| The Chronicle | Earth | `#534AB7` (purple-indigo) | Articles & writing |
| The Archive | Saturn | `#1D9E75` (teal) | Deep work / research |
| The Dream | Jupiter | `#993C1D` (burnt orange) | Future ideas |

**Color system:**
- `#A3C4B4` — sage green — identity/brand accent (used on Chronicle, hover states, etc.)
- `#82A898` — accent-dim (muted version)
- `#E8FF47` — neon yellow — The Forge / interactive accent

---

## 4. My World — Planet Scenes (Detailed)

### 4.1 Mercury / The Forge Scene (`MercuryForgeScene.tsx`)

**What it does:**
- Full-screen takeover with Mercury sphere + star background + sun glow
- Up to 5 "Installation" dots on Mercury surface — each linked to a `CelestialNode` (deployed project)
- Hover dot → tooltip with project name + summary
- Click dot → `ForgeDetail` panel slides in
- Detail panel shows: title, status badge, tags, "View case study" → `/work/[slug]`, "External" link
- Escape → back to surface → back to space canvas

**Mobile:** Full-screen overlay for detail panel (not side-by-side)

**Data source:** `celestial_nodes` where `planet = 'forge'`

**Seed fallback projects:** AutoDrive, NYSC SAED, My Health Padi, iNSDEC

---

### 4.2 Chronicle / Earth Scene (`ChronicleEarthScene.tsx`)

**What it does:**
- Earth sphere with orbiting elements
- Clickable nodes representing published articles
- Click node → article detail

**Note:** Less active development here. Primary Chronicle experience is the Chronicle Studio.

---

### 4.3 Saturn / Archive Scene (`SaturnArchiveScene.tsx`)

**What it does:**
- Saturn sphere with rings
- Archive/deep work content

---

### 4.4 Jupiter / Dream Scene (`JupiterDreamScene.tsx`)

**What it does:**
- Jupiter sphere
- Future ideas / forming concepts

---

## 5. Chronicle Studio (The Writing System)

**Access:** InkArtifact in My World → password gate → full studio  
**Password:** `NEXT_PUBLIC_CHRONICLE_KEY` env var (btoa encoded)  
**File:** `components/my-world/chronicle-studio/ChronicleStudio.tsx`

### Three Modes

#### Write Mode
- Left sidebar: article list (drafts / published), "+ New Article" button
- Main area: title input, summary input, content textarea (markdown)
- Cover image upload → Supabase Storage `chronicle-images/covers/`
- Inline image insert → Supabase Storage `chronicle-images/inline/`
- Keyboard shortcuts: ⌘B bold, ⌘I italic, ⌘S save, Tab → 2 spaces
- Auto-save with 1.5s debounce
- Preview mode toggle (renders markdown)
- Tags system (type + Enter/comma to add)
- Status toggle: draft ↔ published
- Word count in header

#### Distribute Mode
- Select an article → adapt with AI
- Note input field for direction ("focus on Lagos angle, keep it short...")
- Claude API call (`/api/adapt-content`) generates:
  - Twitter/X thread (280 char limit awareness)
  - LinkedIn post (3000 char)
  - Instagram caption (2200 char)
- Each platform card: editable textarea, char counter, regenerate button (↻), Post button, Save to vault (💾)
- Post button: opens platform + copies to clipboard

#### Vault Mode
- Queue of saved-but-not-posted content
- Filter by platform (twitter/linkedin/instagram) or status (ready/posted)
- Each item: content preview, → Post button, "mark posted", delete
- Badge on Vault tab showing count of ready items

### API Route: `/api/adapt-content`

**Method:** POST  
**Payload:** `{ title, content, summary, note?, platform? }`  
- `platform` = single platform for regenerate (optional, defaults to all three)  
**Returns:** `{ twitter: string, linkedin: string, instagram: string }`  
**Model:** Claude (system prompt: full distribution engine persona — Ipinnu's voice, platform-specific formatting)

### Chronicle Mobile (DONE — 2026-04-28)

**Problem:** 216px sidebar ate the writing area on mobile.  
**Fix applied:**
- `useIsMobile()` hook added
- `sidebarOpen` state: auto-collapses when article selected on mobile, auto-opens when nothing selected
- Sidebar on mobile = absolute overlay (82vw width, `z-index: 20`, `#06060E` bg)
- Dark backdrop (`z-index: 19`) — tap to dismiss
- `≡` toggle button in header (right side), only on mobile
- Word count hidden on mobile to keep header clean

---

## 6. Mercury Asset Manager

**Access:** LockArtifact in My World → password gate → dashboard  
**Password:** `NEXT_PUBLIC_ASSET_MANAGER_KEY` env var (btoa encoded)  
**Files:**
- `components/my-world/asset-manager/Dashboard.tsx`
- `components/my-world/asset-manager/PasswordGate.tsx`
- Types + seed data: `lib/types/celestial.ts`

**Storage:** localStorage only (key: `ip_asset_ledger`) — private, device-only

### Current State (What's Built)

**Left panel — Asset Ledger:**
- Portfolio health bar (% of assets with mandateProgress >= 50)
- Class filter: ALL / CLASS A / CLASS B / CLASS C
- Asset list rows showing: status dot, name, class badge, return type pills, mandate progress bar
- Rebalance button → shows allocation breakdown view
- "Welcome back, Ipinnuoluwa." typewriter on load

**Right panel — Asset Detail:**
- Class + status badge
- 2×2 score grid: revenue / impact / strategic / momentum (each 0–5, with ScoreBar)
- Total score /20 with color coding (≥16 yellow, ≥11 orange, <11 red)
- Allocation bar (out of 100u)
- Mandate text + progress slider (0–100%)
- Actions checklist (check/uncheck)
- Quick links (case study, github)

**Rebalance View:**
- Bar chart of allocation per asset (Class A/B/C colored)
- Total deployed / Class A / Class B summary

### Asset Classes (BlackRock-Inspired)
```
CLASS A — Core positions (deployed, highest conviction, active)
CLASS B — Forming positions (emerging, building conviction)
CLASS C — Monitor universe (thesis only, option value, no allocation)
```

### Current SEED_ASSETS (stored in `lib/types/celestial.ts`)
```
CLASS A:
- NYSC SAED (35u) — revenue/impact/brand — active — mandate 80%
- AutoDrive (30u) — revenue/strategic — active — mandate 65%
- Freelance/BrainBox (20u) — revenue/brand — active — mandate 70%

CLASS B:
- Diaspora App (8u) — strategic/impact — forming — mandate 20%
- Security Company (7u) — strategic — forming — mandate 10%

CLASS C (0u allocated):
- Proden — strategic — monitor
- NCC App — revenue — monitor
- Real Estate AR — revenue — monitor
- Sacred Place — strategic — monitor
```

### Asset Type (current fields in `lib/types/celestial.ts`)
```typescript
interface Asset {
  id: string
  name: string
  assetClass: 'A' | 'B' | 'C'
  allocation: number
  returnTypes: ('revenue' | 'impact' | 'brand' | 'strategic')[]
  status: 'active' | 'forming' | 'monitor'
  mandateText: string
  mandateProgress: number
  scores: { revenue: number; impact: number; strategic: number; momentum: number }
  actions: { text: string; done: boolean }[]
  lastReviewed: string
  thesis?: string          // ← ADDED 2026-04-28
  links?: { playStore?: string; github?: string; caseStudy?: string }
}
```

---

## 7. Asset Manager — Planned Upgrades (NOT YET BUILT)

**Discussed and agreed on 2026-04-28. Build these next.**

### 7.1 Editable Fields

All of these should update via `updateAsset(id, patch)` → persisted to localStorage.

- **Scores** — `+` / `−` buttons on each score card (min 0, max 5)
- **Mandate text** — click to edit → textarea → auto-save on blur
- **Status badge** — click to cycle: `active → forming → monitor → active`
- **Mark reviewed** — button next to "Last reviewed: ..." → sets today's date
- **Investment Thesis** (`thesis` field) — new section, pencil toggle to edit, textarea, save on blur
- **Add action** — input at bottom of actions list + "Add" button (or Enter to submit)
- **Delete action** — × button on each action item

### 7.2 Enhanced Rebalance View (BlackRock Portfolio Analytics)

Replace the current simple bar chart with:

**A. Class Allocation vs Target Bands**
```
Target guidance (BlackRock-inspired):
  CLASS A → 80–90% of total allocation
  CLASS B → 10–15%
  CLASS C → 0% (monitor only)

Show: current % vs target band, with GREEN/AMBER/RED signal
```

**B. Return Type Factor Exposure**
Aggregate across all assets weighted by allocation:
- What % of your deployed capital is chasing `revenue`?
- What % `impact`, `brand`, `strategic`?
- Identify imbalance (e.g. "80% revenue-weighted — low impact/strategic diversification")

**C. Top Priority Actions**
Pull all `done: false` actions from Class A assets.  
Show them ranked — a single "portfolio next actions" list.

**D. Portfolio IPS Summary**
Static header card:
```
INVESTMENT MANDATE
Core doctrine: Deploy capital toward highest-conviction revenue-generating assets.
Maintain Class A concentration > 80%. Review all positions every 30 days.
```

### 7.3 Storage Decision (Discuss Before Building)

**Option 1: Stay localStorage** — private, no Supabase needed, instant, no auth  
**Option 2: Supabase table** — syncs across devices, proper persistence, needs a `assets` table  

Currently localStorage. User to decide before building.

---

## 8. API Routes — Detailed

### `POST /api/adapt-content`

Adapts a Chronicle article for social platforms using Claude.

**Request:**
```json
{
  "title": "Article title",
  "content": "Full article markdown",
  "summary": "Short summary",
  "note": "Optional direction from user",
  "platform": "twitter"  // Optional: only regenerate one platform
}
```

**Response:**
```json
{
  "twitter": "Thread content...",
  "linkedin": "LinkedIn post...",
  "instagram": "Caption..."
}
```

**System prompt:** Full distribution engine with Ipinnu's voice, platform-specific formatting rules, character limits.

---

## 9. Color System Reference

```
#A3C4B4   — sage green — primary accent (identity, Chronicle, saved states)
#82A898   — accent-dim — muted sage
#E8FF47   — neon yellow — The Forge accent (interactive, CTAs in dark contexts)
#534AB7   — indigo — Chronicle/Earth
#1D9E75   — teal — Archive/Saturn
#993C1D   — burnt orange — Dream/Jupiter
#22c55e   — green — active/published/success states
#EF9F27   — amber — forming/in-progress states
#ef4444   — red — over-limit/error states
#06060E   — deepest background
#080810   — panel background
#0D0D0D   — card background
#F5F5F0   — primary text
#888884   — secondary text
#444440   — muted text
#333330   — very muted text
#1A1A24   — border color
```

**Fonts:**
```
var(--font-syne)              — headings, display, planet names
var(--font-dm-sans)           — body text, UI prose
var(--font-jetbrains-mono)    — labels, metadata, mono UI
```

---

## 10. File Map (Key Files Only)

```
app/
  page.tsx                    — Home
  my-world/page.tsx           — My World entry
  brainbox/page.tsx           — Brainbox entry
  blog/page.tsx               — Blog listing
  blog/[slug]/page.tsx        — Blog post
  work/[slug]/page.tsx        — Case study
  api/adapt-content/route.ts  — Claude API (social distribution)
  api/views/[slug]/route.ts   — View counting

components/
  my-world/
    SpaceCanvas.tsx           — Main My World orchestrator
    Planet.tsx                — Planet component
    asset-manager/
      Dashboard.tsx           — Asset Manager UI
      PasswordGate.tsx        — Password gate
    chronicle-studio/
      ChronicleStudio.tsx     — Chronicle Studio (write/distribute/vault)
    realms/
      MercuryForgeScene.tsx   — Mercury / Forge scene
      ChronicleEarthScene.tsx — Earth / Chronicle scene
      SaturnArchiveScene.tsx  — Saturn / Archive scene
      JupiterDreamScene.tsx   — Jupiter / Dream scene

lib/
  types/celestial.ts          — Planet configs, CelestialNode, Asset, SEED_ASSETS
  celestial.ts                — Supabase fetchers for celestial/comet data
  projects.ts                 — Hardcoded project array
  brainbox.ts                 — Supabase fetchers for brainbox nodes

hooks/
  useIsMobile.ts              — Responsive hook (breakpoint: 768px)

content/blog/
  how-i-shipped-autodrive-to-the-play-store.mdx
```

---

## 11. What's Done vs What's Next

### ✅ Done
- Full public site (home, work, about, services, hire)
- Blog with MDX, views, OG images
- Brainbox 3D system
- My World space canvas with all 4 planets
- All 4 planet realm scenes
- Mercury Forge Scene (installation dots, detail panel)
- Chronicle Studio — Write, Distribute, Vault modes
- Chronicle AI distribution via Claude API
- **Chronicle mobile sidebar collapse (done 2026-04-28)**
- **Mercury Asset Manager — full BlackRock rebuild (done 2026-04-28)**
  - `lib/types/forge.ts` — all types + DB mappers + seed data
  - `lib/assets.ts` — Supabase CRUD (fetch, update, create, seedIfEmpty)
  - `lib/visions.ts` — Supabase CRUD (fetch, update)
  - `lib/floor.ts` — localStorage (get, set, isStale, worstSignal)
  - `FloorBar.tsx` — peace/sovereignty signals, update modal, portfolio lock
  - `VisionLayer.tsx` — 3 vision cards, collapsible, horizontal scroll mobile
  - `TensileMap.tsx` — SVG diagram (game → visions → assets → floor), animated lines
  - `AssetLedger.tsx` — rows with vision dots, exit indicators, floating section
  - `AssetDetail.tsx` — editable scores/mandate/thesis/exit, add/delete actions, vision connections, floor trace
  - `RebalanceView.tsx` — IPS, class targets vs bands, factor exposure, vision coverage, priority actions
  - `Dashboard.tsx` — orchestrator, Supabase data loading, mobile panel routing
  - `supabase/forge_migration.sql` — assets + visions tables + full seed data

### ⚠ USER ACTION REQUIRED — Run SQL migration
Go to Supabase dashboard → SQL Editor → paste and run `supabase/forge_migration.sql`
This creates the `assets` and `visions` tables and seeds all data.
Without this, the app falls back to in-memory seed data (works but changes don't persist).

### 🔲 Backlog
- More blog posts (content)
- Case study pages for all projects (currently only some have full case study content)
- Brainbox: add more nodes to Supabase
- My World: Chronicle Earth Scene interactions (currently less developed than Forge)
- My World: Archive/Dream scenes need more interaction depth
- Comet: dynamic comet data from Supabase (current state unknown)
- Dark/light mode considerations
- Performance audit (Three.js bundle size)

---

## 12. Session Notes (2026-04-28)

**Chronicle mobile fix — what was changed:**
- `ChronicleStudio.tsx` — added `useIsMobile` import
- Added `isMobile` (hook) + `sidebarOpen` (state, default `true`)
- Added `useEffect` — auto-collapses sidebar when article selected on mobile, re-opens when deselected
- Body div — added `position: relative` (needed for absolute sidebar overlay)
- Sidebar — conditionally renders `(!isMobile || sidebarOpen)`, on mobile: `position: absolute`, `82vw` wide, `z-index: 20`, `#06060E` bg
- Dark backdrop (z-index 19, tap to close) when sidebar open on mobile
- `≡` toggle button added in header right side (mobile only)
- Word count hidden on mobile

**Asset Manager — discussed but NOT yet built:**
- Agreed on BlackRock-inspired upgrades (see section 7 above)
- `thesis?: string` field added to `Asset` interface in `lib/types/celestial.ts`
- Storage decision (localStorage vs Supabase) pending user decision before building
