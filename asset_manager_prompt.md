# Asset Manager Dashboard — Build Prompt
### components/my-world/asset-manager/Dashboard.tsx
### Accessed via: 3-click Lock artifact inside The Forge + password

---

## What This Is

A private, interactive asset management dashboard. Only accessible to
Ipinnuoluwa via the hidden Lock artifact inside The Forge. Feels like
a personal command center — not a spreadsheet, not a Notion doc.
Think: mission control meets investor war room.

This is FUN. It has personality. Numbers have life. Assets have status.
Everything is clickable and expandable.

---

## Entry Experience

After correct password entry:
- Password modal fades out
- Black screen for 300ms
- Dashboard fades in with a subtle scan-line effect (CSS)
- Header text types itself out: "Welcome back, Ipinnu." (typewriter, 40ms/char)
- Then: "You have [N] active assets." fades in below

---

## Layout

Full-screen overlay on top of the My World canvas.
Background: rgba(10,10,10,0.97) — almost opaque, star field faintly visible behind.
Font stack: JetBrains Mono for numbers/labels, Syne for headings, DM Sans for body.

Two-column layout on desktop:
- Left (40%): Asset Ledger — scrollable list of all assets
- Right (60%): Detail Panel — expands when asset is selected

Single column on mobile — ledger first, detail panel slides up from bottom.

Close button: top-right corner, "× exit" in JetBrains Mono, returns to My World.

---

## Left Panel — Asset Ledger

### Header row
```
[ASSET LEDGER]          [Q2 2025]
CIO: Ipinnuoluwa        [REBALANCE ↻]
```

### Class filter tabs
[ALL]  [CLASS A]  [CLASS B]  [CLASS C]
Active tab: #E8FF47 bg, dark text
Inactive: #222220 border, #444440 text

### Asset rows (one per project)

Each row:
```
┌─────────────────────────────────────────┐
│ [●] NYSC SAED                    [A] 35u │
│     Revenue · Impact · Brand            │
│     ████████████████░░░░  Mandate: 80%  │
└─────────────────────────────────────────┘
```

Fields per row:
- Status dot: green (active), amber (at risk), red (stalled), gray (pipeline)
- Asset name: Syne, 14px, weight 700
- Class badge: [A], [B], [C] — colored pill
- Allocation: Xu (units) — JetBrains Mono
- Return types: small colored pills (Revenue, Impact, Brand, Strategic)
- Mandate progress bar: visual fill showing % completion this quarter
- Selected state: row highlights with left border #E8FF47, bg #111111

### All assets in ledger:

```
Class A (Deployed):
  NYSC SAED          35u  Revenue·Impact·Brand    Mandate: 80%  ● active
  AutoDrive          30u  Revenue·Strategic       Mandate: 65%  ● active
  Freelance/BrainBox 20u  Revenue·Brand           Mandate: 70%  ● active

Class B (Development):
  Diaspora App        8u  Strategic·Impact        Mandate: 20%  ◐ forming
  Security Company    7u  Strategic               Mandate: 10%  ◐ forming

Class C (Pipeline — 0 allocation):
  Proden              0u  Strategic               Thesis only   ○ monitor
  NCC App             0u  Revenue                 Thesis only   ○ monitor
  Real Estate AR      0u  Revenue                 Thesis only   ○ monitor
  Sacred Place        0u  Strategic               Thesis only   ○ monitor
```

---

## Right Panel — Asset Detail (on row click)

### Detail panel sections (vertical scroll within panel):

**1. Asset header**
```
[PLANET ICON]  NYSC SAED                    [● ACTIVE]
               Class A Asset · The Forge
               Last reviewed: April 2025
```

**2. Score card — 4 metrics, 2×2 grid**
Each metric card:
- Label (JetBrains Mono, 11px, muted)
- Score display: animated number fill (0 → score on open)
- Visual bar fill in metric color

```
┌──────────────┬──────────────┐
│ Revenue      │ Social Impact│
│ ████░  4/5   │ █████  5/5   │
├──────────────┼──────────────┤
│ Strategic    │ Momentum     │
│ ████░  4/5   │ █████  5/5   │
└──────────────┴──────────────┘
TOTAL: 18/20
```

Total score: large Syne number, colored by class:
- 16-20: #E8FF47 (strong)
- 11-15: #EF9F27 (moderate)
- 0-10:  #E24B4A (weak)

**3. Allocation gauge**
Circular/arc progress showing weekly unit allocation vs total (100u).
```
    ╭──────╮
   /  35u   \
  │  ██████  │   35 / 100 units
   \  35%   /
    ╰──────╯
```
CSS conic-gradient arc, animated on open.

**4. Mandate**
```
[MANDATE]
"Complete current training cohort.
Document outcomes. Explore state expansion."

Progress this quarter: ████████░░  80%
[Mark complete] [Update mandate]
```
Mandate progress: editable slider (saves to localStorage)
[Mark complete] button turns the bar full green
[Update mandate] opens an inline textarea to rewrite it

**5. Return types**
Visual breakdown — horizontal bar showing proportion of each return type:
```
Revenue    ██████░░░░░░  40%
Impact     ████████░░░░  50%
Brand      ██░░░░░░░░░░  10%
Strategic  ░░░░░░░░░░░░   0%
```
Click any return type to toggle it on/off for this asset.

**6. Next actions**
Checklist — editable, saves to localStorage:
```
☑ Deliver current training cohort
☐ Document outcomes with data
☐ Pitch state expansion to 1 partner
☐ Write case study for portfolio
[+ Add action]
```
Checked items: line-through, muted. Unchecked: bright white.

**7. Opportunity cost warning** (only shows if asset score drops or mandate stalls)
```
⚠ This asset's mandate is 30+ days overdue.
  Consider: rebalance allocation or downgrade to Class B.
```
Amber background, JetBrains Mono, 12px.

**8. Quick links**
For Class A assets with live products:
```
[↗ Play Store]  [↗ GitHub]  [↗ Case Study]
```

---

## The Rebalance View

Clicking [REBALANCE ↻] in the header opens a full-panel view:

Visual allocation wheel:
- Conic gradient circle divided by asset allocation percentages
- Each segment colored by return type
- Hover a segment: shows asset name + allocation

Below the wheel:
```
Total allocated: 100u / 100u  ✓ Fully deployed
Class A: 85u   Class B: 15u   Class C: 0u
```

Rebalance rules reminder (collapsible):
```
▸ Opportunity Cost Rule
▸ Mandate Rule
▸ Compounding Rule
```

---

## Portfolio Summary Bar (always visible, top of left panel)

```
┌─────────────────────────────────────────────────┐
│  PORTFOLIO HEALTH                                │
│  ██████████████████░░  Assets on track: 3/5     │
│  Net allocation: 100u  |  Q2 mandates: 2/5 ✓    │
└─────────────────────────────────────────────────┘
```

Health score calculated from:
- % of Class A mandates hitting progress threshold
- % of Class B assets with any activity this week
Updates in real-time as mandate progress is edited.

---

## Data — localStorage (no Supabase for this)

The asset manager is PRIVATE — data never touches Supabase.
Everything saves to localStorage under key `ip_asset_ledger`.

```ts
interface AssetLedgerData {
  assets: {
    [id: string]: {
      mandateProgress: number      // 0-100
      mandateText: string
      actions: { text: string; done: boolean }[]
      scores: { revenue: number; impact: number; strategic: number; momentum: number }
      allocation: number
      assetClass: 'A' | 'B' | 'C'
      returnTypes: ('revenue' | 'impact' | 'brand' | 'strategic')[]
      lastReviewed: string         // ISO date
    }
  }
  lastRebalance: string            // ISO date
  quarterLabel: string             // e.g. "Q2 2025"
}
```

Default state = the full ledger from asset_management_framework.md.
On first load, populate localStorage with the seeded data if empty.

---

## Animations & Interactions

- Score bars: animate width 0 → value on panel open (CSS transition 0.6s ease-out)
- Number counters: count up from 0 → value (same requestAnimationFrame pattern as hero)
- Allocation gauge: CSS conic-gradient animates from 0 → value (0.8s ease-out)
- Row selection: instant highlight, detail panel content cross-fades
- Mandate slider: real-time bar update as slider moves
- Action check: strikethrough animation on check (CSS text-decoration transition)
- Health bar: recalculates and animates whenever any value changes
- Typewriter entry: 40ms per character, cursor blinks 3x then fades

---

## Visual Personality Rules

This is NOT a generic dashboard. It has attitude.

- Numbers are large and proud — not hidden in small text
- Status dots pulse gently (same CSS as the Available badge on hero)
- Class A assets have a faint #E8FF47 left border glow
- Class C assets are visibly de-emphasized — gray, smaller, no bar
- "Not yet. But soon." appears as a watermark behind Dream-class assets
- The word "DEPLOYED" appears in huge ghost text behind Class A assets
- Exit button: on hover shows "return to the universe" instead of just "×"

---

## Security Note

Password check is client-side only — this is a personal tool, not a bank.
Password stored as env var: NEXT_PUBLIC_ASSET_MANAGER_KEY (hashed with btoa)
If someone finds the artifact and guesses the password, that's impressive enough.

---

## Do NOT

- Do not store any data in Supabase — localStorage only
- Do not make this page publicly routable (/asset-manager is not a real route)
- Do not add export/share features — this is private
- Do not use a charting library — all visuals are CSS (conic-gradient, width bars)
- Do not add authentication middleware — the 3-click + password IS the auth
- Do not make the UI look corporate — it should feel like a personal war room
- Do not add tooltips explaining what Class A/B/C means — owner already knows

---

## Acceptance Criteria

- [ ] Dashboard opens only after correct password entry
- [ ] All 9 assets appear in the ledger with correct class and allocation
- [ ] Clicking any asset opens its full detail panel
- [ ] Score card animates in on panel open
- [ ] Mandate progress slider saves to localStorage
- [ ] Actions checklist works and persists on refresh
- [ ] Rebalance view shows allocation wheel
- [ ] Portfolio health bar recalculates on any edit
- [ ] [REBALANCE ↻] button opens rebalance view
- [ ] Dashboard closes cleanly back to My World
- [ ] All data persists across browser sessions via localStorage

---

*This is your command center. Make it feel like one.*
