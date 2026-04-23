# Tool Addendum — Applies to ALL Prompts
### Patch this section into every prompt before running with Claude CLI
### Tools added: UI/UX Pro Max · Framer Motion Pro · 21st.dev Magic

---

## New Tools Available — Usage Rules

### 21st.dev Magic
Use 21st.dev components for any UI primitive that isn't custom to this design system.

REACH FOR 21st.dev FOR:
- Filter tabs / pill toggles (Forge, Chronicle, Archive, Dream filters)
- Breadcrumb navigation component
- Scrollable side panels / drawers (realm panels)
- Progress bars and stat cards (asset manager)
- Modal / overlay shells (realm open state)
- Action checklists (asset manager next actions)
- Form inputs (hire page intake form, password field)
- Badge / pill components (status badges, class indicators)
- Toast / notification (form submission success state)

DO NOT USE 21st.dev FOR:
- The hero profile card — custom built, already specced
- The planet/moon orbit system — custom CSS animation
- The parallax layer system — custom scroll handler
- The Three.js sphere components — vanilla Three.js only
- The Lock artifact — custom 3-click interaction, no library
- The availability badge — custom built
- Any component where the exact visual is already defined in the prompt

WHEN USING 21st.dev COMPONENTS:
Always override with the project design tokens. Never use default colors.
Map their CSS variables to ours:
  their primary    → #E8FF47
  their background → #0A0A0A / #111111
  their surface    → #111111 / #1A1A1A
  their border     → #222220
  their text       → #F5F5F0 / #888884 / #444440
  their font       → var(--font-syne) / var(--font-dm) / var(--font-mono)

---

### Framer Motion — Upgraded Patterns

Replace CSS custom property scroll parallax with Framer Motion's
useScroll + useTransform. This is cleaner, more composable, and
handles mobile scroll events correctly.

PARALLAX IMPLEMENTATION (replaces raw scroll listener):
```ts
import { useScroll, useTransform, motion } from 'framer-motion'

export function ParallaxLayer({ speed, children }: { speed: number; children: React.ReactNode }) {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 1000], [0, -1000 * speed])
  return <motion.div style={{ y }}>{children}</motion.div>
}

// Usage — assign speed per layer:
// Stars (distant):  speed 0.1
// The Dream:        speed 0.45
// The Archive:      speed 0.55
// The Chronicle:    speed 0.65
// The Forge:        speed 0.8
// Moons:            speed 0.9
```

SHARED ELEMENT TRANSITIONS (moon → realm panel):
```ts
// Moon node
<motion.div layoutId={`moon-${node.id}`} onClick={() => setSelected(node)}>
  <MoonShape node={node} />
</motion.div>

// Realm panel (inside AnimatePresence)
<AnimatePresence>
  {selected && (
    <motion.div
      layoutId={`moon-${selected.id}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <RealmContent node={selected} />
    </motion.div>
  )}
</AnimatePresence>
```

COMET MOTION PATH:
```ts
// Use Framer Motion's SVG path animation
// Define a curved SVG path across the canvas
// offsetDistance animates from 0% to 100%
<motion.div
  style={{ offsetPath: "path('M -100 200 Q 400 50 900 600 T 1800 300')" }}
  animate={{ offsetDistance: ['0%', '100%'] }}
  transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
>
  <CometShape />
</motion.div>
```

STAGGER CHILDREN (node entrance from sun):
```ts
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 1.5 }
  }
}
const item = {
  hidden: { opacity: 0, scale: 0 },
  show: {
    opacity: 1, scale: 1,
    transition: { type: 'spring', stiffness: 60, damping: 15 }
  }
}
```

PAGE TRANSITIONS (all route changes):
```ts
// app/template.tsx — wraps every page
'use client'
import { motion } from 'framer-motion'

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
```

SCROLL-TRIGGERED REVEALS (all sections except My World):
```ts
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

function RevealBlock({ children, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  )
}
```

---

### UI/UX Pro Max — Design System Lock

UI/UX Pro Max provides 50+ style presets. DO NOT use any preset as-is.
The design system for this project is already defined and locked.
Use Pro Max only for inspiration on micro-details — spacing rhythms,
hover state ideas, border treatment ideas.

LOCKED DESIGN SYSTEM — never override:
```
Background:    #0A0A0A (canvas), #111111 (cards), #1A1A1A (elevated)
Accent:        #E8FF47 (primary), #B5C93A (dimmed)
Text:          #F5F5F0 (primary), #888884 (secondary), #444440 (muted)
Border:        #222220 (default), #333330 (hover)
Success:       #22c55e (available/active green)
Warning:       #EF9F27 (amber, Class B assets)
Danger:        #E24B4A (red, stalled assets)

Fonts:
  Display/headings: Syne (weights: 400 500 700 800)
  Body/UI:          DM Sans (weights: 300 400 500)
  Mono/code/data:   JetBrains Mono (weights: 400 500)

Border radius:
  Tight (tags, badges):   4px
  Default (inputs, btns): 8px
  Cards:                  12px
  Large cards:            16-20px
  Pills:                  99px

Motion:
  Default easing:   easeOut
  Spring elements:  stiffness 60, damping 15
  Hover lift:       y: -2px
  Active press:     scale: 0.97
  Duration short:   0.15s (hover states)
  Duration medium:  0.35s (page transitions)
  Duration long:    0.6s (scroll reveals)

Mode: dark only. No toggle. No light mode. Ever.
```

---

## Updated Build Order (all prompts)

With these tools, the recommended build order changes slightly:

```
1.  next/font setup + CSS variables (layout.tsx)
2.  app/template.tsx — page transitions (Framer Motion)
3.  Design token CSS file (globals.css) — all vars above
4.  Install: framer-motion, @supabase/supabase-js, next-mdx-remote
5.  Supabase client setup (lib/supabase.ts)
6.  HeroSection.tsx (custom — from hero_section_prompt.md)
7.  Nav + Footer (21st.dev base, override tokens)
8.  Services page (21st.dev cards, RevealBlock reveals)
9.  Work index + case study (21st.dev grid + panel, custom)
10. Hire page + form (21st.dev form components, Supabase POST)
11. My World — SpaceCanvas + planets (from my_world_prompt.md)
12. Asset Manager — Dashboard (from asset_manager_prompt.md)
13. About page (21st.dev timeline component, override)
14. MDX pipeline + metadata + sitemap
15. Performance audit + Lighthouse pass
```

---

## The One Rule That Governs Tool Usage

> "Use 21st.dev to build faster. Use Framer Motion to build better.
>  Use the design system to build consistently.
>  Never let a tool override a decision already made."

If a 21st.dev component looks slightly different from what's specced,
override it. If Framer Motion has a fancier animation than what's described,
use the described one. The prompts are the source of truth.
The tools are accelerators, not directors.

---

*Add this addendum to the top of every prompt file before running Claude CLI.*
*Run it first as a standalone: "Read ADDENDUM.md — these rules apply to everything."*
