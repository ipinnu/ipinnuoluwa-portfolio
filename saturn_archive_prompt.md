# Saturn / The Archive — Complete Build Prompt
### app/my-world/archive/ · SaturnArchiveScene.tsx · ArchiveStudio.tsx
### Planet: Saturn · Color: #1D9E75 (teal) · The thinking environment

---

## What This Is

A private writing and thinking environment accessed through Saturn in My World.
Not a note-taking app. A thinking environment — the raw material layer of the
entire system. Everything else (Chronicle articles, Forge projects, asset
theses) feeds from ideas that first lived here as loose, associative writing.

Access: Click Saturn planet → SaturnArchiveScene → InkArtifact on Saturn
surface → password gate (reuse NEXT_PUBLIC_CHRONICLE_KEY or new env var
NEXT_PUBLIC_ARCHIVE_KEY) → ArchiveStudio

Two modes toggled from header:
- WRITE — the writing surface
- BRAIN — the mesh graph

---

## The Glass System — Implementation Spec

### Philosophy
Writing surface = dark, clean, sacred. No glass on text.
Glass lives on everything surrounding the writing surface.

### SVG Filter (the core — define once, reuse everywhere)
```html
<!-- In a hidden <svg> at root of ArchiveStudio -->
<svg style="position:absolute;width:0;height:0">
  <defs>
    <filter id="liquid-glass" x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.015 0.015"
        numOctaves="2"
        seed="2"
        result="noise"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="noise"
        scale="6"
        xChannelSelector="R"
        yChannelSelector="G"
        result="displaced"
      />
      <feSpecularLighting
        in="noise"
        surfaceScale="3"
        specularConstant="0.8"
        specularExponent="120"
        result="specular"
      >
        <!-- Light source position updates via JS on mousemove -->
        <fePointLight id="glass-light" x="200" y="100" z="300" />
      </feSpecularLighting>
      <feBlend in="displaced" in2="specular" mode="screen" result="lit" />
      <feComposite in="lit" in2="SourceGraphic" operator="in" />
    </filter>

    <!-- Softer version for text-adjacent elements -->
    <filter id="liquid-glass-soft" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="1" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" result="displaced"/>
      <feComposite in="displaced" in2="SourceGraphic" operator="in"/>
    </filter>
  </defs>
</svg>
```

Update light source on mousemove:
```ts
document.addEventListener('mousemove', (e) => {
  const light = document.getElementById('glass-light')
  if (light) {
    light.setAttribute('x', String(e.clientX))
    light.setAttribute('y', String(e.clientY))
  }
})
```

### Glass CSS Mixin (per category color)
```css
.glass-panel {
  /* Category color supplied as CSS custom property --glass-color (RGB values) */
  background: rgba(var(--glass-color), 0.07);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(var(--glass-color), 0.2);
  box-shadow:
    inset 0 1px 0 rgba(var(--glass-color), 0.15),   /* top highlight */
    inset 0 -1px 0 rgba(var(--glass-color), 0.05),   /* bottom shadow */
    0 8px 32px rgba(var(--glass-color), 0.06),        /* outer glow */
    0 1px 0 rgba(255,255,255,0.04);                   /* surface sheen */
  filter: url(#liquid-glass-soft);
}

/* Hover state — shimmer intensifies */
.glass-panel:hover {
  background: rgba(var(--glass-color), 0.11);
  border-color: rgba(var(--glass-color), 0.32);
  box-shadow:
    inset 0 1px 0 rgba(var(--glass-color), 0.25),
    inset 0 -1px 0 rgba(var(--glass-color), 0.08),
    0 12px 40px rgba(var(--glass-color), 0.10),
    0 1px 0 rgba(255,255,255,0.07);
  filter: url(#liquid-glass);  /* full refraction on hover */
  transition: all 0.3s ease;
}
```

### Category Glass Colors (RGB values for CSS custom property)
```ts
export const CATEGORY_GLASS = {
  Philosophy:   { rgb: '127, 119, 221', hex: '#7F77DD' },
  Technology:   { rgb: '29, 158, 117',  hex: '#1D9E75' },
  Business:     { rgb: '239, 159, 39',  hex: '#EF9F27' },
  Finance:      { rgb: '212, 175, 55',  hex: '#D4AF37' },
  Politics:     { rgb: '74, 111, 165',  hex: '#4A6FA5' },
  Health:       { rgb: '163, 196, 180', hex: '#A3C4B4' },
  Culture:      { rgb: '216, 90, 48',   hex: '#D85A30' },
  Spirituality: { rgb: '83, 74, 183',   hex: '#534AB7' },
  'Lagos/Nigeria': { rgb: '232, 255, 71', hex: '#E8FF47' },
  Art:          { rgb: '196, 100, 122', hex: '#C4647A' },
}
```

### Where glass is used
- Category pills in note browser ✓
- Type pills ✓
- Topic pills ✓
- Note cards in browser list ✓
- Footnote rail panels ✓
- Quick capture floating input ✓
- Graph mode nodes ✓
- Settings modal ✓
- Modals and overlays ✓

### Where glass is NOT used
- The writing textarea — dark, clean, #06060E bg, no filter
- Body text in open notes — legibility is sacred
- The header bar — solid #080810

---

## Supabase Schema

```sql
-- Categories (static defaults + user-addable)
create table archive_categories (
  id          text primary key,       -- slug e.g. 'philosophy'
  name        text not null,
  color_hex   text not null,
  color_rgb   text not null,          -- 'R, G, B' for CSS
  is_default  boolean default false,
  display_order int default 0,
  created_at  timestamptz default now()
);

-- Types (under categories)
create table archive_types (
  id          text primary key,       -- slug e.g. 'web3'
  category_id text references archive_categories(id) on delete cascade,
  name        text not null,
  created_at  timestamptz default now()
);

-- Notes
create table archive_notes (
  id            uuid default gen_random_uuid() primary key,
  title         text not null default 'Untitled',
  content       text not null default '',
  category_id   text references archive_categories(id),
  type_id       text references archive_types(id),
  topic         text,                  -- free text, most specific
  tags          text[] default '{}',   -- auto-extracted keywords
  connections   text[] default '{}',   -- IDs of explicitly linked notes
  ai_cluster    text,                  -- AI-assigned theme cluster label
  ai_footnotes  jsonb default '[]',    -- [{noteId, statement, excerpt}]
  word_count    int default 0,
  status        text default 'active'
                check (status in ('active', 'archived')),
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Semantic connections (AI-detected)
create table archive_connections (
  id          uuid default gen_random_uuid() primary key,
  note_a      uuid references archive_notes(id) on delete cascade,
  note_b      uuid references archive_notes(id) on delete cascade,
  strength    float default 0.5,      -- 0-1, AI confidence
  type        text default 'semantic' -- 'explicit' | 'keyword' | 'semantic'
  confirmed   boolean default false,  -- user confirmed this connection
  created_at  timestamptz default now(),
  unique(note_a, note_b)
);

-- Settings
create table archive_settings (
  key   text primary key,
  value text not null
);

-- RLS
alter table archive_categories enable row level security;
alter table archive_types enable row level security;
alter table archive_notes enable row level security;
alter table archive_connections enable row level security;

create policy "Public read" on archive_categories for select using (true);
create policy "Public read" on archive_types for select using (true);
create policy "Public read" on archive_notes for select using (true);
create policy "Public read" on archive_connections for select using (true);
create policy "Service write" on archive_notes for all
  using (auth.role() = 'service_role');
create policy "Service write cats" on archive_categories for all
  using (auth.role() = 'service_role');
```

### Seed categories
```sql
insert into archive_categories (id, name, color_hex, color_rgb, is_default, display_order)
values
  ('philosophy',    'Philosophy',    '#7F77DD', '127, 119, 221', true, 1),
  ('technology',    'Technology',    '#1D9E75', '29, 158, 117',  true, 2),
  ('business',      'Business',      '#EF9F27', '239, 159, 39',  true, 3),
  ('finance',       'Finance',       '#D4AF37', '212, 175, 55',  true, 4),
  ('politics',      'Politics',      '#4A6FA5', '74, 111, 165',  true, 5),
  ('health',        'Health',        '#A3C4B4', '163, 196, 180', true, 6),
  ('culture',       'Culture',       '#D85A30', '216, 90, 48',   true, 7),
  ('spirituality',  'Spirituality',  '#534AB7', '83, 74, 183',   true, 8),
  ('lagos-nigeria', 'Lagos/Nigeria', '#E8FF47', '232, 255, 71',  true, 9),
  ('art',           'Art',           '#C4647A', '196, 100, 122', true, 10);
```

---

## TypeScript Types

```typescript
// lib/types/archive.ts

export interface ArchiveCategory {
  id: string
  name: string
  colorHex: string
  colorRgb: string           // 'R, G, B' for CSS var
  isDefault: boolean
  displayOrder: number
}

export interface ArchiveType {
  id: string
  categoryId: string
  name: string
}

export interface ArchiveNote {
  id: string
  title: string
  content: string
  categoryId: string | null
  typeId: string | null
  topic: string | null
  tags: string[]
  connections: string[]      // explicit links to other note IDs
  aiCluster: string | null
  aiFootnotes: Footnote[]
  wordCount: number
  status: 'active' | 'archived'
  createdAt: string
  updatedAt: string
}

export interface Footnote {
  noteId: string             // the note being referenced
  statement: string          // the exact statement in current note
  excerpt: string            // relevant excerpt from referenced note
  superscript: number        // display number ¹ ²  ³
}

export interface ArchiveConnection {
  id: string
  noteA: string
  noteB: string
  strength: number
  type: 'explicit' | 'keyword' | 'semantic'
  confirmed: boolean
}

export interface GraphNode {
  id: string
  title: string
  categoryId: string | null
  aiCluster: string | null
  connectionCount: number
  x: number                  // computed position
  y: number
}
```

---

## File Structure

```
components/my-world/archive/
  ArchiveStudio.tsx          ← main orchestrator (Write/Brain toggle)
  GlassFilter.tsx            ← hidden SVG filter defs + mousemove handler
  GlassPanel.tsx             ← reusable glass wrapper component

  write/
    NoteBrowser.tsx           ← left sidebar: category tree + note list
    WritingSurface.tsx        ← center: textarea + toolbar
    FootnoteRail.tsx          ← right: AI footnotes panel
    NoteToolbar.tsx           ← formatting + category/type/topic pickers
    QuickCapture.tsx          ← global floating input (⌘K or custom shortcut)

  brain/
    BrainGraph.tsx            ← full canvas graph (D3 force or custom)
    GraphNode.tsx             ← individual node with glass treatment
    ClusterLabel.tsx          ← AI cluster name floating above group
    ConnectionLine.tsx        ← edge between nodes (3 weights by type)

  settings/
    ArchiveSettings.tsx       ← manage categories + types + colors
    CategoryEditor.tsx        ← add/edit/delete category + set color
    TypeEditor.tsx            ← add/edit types under a category

lib/
  archive.ts                  ← Supabase CRUD
  archive-ai.ts               ← Claude API calls for footnotes + clustering
  types/archive.ts            ← types above
```

---

## WRITE MODE

### Layout (3 columns)

```
┌───────────────┬──────────────────────────────┬──────────────┐
│  NOTE BROWSER │  WRITING SURFACE             │ FOOTNOTE RAIL│
│  240px        │  flex-1                      │  280px       │
│               │                              │              │
│  [+ New note] │  [Title input]               │  ¹ Note ref  │
│               │  ─────────────               │  ────────    │
│  ▾ Philosophy │  Content textarea            │  Excerpt...  │
│    Note 1     │                              │  → Open      │
│    Note 2     │                              │              │
│  ▾ Technology │                              │  ² Note ref  │
│    Note 3     │                              │  ────────    │
│               │                              │  Excerpt...  │
└───────────────┴──────────────────────────────┴──────────────┘
```

Mobile: NoteBrowser collapses (same absolute overlay pattern as Chronicle).
FootnoteRail: slides up from bottom as a drawer on mobile.

### NoteBrowser

**Top section:**
```
[ARCHIVE]                    [⚙] [+ New]
─────────────────────────────────────────
[Search notes...]
```

**Category tree:**
Each category: glass pill with category color, collapsible.
```
▾ [Philosophy glass pill]        (4 notes)
    Note title 1
    Note title 2
  ▾ [Web3] type pill             (2 notes)
      Note title 3
      Note title 4
─────────────────────────────────
▾ [Technology glass pill]        (7 notes)
```

Clicking a note → loads in WritingSurface.
Active note: left border 2px category color.

**Uncategorized section** at bottom:
```
─── UNCATEGORIZED ──────────
  Raw capture 1
  Raw capture 2
```

### WritingSurface

**Header row (above textarea):**
```
[Category ▼]  [Type ▼]  [Topic input]  ·  [word count]  [⋯]
```

Category dropdown: glass panels per category, refraction shimmer on hover.
Type dropdown: appears after category selected, filtered to that category's types.
Topic: free text input, autocompletes from existing topics.

**Title input:**
```
font: Syne 28px weight 700
color: #F5F5F0
background: transparent
border: none
border-bottom: 1px solid #1A1A24 (only on focus)
placeholder: "Untitled thought..."
width: 100%
```

**Content textarea:**
```
font: DM Sans 16px weight 300
color: #F5F5F0
line-height: 1.85
background: transparent
border: none
resize: none
min-height: calc(100vh - 200px)
caret-color: #1D9E75  (teal — Saturn's color)
```

NO glass on textarea. Dark, clean, legible. Sacred.

**Keyboard shortcuts:**
```
⌘S          → save (auto-save already runs at 1s debounce)
⌘[           → toggle note browser
⌘]           → toggle footnote rail
⌘K           → open quick capture
[[           → trigger explicit note link (type to search, Enter to insert)
#tag         → auto-tag on space after #word
```

**[[Note linking]]:**
Typing `[[` opens an inline search dropdown (glass panel):
```
┌─────────────────────────┐
│  🔍 Search notes...     │
│  ─────────────────────  │
│  Sovereign Ground note  │
│  The Floor concept      │
│  AutoDrive thesis       │
└─────────────────────────┘
```
Selecting inserts: `[[Note Title]]` in content.
On render: highlighted as a teal underline link that opens that note.

**Auto-save:** 1s debounce. Saves to Supabase. Updates `updated_at`.
Updates word count. Triggers AI footnote scan (see AI section).

### FootnoteRail

Right panel. 280px. Glass background (#1D9E75 at 4% opacity — Saturn teal).

**Header:**
```
CONNECTIONS  ·  [3]
```

**Footnote cards:**
Each card = one AI-detected connection between something in the current note
and another note in the archive.

```
┌────────────────────────────────────────┐
│  ¹  PHILOSOPHY · Sovereign Ground      │  ← superscript + category + note title
│  glass panel, category color           │
│  "...the floor is not about what       │  ← relevant excerpt from linked note
│  happens to you but how you respond..."│
│                                        │
│  [→ Open note]  [× Dismiss]           │
└────────────────────────────────────────┘
```

The superscript `¹` appears inline in the WritingSurface content at the
relevant statement. Clicking it scrolls the rail to that footnote card.
Clicking the card scrolls the writing surface to the relevant statement.

**Bible-style cross-reference:** Bidirectional. The linked note also gets
a footnote back to this one when the AI processes it.

**Empty state:**
```
Write a few paragraphs and connections will
appear here automatically.
(italic, #444440, centered)
```

---

## BRAIN MODE (graph)

Full canvas. Same dark background + Saturn glow.
Toggle from header. Framer Motion: cross-fade between Write and Brain.

### Graph rendering

Use D3 force simulation for node positioning:
```ts
d3.forceSimulation(nodes)
  .force('link', d3.forceLink(links).distance(d => 80 + (1 - d.strength) * 80))
  .force('charge', d3.forceManyBody().strength(-300))
  .force('center', d3.forceCenter(width/2, height/2))
  .force('cluster', clusterForce)  // custom: nodes same cluster attract
```

### Node rendering (glass spheres)

Each node is a `<div>` with glass treatment, positioned absolutely:

```tsx
<div
  className="graph-node"
  style={{
    '--glass-color': category.colorRgb,
    width: baseSize + connectionCount * 3,   // larger = more connections
    height: baseSize + connectionCount * 3,
    borderRadius: '50%',
    filter: 'url(#liquid-glass)',
    // glass CSS from mixin above
  }}
>
  <span className="node-label">{truncate(title, 20)}</span>
</div>
```

Node sizes:
- Base: 40px
- +3px per connection (capped at 80px)

### Connection lines (3 weights)

SVG `<line>` elements behind the nodes:
```
explicit:  stroke: category color, opacity 0.6, strokeWidth 1.5
keyword:   stroke: category color, opacity 0.35, strokeWidth 1, strokeDasharray: none
semantic:  stroke: #444440, opacity 0.2, strokeWidth 0.5, strokeDasharray: 4 2
```

Unconfirmed semantic connections: strokeDasharray: 4 2 (dotted).
After user confirms: becomes keyword style.

### Cluster labels

Floating text above each AI-detected cluster:
```
font: JetBrains Mono 11px
color: cluster's dominant category color at 60% opacity
letter-spacing: 0.15em
text-transform: uppercase
pointer-events: none
```

### Interactions

Hover node → highlight all its connections, dim others (opacity 0.1)
Click node → open that note in Write mode (cross-fade back to Write)
Drag canvas → pan (pointer events)
Scroll → zoom (transform scale)
Double-click empty space → reset view

### Isolated notes

Nodes with zero connections float at the edges, dimmer (opacity 0.5).
A small callout: "3 notes have no connections yet"

---

## AI System (Claude API)

### A1 — Footnote Scanner

Runs 3 seconds after each save (debounced — not on every keystroke).

```ts
// lib/archive-ai.ts
export async function scanFootnotes(
  currentNote: ArchiveNote,
  allNotes: ArchiveNote[]
): Promise<Footnote[]>
```

API call to `/api/archive/footnotes`:
```ts
// System prompt:
`You are a connection finder for a personal thinking archive.
Given a note being written and a library of existing notes,
identify statements in the current note that connect to deeper
treatment in other notes. Be selective — only surface strong,
meaningful connections, not superficial keyword matches.
Return JSON only.`

// User message:
`Current note: [title + content]
Note library: [array of {id, title, summary of content}]
Find up to 4 connections. Return:
[{
  noteId: string,
  statement: string,  // exact phrase from current note (max 10 words)
  excerpt: string,    // relevant excerpt from the referenced note (max 30 words)
  superscript: number
}]`
```

On response: update `archive_notes.ai_footnotes` for the current note.
FootnoteRail re-renders with new connections.

### A2 — Cluster Analyzer

Runs once when Archive opens + after every 5 new notes saved.

```ts
// lib/archive-ai.ts
export async function analyzeClusters(
  notes: ArchiveNote[]
): Promise<Record<string, string>>  // noteId → clusterLabel
```

API call to `/api/archive/clusters`:
```ts
// Takes all note titles + first 100 chars of each
// Returns: [{ noteIds: string[], label: string }]
// Updates ai_cluster field on each note in Supabase
```

Cluster labels should be 2-4 words. Examples:
"Sovereignty & Identity", "Financial Architecture", "Lagos & Belonging"

Cluster analysis is background — never blocks the UI.
Show subtle indicator in Brain mode: "Analyzing connections..." (JetBrains Mono, 11px, muted)

### A3 — Semantic Connections

Also runs during cluster analysis.
Compares all pairs of notes for semantic similarity.
Inserts rows into `archive_connections` with type: 'semantic', confirmed: false.
These appear as dotted lines in Brain mode.

User confirms by clicking "Connect" on the connection in Brain mode.
Confirmed → `confirmed: true`, line style changes.

---

## Quick Capture

Global floating input. Available anywhere in My World via keyboard shortcut.

**Shortcut:** ⌘⇧A (or configurable in settings)

**Appearance:**
```
┌──────────────────────────────────────────────┐
│  glass panel, #1D9E75 tint, liquid-glass SVG │
│  backdrop-filter: blur(24px)                 │
│                                              │
│  ✦ Capture a thought...                      │
│  ──────────────────────────────────────────  │
│  [Category ▼]  [Type ▼]                     │
│                              [Save]  [×]     │
└──────────────────────────────────────────────┘
```

Position: centered, 50% from top, z-index: 100.
Framer Motion: scale 0.9 → 1.0, opacity 0 → 1, blur 8px → 0 (0.2s).

On save:
- Creates new note with provided content
- Category/type if selected, uncategorized if not
- AI cluster assignment happens in background
- Quick capture closes
- Subtle toast: "Thought captured" (1.5s, bottom-right)

---

## Settings (⚙ icon in NoteBrowser header)

Glass modal. Full settings for the Archive.

### Categories tab
```
CATEGORIES                              [+ Add category]
────────────────────────────────────────────────────────
[Philosophy glass pill]  #7F77DD  [●]  [Edit]  [×]
[Technology glass pill]  #1D9E75  [●]  [Edit]  [×]
...
```

[+ Add category] → inline form:
```
Name: [input]
Color: [color picker — 24 preset swatches in glass pills + custom hex input]
[Save]
```

Color picker swatches: all shown as glass pills with that color's glass treatment.
Pristine grid of 24 options. Custom hex shows live preview.

Default categories: [Edit] available but [×] disabled (cannot delete defaults).
User-added categories: both [Edit] and [×] available.

### Types tab
```
TYPE MANAGER
────────────────────────────────────────────────────────
[Category ▼]  → select a category to manage its types

Types under Philosophy:
  Metaphysics  [×]
  Ethics       [×]
  Epistemology [×]
  [+ Add type]
```

[+ Add type]: inline input → saves to `archive_types`.

---

## Saturn Scene Integration

In `SaturnArchiveScene.tsx`:
- Saturn sphere renders (existing)
- An InkArtifact appears on Saturn's surface (similar to Chronicle's InkArtifact)
- Hover: tooltip "The Archive" in teal
- Click: PasswordGate → ArchiveStudio opens as full-screen overlay

PasswordGate: reuse existing component. Password: `NEXT_PUBLIC_ARCHIVE_KEY`.

---

## Glass Refraction Shimmer — The Signature Animation

The refraction shimmer (light moving across glass surface) is achieved by:
1. The `feSpecularLighting` in the SVG filter reacts to the `fePointLight` position
2. The `fePointLight` x/y updates on mousemove (see GlassFilter.tsx)
3. As your cursor moves, light shifts across every glass element simultaneously
4. This is one global light source — every glass element on screen responds

This creates the pristine Apple effect: glass surfaces feel like they're in
the same physical space, lit by the same light source. Move your cursor
slowly across the Archive and watch everything shimmer together.

Performance: SVG filters run on GPU via CSS `filter`. Single mousemove
listener updates one SVG attribute. Zero React re-renders.

---

## Connections to the Rest of the System

**From The Forge:**
- When writing an asset thesis in the Asset Manager, a [+ Archive link] button
  lets you reference an Archive note as the source of that thesis.
- The note appears as a footnote in the asset detail.

**From The Chronicle:**
- When writing an article in Chronicle Studio, [Insert from Archive] button
  searches Archive notes and inserts a reference or quote.
- Articles that originated from Archive notes show a "Raw source: [Archive note]" tag.

**Cross-linking in notes:**
- `[[note title]]` syntax works across Archive
- Future: `[[chronicle:slug]]` to link to a Chronicle article
- Future: `[[forge:asset-id]]` to link to an asset

---

## Build Order

```
1.  Run Supabase migrations (categories, types, notes, connections)
2.  Seed 10 default categories + types
3.  Create lib/types/archive.ts
4.  Create lib/archive.ts (CRUD functions)
5.  Create GlassFilter.tsx (SVG defs + mousemove handler)
6.  Create GlassPanel.tsx (reusable wrapper)
7.  Create NoteBrowser.tsx (category tree, note list)
8.  Create WritingSurface.tsx (textarea, title, toolbar, [[linking]])
9.  Create FootnoteRail.tsx (footnote cards, superscripts)
10. Create NoteToolbar.tsx (category/type/topic pickers)
11. Wire Write mode in ArchiveStudio.tsx
12. Create BrainGraph.tsx (D3 force simulation + canvas)
13. Create GraphNode.tsx (glass nodes)
14. Create ConnectionLine.tsx (3 line weights)
15. Create ClusterLabel.tsx
16. Wire Brain mode in ArchiveStudio.tsx
17. Create QuickCapture.tsx (global shortcut + floating input)
18. Create ArchiveSettings.tsx + CategoryEditor + TypeEditor
19. Create lib/archive-ai.ts + API routes for footnotes + clusters
20. Wire AI footnote scanner (3s debounce after save)
21. Wire AI cluster analyzer (on open + every 5 saves)
22. Update SaturnArchiveScene.tsx (InkArtifact + PasswordGate + overlay)
23. Connect to Forge (archive link in asset detail)
24. Connect to Chronicle (insert from archive button)
25. Full flow test: capture → write → footnotes appear → Brain mode →
    connections visible → settings → add category → note appears in new category
```

---

## Do NOT

- Do not put glass filter on the writing textarea — legibility is sacred
- Do not use any D3 version other than what's already in the project
- Do not add audio
- Do not make cluster analysis block the UI — always background
- Do not auto-delete unconfirmed semantic connections — user decides
- Do not use emoji in the UI — icons only (inline SVG)
- Do not add markdown preview mode (this is raw writing, not publishing)
- Do not replicate Chronicle Studio — this is different, raw, looser
- Do not add export features in this build

---

## Acceptance Criteria

- [ ] Glass SVG filter renders on all glass elements, shimmer follows cursor
- [ ] 10 default categories render with correct glass colors
- [ ] Note browser shows category tree, types nested under categories
- [ ] Writing surface is clean dark — no glass, no filter
- [ ] [[ linking triggers search dropdown, inserts link on select
- [ ] Auto-save works at 1s debounce
- [ ] Footnote rail shows AI connections 3s after save
- [ ] Superscripts appear inline in content at relevant statements
- [ ] Brain mode renders D3 graph with glass nodes
- [ ] Three connection line weights visible (explicit/keyword/semantic)
- [ ] Cluster labels float above node groups
- [ ] Quick capture opens on shortcut, saves uncategorized note
- [ ] Settings: add/edit/delete categories and types
- [ ] Color picker shows 24 glass swatches + custom hex
- [ ] SaturnArchiveScene has InkArtifact → password → ArchiveStudio
- [ ] No TypeScript errors, no console errors
- [ ] Lighthouse performance ≥ 78 (D3 + SVG filters accepted cost)

---

*The Archive is where the thinking happens before it becomes anything else.*
*It should feel like a place worth spending time in.*
*Pristine. Alive. Yours.*
