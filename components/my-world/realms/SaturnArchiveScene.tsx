'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { CelestialNode } from '@/lib/types/celestial'
import { useIsMobile } from '@/hooks/useIsMobile'

const MOBILE_SCALE = 0.55

const SATURN_MOONS_BASE = [
  {
    name: 'Titan',
    size: 22,
    radius: 220,
    duration: 48,
    startAngle: 60,
    gradient: 'radial-gradient(circle at 35% 30%, #E8B84B 0%, #C88020 40%, #8B5010 75%, #3A200A 100%)',
    shadow: 'inset -4px -4px 8px rgba(0,0,0,0.7)',
    description: "Thick nitrogen atmosphere, hydrocarbon lakes",
    haze: true,
  },
  {
    name: 'Enceladus',
    size: 12,
    radius: 170,
    duration: 25,
    startAngle: 200,
    gradient: 'radial-gradient(circle at 38% 32%, #FFFFFF 0%, #F0F4FF 35%, #C8D8F0 70%, #8090C0 100%)',
    shadow: 'inset -2px -2px 5px rgba(0,0,0,0.35)',
    description: "Geysers of water ice at south pole",
    haze: false,
  },
  {
    name: 'Mimas',
    size: 10,
    radius: 145,
    duration: 18,
    startAngle: 315,
    gradient: 'radial-gradient(circle at 35% 30%, #C0B8B0 0%, #907870 35%, #605058 70%, #302028 100%)',
    shadow: 'inset -2px -2px 5px rgba(0,0,0,0.6)',
    description: "Herschel crater — the Death Star moon",
    haze: false,
  },
]

const RING_BANDS = [
  { id: 'D', inner: 1.11, outer: 1.24, opacity: 0.08, color: '#C8B070' },
  { id: 'C', inner: 1.25, outer: 1.52, opacity: 0.18, color: '#B89858' },
  { id: 'Cassini', inner: 1.525, outer: 1.56, opacity: 0, color: 'transparent' },
  { id: 'B', inner: 1.56, outer: 1.94, opacity: 0.55, color: '#D4B878' },
  { id: 'A_inner', inner: 1.95, outer: 2.12, opacity: 0.38, color: '#C0A060' },
  { id: 'Encke', inner: 2.12, outer: 2.14, opacity: 0, color: 'transparent' },
  { id: 'A_outer', inner: 2.14, outer: 2.26, opacity: 0.32, color: '#B89858' },
  { id: 'F', inner: 2.33, outer: 2.37, opacity: 0.12, color: '#C8B070' },
]

// ─── Saturn sphere ────────────────────────────────────────────────────────────
function SaturnSphere({ size = 300 }: { size?: number }) {
  const s = size

  return (
    <div style={{ position: 'relative', width: s * 2.5, height: s, flexShrink: 0 }}>

      {/* Rings BEHIND */}
      {RING_BANDS.map(ring => {
        if (ring.opacity === 0) return null
        const innerPx = (ring.inner * s) / 2
        const outerPx = (ring.outer * s) / 2
        return (
          <div
            key={`back-${ring.id}`}
            style={{
              position: 'absolute',
              top: '50%', left: '50%',
              width: outerPx * 2, height: outerPx * 0.28,
              marginLeft: -outerPx, marginTop: -(outerPx * 0.28) / 2,
              borderRadius: '50%',
              clipPath: 'inset(50% 0 0 0)',
              background: `radial-gradient(ellipse,
                transparent ${(innerPx / outerPx) * 100}%,
                ${ring.color} ${(innerPx / outerPx) * 100}%,
                ${ring.color} 100%
              )`,
              opacity: ring.opacity * 0.75,
              pointerEvents: 'none',
              zIndex: 4,
            }}
          />
        )
      })}

      {/* Planet body */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        width: s, height: s,
        marginLeft: -s / 2, marginTop: -s / 2,
        borderRadius: '50%',
        overflow: 'hidden',
        zIndex: 10,
        boxShadow: `
          inset -${s*0.13}px -${s*0.13}px ${s*0.28}px rgba(0,0,0,0.82),
          inset ${s*0.03}px ${s*0.03}px ${s*0.08}px rgba(255,230,150,0.1),
          0 0 ${s*0.35}px rgba(200,170,80,0.12)
        `,
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            linear-gradient(to bottom,
              #3A2C1A 0%, #3A2C1A 6%,
              #7A6038 6%, #7A6038 10%,
              #C8B060 10%, #C8B060 16%,
              #8B6A3A 16%, #8B6A3A 21%,
              #D4BC78 21%, #D4BC78 27%,
              #B89040 27%, #B89040 34%,
              #E8D898 34%, #E8D898 46%,
              #C8A048 46%, #C8A048 54%,
              #D8C070 54%, #D8C070 60%,
              #9A7840 60%, #9A7840 66%,
              #C0A058 66%, #C0A058 72%,
              #7A5830 72%, #7A5830 78%,
              #503820 78%, #503820 100%
            )
          `,
        }} />

        <svg viewBox="0 0 300 300" width={s} height={s} style={{ position: 'absolute', inset: 0, opacity: 0.2 }} aria-hidden>
          <path d="M0,102 Q25,98 50,102 Q75,106 100,101 Q125,97 150,102 Q175,107 200,101 Q225,97 250,102 Q275,106 300,102"
            fill="none" stroke="#A08040" strokeWidth="1.5" opacity="0.6"/>
          <path d="M0,163 Q30,159 60,163 Q90,167 120,162 Q150,158 180,163 Q210,167 240,162 Q270,158 300,163"
            fill="none" stroke="#907030" strokeWidth="1.5" opacity="0.5"/>
        </svg>

        <div style={{ position: 'absolute', top: '3%', left: '50%', transform: 'translateX(-50%)', width: s * 0.28, height: s * 0.28 }}>
          <svg viewBox="0 0 100 100" width={s * 0.28} height={s * 0.28} aria-hidden>
            <polygon points="50,12 82,31 82,69 50,88 18,69 18,31" fill="none" stroke="#4A3820" strokeWidth="2" opacity="0.45" />
            <polygon points="50,26 69,37 69,63 50,74 31,63 31,37" fill="rgba(40,28,14,0.3)" stroke="#3A2A14" strokeWidth="1.5" opacity="0.35" />
            <circle cx="50" cy="50" r="12" fill="#2A1C0C" opacity="0.4" />
          </svg>
        </div>

        <div style={{
          position: 'absolute', inset: 0,
          borderRadius: '50%',
          background: `
            radial-gradient(circle at 32% 28%, rgba(255,240,180,0.15) 0%, transparent 45%),
            radial-gradient(circle at 72% 75%, rgba(0,0,0,0.78) 0%, transparent 55%)
          `,
        }} />

        <div style={{
          position: 'absolute', top: '14%', left: '20%', width: '28%', height: '20%',
          borderRadius: '50%', background: 'rgba(255,244,200,0.32)', filter: 'blur(10px)',
        }} />
      </div>

      {/* Ring shadow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        width: s * 1.8, height: s * 0.18,
        marginLeft: -(s * 1.8) / 2, marginTop: s * 0.1,
        borderRadius: '50%',
        background: 'rgba(0,0,0,0.25)',
        filter: 'blur(4px)',
        clipPath: 'inset(0 0 50% 0)',
        pointerEvents: 'none', zIndex: 11,
      }} />

      {/* Rings IN FRONT */}
      {RING_BANDS.map(ring => {
        if (ring.opacity === 0) return null
        const outerPx = (ring.outer * s) / 2
        const innerPx = (ring.inner * s) / 2
        return (
          <div
            key={`front-${ring.id}`}
            style={{
              position: 'absolute', top: '50%', left: '50%',
              width: outerPx * 2, height: outerPx * 0.28,
              marginLeft: -outerPx, marginTop: -(outerPx * 0.28) / 2,
              borderRadius: '50%',
              clipPath: 'inset(0 0 50% 0)',
              background: `radial-gradient(ellipse,
                transparent ${(innerPx / outerPx) * 100}%,
                ${ring.color} ${(innerPx / outerPx) * 100}%,
                ${ring.color} 100%
              )`,
              opacity: ring.opacity,
              pointerEvents: 'none', zIndex: 12,
            }}
          />
        )
      })}
    </div>
  )
}

// ─── Moon component ───────────────────────────────────────────────────────────
function SaturnMoon({ moon, paused, isMobile }: { moon: typeof SATURN_MOONS_BASE[0]; paused: boolean; isMobile: boolean }) {
  const [hovered, setHovered] = useState(false)
  const radius = isMobile ? Math.round(moon.radius * MOBILE_SCALE) : moon.radius
  const delay = -(moon.startAngle / 360) * moon.duration

  return (
    <div
      className="moon-arm"
      style={{
        '--moon-radius': `${radius}px`,
        '--moon-duration': `${moon.duration}s`,
        animationDelay: `${delay}s`,
        animationPlayState: paused || hovered ? 'paused' : 'running',
        zIndex: hovered ? 25 : 8,
      } as React.CSSProperties}
    >
      <div style={{ position: 'absolute', transform: `translateX(${radius}px)` }}>
        <motion.div
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          whileHover={{ scale: 1.4 }}
          style={{
            width: moon.size, height: moon.size,
            borderRadius: '50%',
            background: moon.gradient,
            boxShadow: moon.shadow,
            cursor: 'default',
            position: 'relative',
          }}
          aria-label={moon.name}
        >
          {moon.haze && (
            <div style={{
              position: 'absolute', inset: -moon.size * 0.15,
              borderRadius: '50%',
              background: 'radial-gradient(circle, transparent 55%, rgba(200,140,40,0.25) 70%, transparent 90%)',
              pointerEvents: 'none',
            }} />
          )}
          {moon.name === 'Enceladus' && (
            <svg viewBox="0 0 12 12" width={moon.size} height={moon.size} style={{ position: 'absolute', inset: 0 }} aria-hidden>
              <line x1="5" y1="9" x2="4" y2="12"  stroke="rgba(200,220,255,0.6)" strokeWidth="0.5"/>
              <line x1="6" y1="9" x2="6.5" y2="12" stroke="rgba(200,220,255,0.5)" strokeWidth="0.4"/>
              <line x1="7" y1="9" x2="8" y2="12"  stroke="rgba(200,220,255,0.4)" strokeWidth="0.4"/>
            </svg>
          )}
          {moon.name === 'Mimas' && (
            <svg viewBox="0 0 10 10" width={moon.size} height={moon.size} style={{ position: 'absolute', inset: 0 }} aria-hidden>
              <circle cx="3.5" cy="5" r="2.2" fill="none" stroke="#504048" strokeWidth="0.8" opacity="0.7"/>
              <circle cx="3.5" cy="5" r="0.8" fill="#403038" opacity="0.6"/>
            </svg>
          )}
        </motion.div>

        <AnimatePresence>
          {hovered && !isMobile && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{
                position: 'absolute', bottom: moon.size + 6, left: '50%', transform: 'translateX(-50%)',
                whiteSpace: 'nowrap', backgroundColor: 'rgba(4,3,2,0.95)',
                border: '0.5px solid #1A1A18', borderRadius: 5, padding: '5px 9px', pointerEvents: 'none',
              }}
            >
              <p style={{ fontFamily: 'var(--font-syne)', fontSize: 11, fontWeight: 700, color: '#F5F5F0', margin: '0 0 2px' }}>{moon.name}</p>
              <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#444440', margin: 0 }}>{moon.description}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Ring entry ───────────────────────────────────────────────────────────────
interface RingEntryProps { node: CelestialNode; index: number; onSelect: (n: CelestialNode) => void; isMobile: boolean }

const RING_ENTRY_POSITIONS = [
  { top: '42%', left: '78%' },
  { top: '44%', left: '85%' },
  { top: '55%', left: '80%' },
  { top: '53%', left: '73%' },
  { top: '48%', left: '90%' },
]

function RingEntry({ node, index, onSelect, isMobile }: RingEntryProps) {
  const [hovered, setHovered] = useState(false)
  const pos = RING_ENTRY_POSITIONS[index % RING_ENTRY_POSITIONS.length]

  return (
    <div style={{ position: 'absolute', ...pos, zIndex: hovered ? 20 : 13 }}>
      <motion.button
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        onClick={() => onSelect(node)}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3 + index * 0.7, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ scale: 1.8 }}
        whileTap={{ scale: 0.9 }}
        style={{
          width: isMobile ? 8 : 5,
          height: isMobile ? 8 : 5,
          borderRadius: '50%',
          background: '#1D9E75',
          border: 'none',
          cursor: 'pointer',
          boxShadow: hovered ? '0 0 8px 3px rgba(29,158,117,0.6)' : '0 0 4px rgba(29,158,117,0.35)',
          display: 'block',
          transition: 'box-shadow 0.2s',
        }}
        aria-label={node.title}
      />
      <AnimatePresence>
        {hovered && !isMobile && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)',
              whiteSpace: 'nowrap', backgroundColor: 'rgba(4,4,3,0.97)',
              border: '0.5px solid rgba(29,158,117,0.3)', borderRadius: 6,
              padding: '8px 12px', pointerEvents: 'none', minWidth: 190,
            }}
          >
            <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#1D9E75', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
              The Archive
            </span>
            <p style={{ fontFamily: 'var(--font-syne)', fontSize: 13, fontWeight: 700, color: '#F5F5F0', margin: '4px 0 3px' }}>
              {node.title}
            </p>
            {node.summary && (
              <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 11, color: '#666660', margin: 0, lineHeight: 1.4,
                overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {node.summary}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Mini Saturn ─────────────────────────────────────────────────────────────
function MiniSaturn({ size = 20 }: { size?: number }) {
  const s = size
  const ringW = s * 2.2
  const RINGS = [
    { inner: 1.25, outer: 1.52, opacity: 0.18, color: '#B89858' },
    { inner: 1.56, outer: 1.94, opacity: 0.52, color: '#D4B878' },
    { inner: 1.95, outer: 2.12, opacity: 0.36, color: '#C0A060' },
    { inner: 2.14, outer: 2.26, opacity: 0.28, color: '#B89858' },
  ]

  return (
    <div style={{ position: 'relative', width: ringW, height: s, flexShrink: 0 }}>
      {RINGS.map((r, i) => {
        const oPx = (r.outer * s) / 2; const iPx = (r.inner * s) / 2
        return (
          <div key={`rb${i}`} style={{
            position: 'absolute', top: '50%', left: '50%',
            width: oPx * 2, height: oPx * 0.26,
            marginLeft: -oPx, marginTop: -(oPx * 0.26) / 2,
            borderRadius: '50%', clipPath: 'inset(50% 0 0 0)',
            background: `radial-gradient(ellipse, transparent ${(iPx/oPx)*100}%, ${r.color} ${(iPx/oPx)*100}%, ${r.color} 100%)`,
            opacity: r.opacity * 0.7,
          }} />
        )
      })}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        width: s, height: s, marginLeft: -s / 2, marginTop: -s / 2,
        borderRadius: '50%', overflow: 'hidden', zIndex: 10,
        boxShadow: `inset -${s*0.13}px -${s*0.13}px ${s*0.28}px rgba(0,0,0,0.82)`,
        background: `linear-gradient(to bottom, #3A2C1A 0%, #7A6038 12%, #C8B060 22%, #8B6A3A 30%, #D4BC78 40%, #E8D898 52%, #C8A048 62%, #9A7840 72%, #503820 100%)`,
      }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle at 32% 28%, rgba(255,240,180,0.14) 0%, transparent 45%), radial-gradient(circle at 72% 75%, rgba(0,0,0,0.78) 0%, transparent 50%)' }} />
      </div>
      {RINGS.map((r, i) => {
        const oPx = (r.outer * s) / 2; const iPx = (r.inner * s) / 2
        return (
          <div key={`rf${i}`} style={{
            position: 'absolute', top: '50%', left: '50%',
            width: oPx * 2, height: oPx * 0.26,
            marginLeft: -oPx, marginTop: -(oPx * 0.26) / 2,
            borderRadius: '50%', clipPath: 'inset(0 0 50% 0)',
            background: `radial-gradient(ellipse, transparent ${(iPx/oPx)*100}%, ${r.color} ${(iPx/oPx)*100}%, ${r.color} 100%)`,
            opacity: r.opacity, zIndex: 12,
          }} />
        )
      })}
    </div>
  )
}

// ─── Archive detail panel ─────────────────────────────────────────────────────
function ArchiveDetail({ node, onBack, isMobile }: { node: CelestialNode; onBack: () => void; isMobile?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: isMobile ? 0 : 40, y: isMobile ? 20 : 0 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: isMobile ? 0 : 20, y: isMobile ? 10 : 0 }}
      transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
      style={{ flex: 1, paddingLeft: isMobile ? 0 : 52, maxWidth: isMobile ? undefined : 520 }}
    >
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 28, padding: 0 }}>
        <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#1D9E75' }}>←</span>
        <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#444440' }}>back to the rings</span>
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <MiniSaturn size={20} />
        <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#1D9E75', textTransform: 'uppercase', letterSpacing: '0.18em' }}>
          The Archive · Saturn Rings
        </span>
      </div>

      <h1 style={{ fontFamily: 'var(--font-syne)', fontSize: isMobile ? 26 : 30, fontWeight: 800, color: '#F5F5F0', margin: '0 0 8px', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
        {node.title}
      </h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#1D9E75', opacity: 0.8 }} />
        <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#1D9E7588', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          {node.status}
        </span>
      </div>

      {node.summary && (
        <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: isMobile ? 15 : 16, fontWeight: 300, color: '#888884', lineHeight: 1.75, marginBottom: 24 }}>
          {node.summary}
        </p>
      )}

      {node.tags.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
          {node.tags.map(tag => (
            <span key={tag} style={{
              fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9,
              color: '#1D9E7566', background: '#1D9E7510',
              border: '0.5px solid #1D9E7530', padding: '3px 8px', borderRadius: 2,
            }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {node.content && (
        <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 14, color: '#666660', lineHeight: 1.7, marginBottom: 20 }}>
          {node.content}
        </p>
      )}

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {node.project_slug && (
          <a href={`/work/${node.project_slug}`} style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 13, fontWeight: 500, color: '#0A0A0A', backgroundColor: '#1D9E75', padding: '9px 18px', borderRadius: 4, textDecoration: 'none' }}>
            View case study →
          </a>
        )}
        {node.external_url && (
          <a href={node.external_url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 13, color: '#888884', border: '0.5px solid #222220', padding: '9px 18px', borderRadius: 4, textDecoration: 'none' }}>
            ↗ External
          </a>
        )}
      </div>
    </motion.div>
  )
}

// ─── Main scene ───────────────────────────────────────────────────────────────
interface SaturnArchiveSceneProps {
  nodes: CelestialNode[]
  initialNode?: CelestialNode | null
  onClose: () => void
}

export default function SaturnArchiveScene({ nodes, initialNode, onClose }: SaturnArchiveSceneProps) {
  const [selected, setSelected] = useState<CelestialNode | null>(initialNode ?? null)
  const isMobile = useIsMobile()
  const sphereSize = isMobile ? 155 : 280

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') selected ? setSelected(null) : onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected, onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 overflow-hidden"
      style={{ backgroundColor: '#030404' }}
    >
      {/* Stars */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {Array.from({ length: 120 }).map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${((i * 137.5) % 100)}%`,
            top: `${((i * 97.3) % 100)}%`,
            width: i % 7 === 0 ? 2 : 1, height: i % 7 === 0 ? 2 : 1,
            borderRadius: '50%', backgroundColor: '#F5F5F0',
            opacity: 0.07 + (i % 6) * 0.04,
          }} />
        ))}
      </div>

      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(60,100,120,0.05) 0%, transparent 70%)',
      }} />

      {/* Breadcrumb */}
      <div style={{ position: 'absolute', top: 24, left: 24, zIndex: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#333330' }}>My World</button>
        <span style={{ color: '#222220', fontSize: 10 }}>→</span>
        <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: selected ? '#444440' : '#1D9E75' }}>
          The Archive
        </button>
        {selected && (
          <>
            <span style={{ color: '#222220', fontSize: 10 }}>→</span>
            <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#1D9E75' }}>
              {selected.title.length > (isMobile ? 14 : 22) ? selected.title.slice(0, isMobile ? 14 : 22) + '…' : selected.title}
            </span>
          </>
        )}
      </div>

      <button onClick={onClose} style={{ position: 'absolute', top: 24, right: 24, zIndex: 20, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#333330' }}>
        esc ×
      </button>

      {/* Scene */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '80px 0 60px' : '80px 48px 40px' }}>

        <motion.div
          animate={selected && !isMobile
            ? { scale: 0.36, x: -280, opacity: 0.6 }
            : { scale: 1, x: 0, opacity: 1 }
          }
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          style={{ position: 'relative', flexShrink: 0 }}
        >
          {/* Moon orbit tracks */}
          {SATURN_MOONS_BASE.map(m => {
            const r = isMobile ? Math.round(m.radius * MOBILE_SCALE) : m.radius
            return (
              <div key={m.name} style={{
                position: 'absolute', top: '50%', left: '50%',
                width: r * 2, height: r * 2,
                marginLeft: -r, marginTop: -r,
                borderRadius: '50%',
                border: '0.5px solid rgba(200,160,80,0.07)',
                pointerEvents: 'none',
              }} />
            )
          })}

          <SaturnSphere size={sphereSize} />

          {nodes.map((node, i) => (
            <RingEntry key={node.id} node={node} index={i} onSelect={setSelected} isMobile={isMobile} />
          ))}

          {SATURN_MOONS_BASE.map(moon => (
            <SaturnMoon key={moon.name} moon={moon} paused={!!selected} isMobile={isMobile} />
          ))}

          {!selected && (
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
              style={{ position: 'absolute', bottom: -36, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#333330', letterSpacing: '0.14em', textTransform: 'uppercase' }}
            >
              {nodes.length} archived
            </motion.p>
          )}
        </motion.div>

        {/* Desktop: inline detail */}
        <AnimatePresence>
          {selected && !isMobile && (
            <ArchiveDetail key={selected.id} node={selected} onBack={() => setSelected(null)} isMobile={false} />
          )}
        </AnimatePresence>
      </div>

      {/* Mobile: full-screen detail overlay */}
      <AnimatePresence>
        {selected && isMobile && (
          <motion.div
            key={`mobile-detail-${selected.id}`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            style={{
              position: 'fixed', inset: 0, zIndex: 60,
              backgroundColor: '#030404',
              overflowY: 'auto',
              padding: '72px 24px 48px',
            }}
          >
            <ArchiveDetail node={selected} onBack={() => setSelected(null)} isMobile />
          </motion.div>
        )}
      </AnimatePresence>

      {!selected && (
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#222220', whiteSpace: 'nowrap', letterSpacing: '0.12em' }}
        >
          {isMobile ? 'tap the ring particles to explore' : 'click the ring particles · hover moons to identify'}
        </motion.p>
      )}
    </motion.div>
  )
}
