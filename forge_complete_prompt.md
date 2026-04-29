# The Forge — Complete Build Prompt
### MercuryForgeScene.tsx + Asset Manager Dashboard + Vision Layer
### Planet: Mercury · Color: #E8FF47 · Private command center

---

## Architecture — The Tensile Structure

The Forge private layer is built on a specific philosophy.
This is not aesthetic — it determines how every component relates to every other.

```
        ★  VISION (pulls upward)
        │  Three visions. The directional force.
        │  Variable — evolves intentionally, not reactively.
        │
    ────┼────  THE GAME (emergent)
        │  The compiled picture of all visions weighted right now.
        │  Not defined separately — emerges from vision weights.
        │
       [A] [A] [B] [B] [C]   ASSETS (the tension members)
        │  Each traces UP to a vision and DOWN to the floor.
        │  Without assets, vision floats. Floor and vision disconnect.
        │  Assets are the connective work — ideal made real.
        │
    ════╪════  THE FLOOR (holds everything)
        Peace · Sovereignty
        Immutable. The gravity. Non-negotiable.
```

The system reads top to bottom in the UI but operates bottom to top in logic:
- Floor must be stable before anything runs
- Visions must be defined before assets are evaluated
- Assets are judged by how well they serve both floor and vision simultaneously

---

## PART A — PUBLIC LAYER (no changes needed this session)

`MercuryForgeScene.tsx` is working. Leave it untouched.
Public installation dots → ForgeDetail panel → celestial_nodes data.
This is separate from everything below.

---

## PART B — PRIVATE LAYER (full build)

Accessed via: LockArtifact → 3 clicks → PasswordGate → Dashboard

### File structure
```
components/my-world/asset-manager/
  Dashboard.tsx          ← main orchestrator (update existing)
  FloorBar.tsx           ← new component
  VisionLayer.tsx        ← new component
  TensileMap.tsx         ← new component (the visual diagram)
  AssetLedger.tsx        ← extract from Dashboard (refactor)
  AssetDetail.tsx        ← extract from Dashboard (refactor)
  RebalanceView.tsx      ← extract from Dashboard (refactor)

lib/
  assets.ts              ← Supabase CRUD for assets table
  visions.ts             ← Supabase CRUD for visions table
  floor.ts               ← localStorage for floor state (2 questions only)
  types/forge.ts         ← all TypeScript types for this system
```

---

## PART C — Supabase Schema

Run these migrations in order:

### C1 — Assets table (replaces localStorage)
```sql
create table assets (
  id                text primary key,
  name              text not null,
  asset_class       text not null check (asset_class in ('A','B','C')),
  allocation        int not null default 0,
  return_types      text[] not null default '{}',
  status            text not null default 'monitor'
                    check (status in ('active','forming','monitor')),
  mandate_text      text not null default '',
  mandate_progress  int not null default 0
                    check (mandate_progress between 0 and 100),
  scores            jsonb not null default
                    '{"revenue":0,"impact":0,"strategic":0,"momentum":0}',
  actions           jsonb not null default '[]',
  last_reviewed     text not null default '',
  thesis            text,
  exit_condition    text,           -- when do I stop holding this?
  vision_ids        text[] default '{}',  -- which visions this serves
  links             jsonb,
  updated_at        timestamptz default now()
);

alter table assets enable row level security;
create policy "Public read" on assets for select using (true);
create policy "Service write" on assets for all
  using (auth.role() = 'service_role');
```

### C2 — Visions table (new)
```sql
create table visions (
  id            text primary key,   -- e.g. 'sovereign-ground'
  title         text not null,
  description   text not null,
  floor_link    text not null,      -- how this expresses peace or sovereignty
  time_horizon  text not null,      -- custom string e.g. "12 months", "ongoing"
  game_weight   int not null default 0
                check (game_weight between 0 and 100),
  status        text not null default 'active'
                check (status in ('active','forming','realized','paused')),
  display_order int not null default 0,
  updated_at    timestamptz default now()
);

alter table visions enable row level security;
create policy "Public read" on visions for select using (true);
create policy "Service write" on visions for all
  using (auth.role() = 'service_role');
```

### C3 — Seed visions
```sql
insert into visions (id, title, description, floor_link, time_horizon, game_weight, status, display_order)
values
(
  'sovereign-ground',
  'Sovereign Ground',
  'Move out. Own my space. Remove the last physical constraint on autonomy. My environment should be mine — my rules, my peace, my rhythm.',
  'Sovereignty — physical environment is the most tangible expression of autonomy. You cannot fully own your life in someone else''s space.',
  '12 months',
  35,
  'active',
  1
),
(
  'income-independence',
  'Income Independence',
  'Build income streams I own completely. No single employer controls my stability. Revenue from what I build, not from permission someone else grants.',
  'Sovereignty — financial autonomy is the economic expression of the floor. Income you don''t own is autonomy you''re renting.',
  '18 months',
  30,
  'active',
  2
),
(
  'the-living-room',
  'The Living Room',
  'Build a vivid community and place to express, connect, and share innately. A space where who I am has a spot — not waiting for the world to make room, but building the room myself. Sharing what I''m building and thinking. Connecting with people who resonate.',
  'Peace — the deep floor statement: who I am has a spot in the world. Expression is downstream of sovereignty being intact.',
  '3 years',
  35,
  'active',
  3
);
```

### C4 — Update SEED_ASSETS with vision_ids + exit_condition

Map each asset to vision IDs:
```
NYSC SAED         → vision_ids: ['income-independence', 'the-living-room']
                    exit_condition: "Program ends OR income threshold reached OR state expansion secured"

AutoDrive         → vision_ids: ['income-independence', 'sovereign-ground']
                    exit_condition: "10,000 active users OR ₦500k/month revenue OR acquisition offer"

Freelance/BrainBox → vision_ids: ['income-independence', 'sovereign-ground']
                    exit_condition: "Replaced by product revenue exceeding freelance income 3 months running"

Diaspora App      → vision_ids: ['the-living-room', 'income-independence']
                    exit_condition: "MVP live with 100 users OR co-founder found and funded"

Security Company  → vision_ids: ['sovereign-ground', 'income-independence']
                    exit_condition: "Whitepaper complete + co-founder identified OR concept pivoted"

Proden            → vision_ids: ['the-living-room']
                    exit_condition: "Enters active development OR archived after 12 months idle"

NCC App           → vision_ids: ['income-independence']
                    exit_condition: "Market validation complete OR archived"

Real Estate AR    → vision_ids: ['income-independence']
                    exit_condition: "Funded prototype OR archived after 6 months"

Sacred Place      → vision_ids: ['the-living-room']
                    exit_condition: "Development begins OR merged into another project"
```

---

## PART D — TypeScript Types

```typescript
// lib/types/forge.ts

export type AssetClass = 'A' | 'B' | 'C'
export type AssetStatus = 'active' | 'forming' | 'monitor'
export type ReturnType = 'revenue' | 'impact' | 'brand' | 'strategic'
export type VisionStatus = 'active' | 'forming' | 'realized' | 'paused'
export type FloorSignal = 'stable' | 'pressured' | 'shaking'

export interface Asset {
  id: string
  name: string
  assetClass: AssetClass
  allocation: number
  returnTypes: ReturnType[]
  status: AssetStatus
  mandateText: string
  mandateProgress: number
  scores: {
    revenue: number
    impact: number
    strategic: number
    momentum: number
  }
  actions: { text: string; done: boolean }[]
  lastReviewed: string
  thesis?: string
  exitCondition?: string
  visionIds: string[]
  links?: {
    playStore?: string
    github?: string
    caseStudy?: string
  }
}

export interface Vision {
  id: string
  title: string
  description: string
  floorLink: string
  timeHorizon: string
  gameWeight: number        // 0-100, all active visions should sum to 100
  status: VisionStatus
  displayOrder: number
}

export interface FloorState {
  peace: FloorSignal
  sovereignty: FloorSignal
  lastUpdated: string
}

// Derived — never stored, always computed
export interface GameSnapshot {
  dominantVision: Vision        // highest game_weight
  compiledWeight: number        // sum of all active vision weights (should = 100)
  assetsPerVision: Record<string, Asset[]>
  floatingAssets: Asset[]       // assets with no vision_ids
  currentPhase: string          // derived label e.g. "Stabilization"
}
```

---

## PART E — Dashboard Layout

Full-screen overlay. Background: rgba(6,6,14,0.97).
Three zones stacked vertically, each always visible.

```
┌─────────────────────────────────────────────────────┐
│  FLOOR BAR                                    [×]   │  ← always top
├─────────────────────────────────────────────────────┤
│  VISION LAYER + TENSILE MAP                         │  ← always visible
│  (collapsible to 48px when user wants more space)   │
├─────────────────────────────────────────────────────┤
│  LEFT: ASSET LEDGER  │  RIGHT: ASSET DETAIL         │  ← main workspace
│                      │  (or REBALANCE VIEW)         │
└─────────────────────────────────────────────────────┘
```

---

## PART F — FloorBar.tsx

Always visible. Top of dashboard. Never hidden.

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│  THE FLOOR          [Peace: ●]  Stable    [Sovereignty: ●]  Stable   [Update] │
└─────────────────────────────────────────────────────────────────────────────┘
```

### States per signal

```
stable:    dot color #22c55e, pulse animation, text "Stable" #22c55e
pressured: dot color #EF9F27, slow pulse, text "Under pressure" #EF9F27
shaking:   dot color #ef4444, fast pulse, text "Shaking" #ef4444
```

### Portfolio lock logic

If either signal is 'shaking':
- Asset ledger dims to opacity 0.25
- A centered overlay appears over the ledger:
  ```
  ┌──────────────────────────────────┐
  │                                  │
  │   Stabilize the floor.           │
  │   The portfolio waits.           │
  │                                  │
  │   [Update floor status]          │
  │                                  │
  └──────────────────────────────────┘
  ```
  Syne 18px, #888884. Button opens floor update modal.

If either signal is 'pressured':
- Amber banner across top of ledger (not a lock):
  ```
  ⚠  Floor under pressure. Review before deploying more.
  ```
  Background #1f1505, border-bottom #EF9F27, text #EF9F27.
  JetBrains Mono 11px.

### [Update] button → modal
Simple modal, dark surface:
```
How are you feeling right now?

PEACE           [Stable ▼]     dropdown: Stable / Under pressure / Shaking
SOVEREIGNTY     [Stable ▼]     dropdown: Stable / Under pressure / Shaking

[Save]
```
Saves to localStorage (key: `ip_floor_state`) — this is personal + ephemeral.
Includes timestamp. On next dashboard open, if saved > 24hrs ago,
show: "Floor status last updated [X] hours ago. Still accurate?"

---

## PART G — VisionLayer.tsx + TensileMap.tsx

### VisionLayer — the three visions

Sits below FloorBar, above the ledger.
Collapsible — header always shows, content toggles.

**Expanded state:**

Three vision cards side by side (horizontal scroll on mobile).
Sorted by game_weight descending — most important always leftmost.

Each card:
```
┌─────────────────────────────────┐
│  [35%]  SOVEREIGN GROUND    [●] │  ← game weight + status dot
│  ─────────────────────────────  │
│  Move out. Own my space.        │  ← description (2 lines max)
│  Remove the last physical       │
│  constraint on autonomy.        │
│                                 │
│  Floor link:                    │
│  Sovereignty — physical env     │  ← floor_link (italic, muted)
│                                 │
│  Horizon: 12 months             │  ← time_horizon
│  Assets: AutoDrive, Freelance   │  ← connected assets (pill tags)
│                                 │
│  [Edit]                         │
└─────────────────────────────────┘
```

Card accent color: left border 3px, color matches vision weight rank:
- Rank 1 (heaviest): #E8FF47
- Rank 2: #A3C4B4
- Rank 3: #534AB7

Game weight pill: JetBrains Mono, top-right of card.
If weights don't sum to 100: show warning: "⚠ Weights sum to [X]%. Adjust to 100%."

**Collapsed state:**
```
[VISIONS]  ★ Sovereign Ground (35%) · Income Independence (30%) · The Living Room (35%)  [▼]
```
One line. Vision titles + weights. Clickable to expand.

### TensileMap.tsx — the visual diagram

Rendered as SVG inside the VisionLayer (below the cards when expanded).
Shows the tensile structure dynamically based on real data.

```
         ★ THE GAME
        /     |     \
      V1      V2      V3        ← vision nodes, sized by game_weight
      |\ \   /|   / /|
      |  \ \/  \ / / |
     [A] [A]  [B] [B] [C]      ← asset nodes
      |    |   |   |   |
      ════════════════════
           THE FLOOR
       Peace · Sovereignty
```

SVG implementation:
- Vision nodes: circles, radius proportional to game_weight
- Asset nodes: squares (Class A), rounded squares (Class B), small squares (Class C)
- Connection lines: from each asset to its vision(s) — thin, #1A1A24, opacity 0.6
- Floating assets (no vision): shown below the floor line, red tint
- Floor: thick horizontal line, #E8FF47, 2px
- The Game: top node, pulsing, shows dominant vision label

Hover asset node → highlights its connection lines → shows asset name tooltip
Hover vision node → highlights all assets connected to it
Click any node → selects that asset/vision in the main panel

Animation on load: lines draw from floor upward (SVG stroke-dashoffset animation, 1s)

---

## PART H — Asset Ledger (existing, surgically upgraded)

### New columns in asset rows
Add two new visual elements to each row:

**Vision dots** — small colored dots showing which visions this asset serves:
```
[●] [●]    ← one dot per connected vision, colored by vision rank
```
Hover dots → tooltip: "Sovereign Ground · Income Independence"

**Exit condition indicator** — thin right edge:
```
If exit_condition exists: right border 2px #1A1A24 (subtle)
If exit_condition empty:  right border 2px #3a1a05 (amber warning — no exit defined)
```

### Floating assets section
At bottom of ledger, below Class C assets:
```
─── FLOATING ───────────────────────────────
⚠  These assets have no vision connection.
   [Asset name]   [Connect to vision ▼]
```
Dropdown lets you assign a vision inline.
`updateAsset(id, { visionIds: [selectedVisionId] })`

---

## PART I — Asset Detail (existing, surgically upgraded)

### New sections to add (in order, after existing sections):

**Exit Condition** (after thesis section)
```
[EXIT CONDITION]  ✎
────────────────────────────────────────────
10,000 active users OR ₦500k/month revenue
OR acquisition offer received.
────────────────────────────────────────────
```
Same pencil edit pattern as mandate and thesis.
If empty: "No exit condition defined. Click ✎ to add one." (italic, amber)
`updateAsset(id, { exitCondition: newText })`

**Vision Connections** (after exit condition)
```
[SERVING THESE VISIONS]
┌──────────────────────┐  ┌──────────────────────┐
│ ● Sovereign Ground   │  │ ● Income Independence │
│   35% of game        │  │   30% of game         │
└──────────────────────┘  └──────────────────────┘
[+ Connect to vision]
```
Clicking a vision card → navigates to that vision in VisionLayer
[+ Connect to vision] → dropdown of all visions → adds to visionIds
[×] on each card → removes connection

**Floor Trace** (below vision connections)
```
[FLOOR TRACE]
This asset → Income Independence
             └── "Sovereignty — financial autonomy is the economic
                  expression of the floor."
             └── THE FLOOR: Sovereignty
```
Auto-generated from vision connections. Not editable.
Shows the chain: asset → vision → floor link → floor principle.
If asset has no vision: "No floor trace. Connect to a vision first."
Color: muted, #444440, DM Sans 13px italic.

---

## PART J — Enhanced Rebalance View

Replace existing rebalance view with four sections:

### J1 — Investment Policy Statement (static)
```
┌──────────────────────────────────────────────────────────┐
│ INVESTMENT POLICY STATEMENT                              │
│ 3px left border: #A3C4B4                                 │
│                                                          │
│ Core doctrine: Deploy capital toward highest-conviction  │
│ assets that serve active visions and uphold the floor.   │
│ Maintain Class A concentration > 80%.                    │
│ Review all positions every 30 days.                      │
│ No asset holds without a vision connection.              │
└──────────────────────────────────────────────────────────┘
```

### J2 — Class Allocation vs Target Bands
```
CLASS A   ████████████████████   85u  85%   TARGET 80–90%   ✓
CLASS B   ████                   15u  15%   TARGET 10–15%   ✓
CLASS C   ░                       0u   0%   TARGET 0%        ✓
```
Signal: ✓ green / ⚠ amber / ✗ red based on target band logic.
Bars animate 0 → value on mount (0.6s ease-out, stagger 0.08s).

### J3 — Vision Coverage Analysis
```
VISION COVERAGE

Sovereign Ground (35%)
  Assets serving: AutoDrive (30u) · Freelance (20u)
  Total capital: 50u  Coverage: ████████████  Strong

Income Independence (30%)
  Assets serving: NYSC SAED (35u) · AutoDrive (30u) · Freelance (20u)
  Total capital: 85u  Coverage: ████████████████  Strong

The Living Room (35%)
  Assets serving: NYSC SAED (35u) · Diaspora (8u)
  Total capital: 43u  Coverage: ████████  Moderate
  ⚠ Highest game weight but lowest capital coverage.
```

Coverage signal:
- Strong (>40u serving):  #22c55e
- Moderate (20-40u):      #EF9F27
- Weak (<20u):            #ef4444 + warning

### J4 — Top Priority Actions (Class A only)
Pull all done: false actions from Class A assets.
Ranked by allocation descending.
Checking an action here updates the asset in real time.

---

## PART K — All Upgrades from Previous Session

Implement all 8 previously agreed upgrades:

1. Editable scores (+/− buttons, min 0 max 5, immediate Supabase save)
2. Editable mandate text (pencil toggle, textarea, save on blur)
3. Clickable status badge (cycles active→forming→monitor, Framer Motion crossfade)
4. Mark reviewed today (sets today's date, color by staleness, "✓ Marked" feedback)
5. Investment thesis section (pencil edit, collapsible, save on blur)
6. Add/delete action items (Enter to add, × to delete, Framer Motion list animation)
7. Enhanced rebalance view (covered in Part J above)
8. Next review countdown (oldest lastReviewed + 30 days, amber if overdue)

All saves: optimistic update first → Supabase persist → revert on error.

---

## PART L — Animations

Consistent across all new components:

**Floor bar signal change:**
```ts
// Dot pulse rate changes with signal
stable:    animation-duration: 2s
pressured: animation-duration: 1.2s
shaking:   animation-duration: 0.6s
```

**Vision cards entrance:**
```ts
initial={{ opacity: 0, y: 16 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.1 }}
```

**TensileMap line draw:**
```ts
// SVG strokeDashoffset from full length → 0
// Triggers on mount, staggered per line
// Duration: 1s, ease: easeOut
// Lines draw from floor node upward
```

**Portfolio lock overlay:**
```ts
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
transition={{ duration: 0.3 }}
```

**Vision card edit mode:**
```ts
// Same pattern as mandate/thesis edit
initial={{ opacity: 0, height: 0 }}
animate={{ opacity: 1, height: 'auto' }}
transition={{ duration: 0.2, ease: 'easeOut' }}
```

---

## Color Reference (full system)

```
#06060E   — deepest background
#080810   — panel background
#0D0D0D   — card / row background
#A3C4B4   — sage green — primary accent
#E8FF47   — neon yellow — Forge / interactive
#534AB7   — indigo — Vision 3 / Chronicle
#F5F5F0   — primary text
#888884   — secondary text
#444440   — muted text
#1A1A24   — border
#22c55e   — stable / success
#EF9F27   — pressured / forming / warning
#ef4444   — shaking / error
```

---

## Build Order

```
1.  Run Supabase migrations (C1, C2, C3, C4)
2.  Create lib/types/forge.ts
3.  Create lib/assets.ts (fetchAssets, updateAsset, seedIfEmpty)
4.  Create lib/visions.ts (fetchVisions, updateVision)
5.  Create lib/floor.ts (getFloorState, setFloorState — localStorage)
6.  Create FloorBar.tsx
7.  Create VisionLayer.tsx (cards only, no map yet)
8.  Create TensileMap.tsx (SVG diagram)
9.  Refactor Dashboard.tsx — extract AssetLedger, AssetDetail, RebalanceView
10. Update Dashboard.tsx — integrate FloorBar, VisionLayer, TensileMap
11. Update AssetLedger — add vision dots, exit indicator, floating section
12. Update AssetDetail — add exit condition, vision connections, floor trace
13. Implement RebalanceView (Part J)
14. Implement all 8 upgrades (Part K)
15. Wire all Framer Motion animations (Part L)
16. Seed assets table (migrate from localStorage seed data)
17. Full flow test: floor → vision → asset → rebalance → back
18. Verify all edits persist to Supabase across page refresh
```

---

## Do NOT

- Do not touch MercuryForgeScene.tsx (public layer — untouched)
- Do not touch PasswordGate.tsx
- Do not rebuild Dashboard.tsx from scratch — refactor and extend
- Do not use any charting library — all visuals are CSS + SVG
- Do not store floor state in Supabase — localStorage only (ephemeral by design)
- Do not store vision data in localStorage — Supabase only
- Do not make the TensileMap interactive beyond hover + click to select
- Do not add animations not specified in Part L
- Do not change any colors outside the reference in this prompt

---

## Acceptance Criteria

- [ ] Floor bar always visible, signals update via modal, portfolio locks on 'shaking'
- [ ] Three visions load from Supabase, sorted by game_weight descending
- [ ] TensileMap renders with correct connections, lines draw on mount
- [ ] Hovering asset/vision node in map highlights connections
- [ ] Vision cards show connected assets as pill tags
- [ ] Asset ledger rows show vision dots and exit condition indicator
- [ ] Floating assets section appears for assets with no vision connection
- [ ] Asset detail shows exit condition, vision connections, floor trace
- [ ] Floor trace auto-generates from vision → floor_link chain
- [ ] All 8 previous upgrades implemented and working
- [ ] All edits persist to Supabase, survive page refresh
- [ ] Floor state persists to localStorage, prompts refresh after 24h
- [ ] Vision weights warning shows if they don't sum to 100
- [ ] Vision coverage analysis flags The Living Room as needing more capital
- [ ] No TypeScript errors, no console errors
- [ ] Full flow works: open dashboard → update floor → view visions →
      select asset → edit fields → check rebalance → close → reopen →
      confirm all state persisted correctly

---

*The tensile structure is the philosophy made visible.*
*Every component exists because of the idea, not despite it.*
