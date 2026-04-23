'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { CelestialNode } from '@/lib/types/celestial'
import { useIsMobile } from '@/hooks/useIsMobile'

const MOBILE_SCALE = 0.55

const GALILEAN_MOONS_BASE = [
  {
    name: 'Io',
    size: 16,
    radius: 200,
    duration: 19,
    startAngle: 40,
    gradient: 'radial-gradient(circle at 35% 30%, #FFE57A 0%, #FFD700 30%, #C8820A 60%, #8B4513 90%)',
    shadow: 'inset -3px -3px 6px rgba(0,0,0,0.6)',
    description: 'Most volcanic body in the solar system',
  },
  {
    name: 'Europa',
    size: 13,
    radius: 245,
    duration: 28,
    startAngle: 155,
    gradient: 'radial-gradient(circle at 38% 32%, #F0F8FF 0%, #D4EAF5 40%, #A8C8E0 75%, #7098B8 100%)',
    shadow: 'inset -2px -2px 5px rgba(0,0,0,0.4)',
    description: 'Icy crust hiding a subsurface ocean',
  },
  {
    name: 'Ganymede',
    size: 20,
    radius: 295,
    duration: 40,
    startAngle: 260,
    gradient: 'radial-gradient(circle at 35% 30%, #C0B898 0%, #9A9278 35%, #6E6858 65%, #3C3830 100%)',
    shadow: 'inset -4px -4px 8px rgba(0,0,0,0.65)',
    description: 'Largest moon in the solar system',
  },
  {
    name: 'Callisto',
    size: 17,
    radius: 345,
    duration: 56,
    startAngle: 330,
    gradient: 'radial-gradient(circle at 35% 30%, #6B5E52 0%, #4A3E36 35%, #2E2620 65%, #181410 100%)',
    shadow: 'inset -3px -3px 7px rgba(0,0,0,0.8)',
    description: 'Ancient, heavily cratered outer moon',
  },
]

// ─── Jupiter sphere ───────────────────────────────────────────────────────────
function JupiterSphere({ size = 340 }: { size?: number }) {
  const s = size

  return (
    <div style={{ position: 'relative', width: s, height: s, flexShrink: 0 }}>

      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        width: s * 1.6, height: s * 0.18,
        marginLeft: -(s * 1.6) / 2, marginTop: -(s * 0.18) / 2,
        borderRadius: '50%',
        border: '1px solid rgba(180,155,100,0.12)',
        transform: 'rotateX(78deg)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'absolute', top: -s * 0.06, left: '50%',
        transform: 'translateX(-50%)',
        width: s * 0.4, height: s * 0.12,
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(100,160,255,0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: '50%',
        overflow: 'hidden',
        boxShadow: `
          inset -${s*0.13}px -${s*0.13}px ${s*0.28}px rgba(0,0,0,0.8),
          inset ${s*0.03}px ${s*0.03}px ${s*0.08}px rgba(255,240,200,0.12),
          0 0 ${s*0.4}px rgba(200,150,80,0.15)
        `,
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            linear-gradient(to bottom,
              #3D2820 0%, #3D2820 5%,
              #6B5040 5%, #6B5040 9%,
              #C8B888 9%, #C8B888 14%,
              #8B6848 14%, #8B6848 18%,
              #D4C090 18%, #D4C090 23%,
              #C87941 23%, #C87941 32%,
              #FFFACD 32%, #FFFACD 42%,
              #C87941 42%, #C87941 55%,
              #E8D5A0 55%, #E8D5A0 61%,
              #A07858 61%, #A07858 66%,
              #C8B080 66%, #C8B080 71%,
              #806050 71%, #806050 75%,
              #9B7653 75%, #9B7653 82%,
              #4A2C1A 82%, #4A2C1A 100%
            )
          `,
        }} />

        <svg viewBox="0 0 340 340" width={s} height={s} style={{ position: 'absolute', inset: 0, opacity: 0.35 }} aria-hidden>
          <path d="M0,112 Q20,108 40,113 Q60,117 80,111 Q100,106 120,112 Q140,117 160,111 Q180,106 200,112 Q220,117 240,111 Q260,107 280,112 Q300,116 320,111 Q330,109 340,112" fill="none" stroke="#A07850" strokeWidth="2.5" opacity="0.5"/>
          <path d="M0,188 Q25,183 50,188 Q75,193 100,187 Q125,182 150,188 Q175,193 200,187 Q225,182 250,188 Q275,193 300,187 Q320,183 340,188" fill="none" stroke="#8B6040" strokeWidth="2" opacity="0.45"/>
          <path d="M30,130 Q45,124 55,132 Q65,140 75,128" fill="none" stroke="#C87030" strokeWidth="2" opacity="0.4"/>
          <path d="M120,126 Q135,120 145,128 Q155,136 165,124" fill="none" stroke="#C87030" strokeWidth="2" opacity="0.35"/>
        </svg>

        <motion.div
          animate={{ rotate: [0, -360] }}
          transition={{ duration: 180, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute', top: '51%', left: '30%',
            width: s * 0.22, height: s * 0.13,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at 40% 40%, #CD5C5C 0%, #8B3A00 45%, #6B2A00 75%, #4A1800 100%)',
            boxShadow: 'inset -3px -2px 8px rgba(0,0,0,0.5), 0 0 8px rgba(139,58,0,0.4)',
            transformOrigin: 'center center',
          }}
        >
          <div style={{ position: 'absolute', inset: '20%', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(200,80,20,0.3) 0%, transparent 80%)' }} />
        </motion.div>

        <motion.div
          animate={{ rotate: [0, -360] }}
          transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute', top: '61%', left: '62%',
            width: s * 0.12, height: s * 0.07,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at 40% 40%, #D2691E 0%, #A0522D 50%, #7A3820 100%)',
            boxShadow: 'inset -2px -1px 5px rgba(0,0,0,0.4)',
          }}
        />

        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: `
            radial-gradient(circle at 35% 30%, rgba(255,240,200,0.12) 0%, transparent 45%),
            radial-gradient(circle at 75% 75%, rgba(0,0,0,0.75) 0%, transparent 55%)
          `,
        }} />

        <div style={{
          position: 'absolute', top: '14%', left: '22%', width: '26%', height: '18%',
          borderRadius: '50%', background: 'rgba(255,248,220,0.28)', filter: 'blur(10px)',
        }} />
      </div>
    </div>
  )
}

// ─── Galilean moon ────────────────────────────────────────────────────────────
function GalileanMoon({ moon, paused, isMobile }: { moon: typeof GALILEAN_MOONS_BASE[0]; paused: boolean; isMobile: boolean }) {
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
        zIndex: hovered ? 20 : 8,
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
          {moon.name === 'Europa' && (
            <svg viewBox="0 0 13 13" width={moon.size} height={moon.size} style={{ position: 'absolute', inset: 0 }} aria-hidden>
              <line x1="3" y1="5" x2="10" y2="8"  stroke="#8B4513" strokeWidth="0.6" opacity="0.5"/>
              <line x1="2" y1="8" x2="8"  y2="11" stroke="#8B4513" strokeWidth="0.4" opacity="0.4"/>
              <line x1="5" y1="2" x2="11" y2="6"  stroke="#6B3510" strokeWidth="0.5" opacity="0.45"/>
            </svg>
          )}
          {moon.name === 'Io' && (
            <svg viewBox="0 0 16 16" width={moon.size} height={moon.size} style={{ position: 'absolute', inset: 0 }} aria-hidden>
              <circle cx="4"  cy="6"  r="1.2" fill="#3A2010" opacity="0.7"/>
              <circle cx="10" cy="4"  r="1.0" fill="#4A1505" opacity="0.65"/>
              <circle cx="7"  cy="11" r="1.4" fill="#3A1508" opacity="0.7"/>
              <circle cx="12" cy="9"  r="0.8" fill="#FF6B00" opacity="0.8"/>
            </svg>
          )}
          {moon.name === 'Ganymede' && (
            <svg viewBox="0 0 20 20" width={moon.size} height={moon.size} style={{ position: 'absolute', inset: 0 }} aria-hidden>
              <rect x="8" y="3" width="6" height="8" rx="1" fill="#D3CFBD" opacity="0.35"/>
              <rect x="3" y="10" width="4" height="6" rx="1" fill="#C8C4B0" opacity="0.28"/>
            </svg>
          )}
          {moon.name === 'Callisto' && (
            <svg viewBox="0 0 17 17" width={moon.size} height={moon.size} style={{ position: 'absolute', inset: 0 }} aria-hidden>
              <circle cx="5"  cy="6"  r="2"   fill="none" stroke="#5A4E44" strokeWidth="0.8" opacity="0.6"/>
              <circle cx="11" cy="4"  r="1.5" fill="none" stroke="#504840" strokeWidth="0.7" opacity="0.55"/>
              <circle cx="8"  cy="12" r="2.2" fill="none" stroke="#5C5048" strokeWidth="0.8" opacity="0.6"/>
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
                whiteSpace: 'nowrap', backgroundColor: 'rgba(5,3,2,0.95)',
                border: '0.5px solid #222218', borderRadius: 5, padding: '5px 9px', pointerEvents: 'none',
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

// ─── Storm entry ──────────────────────────────────────────────────────────────
interface StormEntryProps { node: CelestialNode; index: number; onSelect: (n: CelestialNode) => void; isMobile: boolean }

const STORM_POSITIONS = [
  { top: '20%', left: '55%' },
  { top: '72%', left: '45%' },
  { top: '40%', left: '72%' },
  { top: '56%', left: '22%' },
]

function StormEntry({ node, index, onSelect, isMobile }: StormEntryProps) {
  const [hovered, setHovered] = useState(false)
  const pos = STORM_POSITIONS[index % STORM_POSITIONS.length]
  const colors = ['rgba(120,60,30,0.7)', 'rgba(90,50,25,0.65)', 'rgba(100,55,28,0.68)', 'rgba(80,45,20,0.6)']

  return (
    <div style={{ position: 'absolute', ...pos, zIndex: hovered ? 20 : 12 }}>
      <motion.button
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        onClick={() => onSelect(node)}
        animate={{ scale: [1, 1.04, 1], rotate: [0, -3, 0] }}
        transition={{ duration: 8 + index * 2, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ scale: 1.3 }}
        whileTap={{ scale: 0.9 }}
        style={{
          width: isMobile ? 32 : 28,
          height: isMobile ? 18 : 16,
          borderRadius: '50%',
          background: colors[index % colors.length],
          border: `0.5px solid rgba(200,120,60,0.4)`,
          boxShadow: hovered ? '0 0 10px rgba(180,100,40,0.5)' : 'none',
          cursor: 'pointer',
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
              position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
              whiteSpace: 'nowrap', backgroundColor: 'rgba(5,3,2,0.96)',
              border: '0.5px solid rgba(153,60,29,0.4)', borderRadius: 6,
              padding: '8px 12px', pointerEvents: 'none', minWidth: 180,
            }}
          >
            <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#993C1D', textTransform: 'uppercase', letterSpacing: '0.14em' }}>The Dream</span>
            <p style={{ fontFamily: 'var(--font-syne)', fontSize: 13, fontWeight: 700, color: '#F5F5F0', margin: '4px 0 3px', fontStyle: 'italic' }}>{node.title}</p>
            {node.summary && (
              <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 11, color: '#666660', margin: 0, lineHeight: 1.4,
                overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {node.summary}
              </p>
            )}
            <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#993C1D99', margin: '5px 0 0', fontStyle: 'italic' }}>gathering energy</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Mini Jupiter ────────────────────────────────────────────────────────────
function MiniJupiter({ size = 22 }: { size?: number }) {
  const s = size
  return (
    <div style={{ position: 'relative', width: s, height: s, flexShrink: 0 }}>
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden',
        boxShadow: `inset -${s*0.13}px -${s*0.13}px ${s*0.28}px rgba(0,0,0,0.8)`,
        background: `linear-gradient(to bottom,
          #3D2820 0%, #3D2820 5%, #6B5040 5%, #6B5040 10%,
          #C8B888 10%, #C8B888 16%, #8B6848 16%, #8B6848 22%,
          #D4C090 22%, #D4C090 28%, #C87941 28%, #C87941 40%,
          #FFFACD 40%, #FFFACD 50%, #C87941 50%, #C87941 60%,
          #E8D5A0 60%, #E8D5A0 67%, #A07858 67%, #A07858 74%,
          #4A2C1A 74%, #4A2C1A 100%
        )`,
      }}>
        <div style={{
          position: 'absolute', top: '50%', left: '28%',
          width: `${s * 0.22}px`, height: `${s * 0.13}px`,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at 40% 40%, #CD5C5C 0%, #8B3A00 55%, #4A1800 100%)',
        }} />
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, rgba(255,240,200,0.1) 0%, transparent 45%), radial-gradient(circle at 75% 75%, rgba(0,0,0,0.72) 0%, transparent 52%)' }} />
        <div style={{ position: 'absolute', top: '14%', left: '22%', width: '26%', height: '18%', borderRadius: '50%', background: 'rgba(255,248,220,0.22)', filter: 'blur(2px)' }} />
      </div>
    </div>
  )
}

// ─── Dream detail panel ───────────────────────────────────────────────────────
function DreamDetail({ node, onBack, isMobile }: { node: CelestialNode; onBack: () => void; isMobile?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: isMobile ? 0 : 40, y: isMobile ? 20 : 0 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: isMobile ? 0 : 20, y: isMobile ? 10 : 0 }}
      transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
      style={{ flex: 1, paddingLeft: isMobile ? 0 : 52, maxWidth: isMobile ? undefined : 520 }}
    >
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 28, padding: 0 }}>
        <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#993C1D' }}>←</span>
        <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#444440' }}>back to atmosphere</span>
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <MiniJupiter size={22} />
        <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#993C1D', textTransform: 'uppercase', letterSpacing: '0.18em' }}>
          The Dream · Jupiter Storm
        </span>
      </div>

      <h1 style={{ fontFamily: 'var(--font-syne)', fontSize: isMobile ? 26 : 28, fontWeight: 800, color: '#F5F5F0', margin: '0 0 8px', letterSpacing: '-0.03em', lineHeight: 1.1, fontStyle: 'italic' }}>
        {node.title}
      </h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#993C1D', opacity: 0.7 }} />
        <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#993C1D88', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Gathering energy</span>
      </div>

      {node.summary && (
        <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: isMobile ? 15 : 16, fontWeight: 300, color: '#888884', lineHeight: 1.75, marginBottom: 24, fontStyle: 'italic' }}>
          {node.summary}
        </p>
      )}

      {node.tags.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
          {node.tags.map(tag => (
            <span key={tag} style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#993C1D55', border: '0.5px solid #993C1D33', padding: '3px 8px', borderRadius: 2 }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      <p style={{ fontFamily: 'var(--font-syne)', fontSize: 11, color: '#993C1D44', fontStyle: 'italic' }}>Not yet. But soon.</p>

      {!isMobile && (
        <div style={{ position: 'absolute', right: 24, bottom: 48, fontFamily: 'var(--font-syne)', fontSize: 72, fontWeight: 800, color: '#993C1D', opacity: 0.04, letterSpacing: '-0.04em', pointerEvents: 'none' }}>
          FORMING
        </div>
      )}
    </motion.div>
  )
}

// ─── Main scene ───────────────────────────────────────────────────────────────
interface JupiterDreamSceneProps {
  nodes: CelestialNode[]
  initialNode?: CelestialNode | null
  onClose: () => void
}

export default function JupiterDreamScene({ nodes, initialNode, onClose }: JupiterDreamSceneProps) {
  const [selected, setSelected] = useState<CelestialNode | null>(initialNode ?? null)
  const isMobile = useIsMobile()
  const sphereSize = isMobile ? 190 : 340

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
      style={{ backgroundColor: '#060401' }}
    >
      {/* Stars */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {Array.from({ length: 110 }).map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${((i * 137.5) % 100)}%`,
            top: `${((i * 97.3) % 100)}%`,
            width: i % 8 === 0 ? 2 : 1, height: i % 8 === 0 ? 2 : 1,
            borderRadius: '50%', backgroundColor: '#F5F5F0',
            opacity: 0.07 + (i % 7) * 0.04,
          }} />
        ))}
      </div>

      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 50% 40% at 45% 50%, rgba(200,130,60,0.08) 0%, transparent 70%)',
      }} />

      {/* Breadcrumb */}
      <div style={{ position: 'absolute', top: 24, left: 24, zIndex: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#333330' }}>My World</button>
        <span style={{ color: '#222220', fontSize: 10 }}>→</span>
        <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: selected ? '#444440' : '#993C1D' }}>
          The Dream
        </button>
        {selected && (
          <>
            <span style={{ color: '#222220', fontSize: 10 }}>→</span>
            <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#993C1D', fontStyle: 'italic' }}>
              {selected.title.length > (isMobile ? 14 : 22) ? selected.title.slice(0, isMobile ? 14 : 22) + '…' : selected.title}
            </span>
          </>
        )}
      </div>

      <button onClick={onClose} style={{ position: 'absolute', top: 24, right: 24, zIndex: 20, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#333330' }}>
        esc ×
      </button>

      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '80px 20px 60px' : '80px 48px 40px' }}>

        <motion.div
          animate={selected && !isMobile ? { scale: 0.38, x: -300, opacity: 0.6 } : { scale: 1, x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          style={{ position: 'relative', flexShrink: 0 }}
        >
          {/* Galilean moon orbit tracks */}
          {GALILEAN_MOONS_BASE.map(m => {
            const r = isMobile ? Math.round(m.radius * MOBILE_SCALE) : m.radius
            return (
              <div key={m.name} style={{
                position: 'absolute', top: '50%', left: '50%',
                width: r * 2, height: r * 2,
                marginLeft: -r, marginTop: -r,
                borderRadius: '50%',
                border: '0.5px solid rgba(200,140,60,0.08)',
                pointerEvents: 'none',
              }} />
            )
          })}

          <JupiterSphere size={sphereSize} />

          {nodes.map((node, i) => (
            <StormEntry key={node.id} node={node} index={i} onSelect={setSelected} isMobile={isMobile} />
          ))}

          {GALILEAN_MOONS_BASE.map(moon => (
            <GalileanMoon key={moon.name} moon={moon} paused={!!selected} isMobile={isMobile} />
          ))}

          {!selected && (
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
              style={{ position: 'absolute', bottom: -48, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#333330', letterSpacing: '0.14em', textTransform: 'uppercase' }}
            >
              {isMobile ? 'Io · Europa · Ganymede' : 'Io · Europa · Ganymede · Callisto'}
            </motion.p>
          )}
        </motion.div>

        {/* Desktop: inline detail */}
        <AnimatePresence>
          {selected && !isMobile && (
            <DreamDetail key={selected.id} node={selected} onBack={() => setSelected(null)} isMobile={false} />
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
              backgroundColor: '#060401',
              overflowY: 'auto',
              padding: '72px 24px 48px',
            }}
          >
            <DreamDetail node={selected} onBack={() => setSelected(null)} isMobile />
          </motion.div>
        )}
      </AnimatePresence>

      {!selected && (
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#222220', whiteSpace: 'nowrap', letterSpacing: '0.12em' }}
        >
          {isMobile ? 'tap a storm system to explore' : 'hover the storm systems · hover moons to identify'}
        </motion.p>
      )}
    </motion.div>
  )
}
