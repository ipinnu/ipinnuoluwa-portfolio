'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import type { CelestialNode } from '@/lib/types/celestial'
import { useIsMobile } from '@/hooks/useIsMobile'

const ORBIT_SLOTS_BASE = [
  { radius: 185, duration: 22, startAngle: 30 },
  { radius: 225, duration: 32, startAngle: 140 },
  { radius: 268, duration: 44, startAngle: 250 },
  { radius: 185, duration: 26, startAngle: 190 },
  { radius: 225, duration: 38, startAngle: 60 },
  { radius: 268, duration: 50, startAngle: 310 },
]
const MOBILE_SCALE = 0.54
const ORBIT_RADII_UNIQUE = [185, 225, 268]

// ─── Earth CSS layers ────────────────────────────────────────────────────────
function EarthSphere({ size = 280, small = false }: { size?: number; small?: boolean }) {
  const s = size
  return (
    <div style={{ position: 'relative', width: s, height: s, flexShrink: 0 }}>

      <div style={{
        position: 'absolute',
        top: -s * 0.08, left: -s * 0.08,
        width: s * 1.16, height: s * 1.16,
        borderRadius: '50%',
        background: 'radial-gradient(circle, transparent 42%, rgba(74,171,220,0.18) 55%, rgba(30,100,180,0.08) 70%, transparent 85%)',
        pointerEvents: 'none',
        animation: 'earth-shimmer 8s ease-in-out infinite',
      }} />

      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: '50%',
        background: `radial-gradient(circle at 38% 32%,
          #6AC4E8 0%,
          #2196a6 18%,
          #1565C0 40%,
          #0D47A1 62%,
          #072C6B 80%,
          #031540 100%
        )`,
        boxShadow: `
          inset -${s*0.12}px -${s*0.12}px ${s*0.3}px rgba(0,0,0,0.75),
          inset ${s*0.04}px ${s*0.04}px ${s*0.1}px rgba(180,230,255,0.2),
          0 0 ${s*0.5}px rgba(74,171,220,0.25),
          0 0 ${s*1.0}px rgba(30,80,180,0.1)
        `,
        overflow: 'hidden',
      }}>
        <svg
          viewBox="0 0 280 280"
          width={s} height={s}
          style={{ position: 'absolute', inset: 0, opacity: small ? 0.7 : 0.85 }}
          aria-hidden
        >
          <ellipse cx="82" cy="95" rx="28" ry="22" fill="#2d6a2d" opacity="0.75" transform="rotate(-15 82 95)" />
          <ellipse cx="72" cy="118" rx="18" ry="14" fill="#3a7a2a" opacity="0.65" />
          <ellipse cx="95" cy="165" rx="16" ry="26" fill="#2d6a2d" opacity="0.70" transform="rotate(10 95 165)" />
          <ellipse cx="142" cy="85" rx="16" ry="12" fill="#3a7a2a" opacity="0.72" transform="rotate(-8 142 85)" />
          <ellipse cx="148" cy="138" rx="18" ry="28" fill="#2d6a2d" opacity="0.75" transform="rotate(5 148 138)" />
          <ellipse cx="195" cy="88" rx="38" ry="22" fill="#2d6a2d" opacity="0.78" transform="rotate(-5 195 88)" />
          <ellipse cx="205" cy="108" rx="28" ry="16" fill="#3a7a2a" opacity="0.68" />
          <ellipse cx="210" cy="175" rx="18" ry="12" fill="#3a7a2a" opacity="0.70" transform="rotate(-10 210 175)" />
          <ellipse cx="140" cy="258" rx="50" ry="14" fill="#d4e8f0" opacity="0.35" />
          <ellipse cx="140" cy="18" rx="34" ry="10" fill="#d4e8f0" opacity="0.3" />
        </svg>

        <div style={{
          position: 'absolute', inset: 0,
          borderRadius: '50%',
          overflow: 'hidden',
          animation: `cloud-spin ${small ? 40 : 28}s linear infinite`,
          opacity: small ? 0.45 : 0.55,
        }}>
          <svg viewBox="0 0 280 280" width={s} height={s} aria-hidden>
            <ellipse cx="60"  cy="70"  rx="38" ry="12" fill="white" opacity="0.6" transform="rotate(-20 60 70)" />
            <ellipse cx="180" cy="55"  rx="45" ry="10" fill="white" opacity="0.55" />
            <ellipse cx="120" cy="130" rx="30" ry="9"  fill="white" opacity="0.5" transform="rotate(15 120 130)" />
            <ellipse cx="220" cy="150" rx="28" ry="8"  fill="white" opacity="0.45" />
            <ellipse cx="50"  cy="185" rx="35" ry="10" fill="white" opacity="0.5" transform="rotate(-10 50 185)" />
            <ellipse cx="155" cy="210" rx="42" ry="11" fill="white" opacity="0.55" transform="rotate(8 155 210)" />
            <ellipse cx="100" cy="240" rx="55" ry="9"  fill="white" opacity="0.4" />
          </svg>
        </div>

        <div style={{
          position: 'absolute',
          top: '14%', left: '22%',
          width: '28%', height: '20%',
          borderRadius: '50%',
          background: 'rgba(200,235,255,0.35)',
          filter: 'blur(8px)',
        }} />
      </div>
    </div>
  )
}

// ─── Satellite ─────────────────────────────────────────────────────────────
interface SatelliteProps {
  node: CelestialNode
  index: number
  isReading: boolean
  onSelect: (node: CelestialNode) => void
  isMobile: boolean
}

function Satellite({ node, index, isReading, onSelect, isMobile }: SatelliteProps) {
  const [hovered, setHovered] = useState(false)
  const slot = ORBIT_SLOTS_BASE[index % ORBIT_SLOTS_BASE.length]
  const radius = isMobile ? Math.round(slot.radius * MOBILE_SCALE) : slot.radius
  const delay = -(slot.startAngle / 360) * slot.duration

  return (
    <div
      className="moon-arm"
      style={{
        '--moon-radius': `${radius}px`,
        '--moon-duration': `${slot.duration}s`,
        animationDelay: `${delay}s`,
        animationPlayState: hovered || isReading ? 'paused' : 'running',
        zIndex: hovered ? 20 : 8,
      } as React.CSSProperties}
    >
      <div style={{ position: 'absolute', transform: `translateX(${radius}px)` }}>
        <motion.button
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          onClick={() => onSelect(node)}
          whileHover={{ scale: 1.6 }}
          whileTap={{ scale: 0.85 }}
          style={{
            width: isMobile ? 10 : 8,
            height: isMobile ? 10 : 8,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #ffffff, #b0cce0)',
            border: 'none',
            cursor: 'pointer',
            animation: 'sat-pulse 3s ease-in-out infinite',
            display: 'block',
            position: 'relative',
          }}
          aria-label={node.title}
        />

        <AnimatePresence>
          {hovered && !isMobile && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.95 }}
              transition={{ duration: 0.18 }}
              style={{
                position: 'absolute',
                bottom: 18,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 200,
                backgroundColor: 'rgba(10,12,20,0.95)',
                border: '0.5px solid rgba(83,74,183,0.4)',
                borderRadius: 8,
                padding: '10px 12px',
                pointerEvents: 'none',
                backdropFilter: 'blur(8px)',
              }}
            >
              <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#534AB7', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
                Chronicle
              </span>
              <p style={{ fontFamily: 'var(--font-syne)', fontSize: 12, fontWeight: 700, color: '#F5F5F0', margin: '4px 0 4px', lineHeight: 1.3 }}>
                {node.title}
              </p>
              {node.summary && (
                <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 11, color: '#555552', margin: 0, lineHeight: 1.5,
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {node.summary}
                </p>
              )}
              <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#534AB7', margin: '6px 0 0' }}>
                click to read →
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Mini Earth ──────────────────────────────────────────────────────────────
function MiniEarth({ size = 22 }: { size?: number }) {
  const s = size
  return (
    <div style={{ position: 'relative', width: s, height: s, flexShrink: 0 }}>
      <div style={{
        position: 'absolute',
        top: -s * 0.08, left: -s * 0.08,
        width: s * 1.16, height: s * 1.16,
        borderRadius: '50%',
        background: 'radial-gradient(circle, transparent 42%, rgba(74,171,220,0.2) 58%, transparent 80%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: '50%',
        background: `radial-gradient(circle at 38% 32%, #5AC8E8 0%, #1565C0 38%, #0D47A1 62%, #062040 100%)`,
        boxShadow: `inset -${s*0.13}px -${s*0.13}px ${s*0.28}px rgba(0,0,0,0.75), 0 0 ${s*0.4}px rgba(74,171,220,0.2)`,
        overflow: 'hidden',
      }}>
        <svg viewBox="0 0 100 100" width={s} height={s} style={{ position: 'absolute', inset: 0 }} aria-hidden>
          <ellipse cx="30" cy="38" rx="10" ry="8" fill="#2d6a2d" opacity="0.78" transform="rotate(-15 30 38)" />
          <ellipse cx="50" cy="30" rx="7" ry="5" fill="#3a7a2a" opacity="0.72" transform="rotate(-8 50 30)" />
          <ellipse cx="53" cy="56" rx="8" ry="12" fill="#2d6a2d" opacity="0.75" />
          <ellipse cx="70" cy="34" rx="14" ry="8" fill="#2d6a2d" opacity="0.75" transform="rotate(-5 70 34)" />
          <ellipse cx="75" cy="68" rx="6" ry="4" fill="#3a7a2a" opacity="0.68" />
          <ellipse cx="50" cy="92" rx="18" ry="6" fill="#d4e8f0" opacity="0.3" />
        </svg>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle at 38% 32%, rgba(255,255,255,0.08) 0%, transparent 45%), radial-gradient(circle at 70% 72%, rgba(0,0,0,0.68) 0%, transparent 52%)' }} />
        <div style={{ position: 'absolute', top: '14%', left: '22%', width: '28%', height: '20%', borderRadius: '50%', background: 'rgba(200,235,255,0.28)', filter: 'blur(2px)' }} />
      </div>
    </div>
  )
}

// ─── Post reading view ────────────────────────────────────────────────────────
function PostReader({ node, onBack, isMobile }: { node: CelestialNode; onBack: () => void; isMobile?: boolean }) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    const onScroll = () => {
      const pct = el.scrollTop / (el.scrollHeight - el.clientHeight)
      setProgress(Math.round(pct * 100))
    }
    el.addEventListener('scroll', onScroll)
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, x: isMobile ? 0 : 40, y: isMobile ? 20 : 0 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: isMobile ? 0 : 20, y: isMobile ? 10 : 0 }}
      transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
      style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: isMobile ? undefined : 620, paddingLeft: isMobile ? 0 : 48 }}
    >
      <div style={{ height: 1, background: '#1A1A1A', marginBottom: 28, flexShrink: 0 }}>
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
          style={{ height: '100%', background: '#534AB7' }}
        />
      </div>

      <button
        onClick={onBack}
        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24, padding: 0, alignSelf: 'flex-start' }}
      >
        <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#534AB7' }}>←</span>
        <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#444440' }}>back to orbit</span>
      </button>

      <div ref={contentRef} style={{ overflowY: 'auto', flex: 1, paddingRight: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
          <MiniEarth size={22} />
          <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#534AB7', textTransform: 'uppercase', letterSpacing: '0.18em' }}>
            The Chronicle · Earth
          </span>
        </div>

        <h1 style={{ fontFamily: 'var(--font-syne)', fontSize: isMobile ? 24 : 28, fontWeight: 800, color: '#F5F5F0', margin: '0 0 16px', lineHeight: 1.15, letterSpacing: '-0.03em' }}>
          {node.title}
        </h1>

        {node.tags.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
            {node.tags.map(tag => (
              <span key={tag} style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#534AB766', border: '0.5px solid #534AB733', padding: '2px 7px', borderRadius: 2 }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        <div style={{ height: '0.5px', background: 'linear-gradient(to right, #534AB755, transparent)', marginBottom: 28 }} />

        {node.content ? (
          <div className="prose" style={{ fontSize: 15 }}>{node.content}</div>
        ) : node.summary ? (
          <>
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: isMobile ? 15 : 16, fontWeight: 300, color: '#888884', lineHeight: 1.8, marginBottom: 32 }}>
              {node.summary}
            </p>
            <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#333330', fontStyle: 'italic' }}>
              Full text coming soon.
            </p>
          </>
        ) : (
          <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#333330', fontStyle: 'italic' }}>
            Full text coming soon.
          </p>
        )}
      </div>
    </motion.div>
  )
}

// ─── Main scene ───────────────────────────────────────────────────────────────
interface ChronicleEarthSceneProps {
  nodes: CelestialNode[]
  initialNode?: CelestialNode | null
  onClose: () => void
}

export default function ChronicleEarthScene({ nodes, initialNode, onClose }: ChronicleEarthSceneProps) {
  const [selectedNode, setSelectedNode] = useState<CelestialNode | null>(initialNode ?? null)
  const shouldReduce = useReducedMotion()
  const isMobile = useIsMobile()

  const sphereSize = isMobile ? 155 : 280
  const orbitRadii = ORBIT_RADII_UNIQUE.map(r => isMobile ? Math.round(r * MOBILE_SCALE) : r)

  const isReading = selectedNode !== null

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedNode) setSelectedNode(null)
        else onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedNode, onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 overflow-hidden"
      style={{ backgroundColor: '#020810' }}
    >
      {/* Stars */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {Array.from({ length: 120 }).map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${((i * 137.5) % 100)}%`,
            top: `${((i * 97.3) % 100)}%`,
            width: i % 5 === 0 ? 2 : 1,
            height: i % 5 === 0 ? 2 : 1,
            borderRadius: '50%',
            backgroundColor: '#F5F5F0',
            opacity: 0.1 + (i % 7) * 0.05,
          }} />
        ))}
      </div>

      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 50% at 30% 50%, rgba(21,101,192,0.12) 0%, transparent 70%)',
      }} />

      {/* Breadcrumb */}
      <div style={{ position: 'absolute', top: 24, left: 24, zIndex: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#333330' }}>
            My World
          </button>
          <span style={{ color: '#222220', fontSize: 10 }}>→</span>
          <button
            onClick={() => setSelectedNode(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: selectedNode ? '#444440' : '#534AB7' }}
          >
            The Chronicle
          </button>
          {selectedNode && (
            <>
              <span style={{ color: '#222220', fontSize: 10 }}>→</span>
              <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#534AB7' }}>
                {selectedNode.title.length > (isMobile ? 14 : 24) ? selectedNode.title.slice(0, isMobile ? 14 : 24) + '…' : selectedNode.title}
              </span>
            </>
          )}
        </div>
      </div>

      <button
        onClick={onClose}
        style={{ position: 'absolute', top: 24, right: 24, zIndex: 20, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#333330' }}
      >
        esc ×
      </button>

      {/* Main layout */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: isMobile ? '80px 20px 60px' : '80px 48px 40px',
        gap: 0,
      }}>

        {/* Earth + orbits */}
        <motion.div
          animate={isReading && !isMobile
            ? { scale: shouldReduce ? 1 : 0.42, x: shouldReduce ? 0 : -280, opacity: 0.7 }
            : { scale: 1, x: 0, opacity: 1 }
          }
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          style={{ position: 'relative', flexShrink: 0 }}
        >
          {/* Orbit track rings */}
          {orbitRadii.map(r => (
            <div key={r} style={{
              position: 'absolute',
              top: '50%', left: '50%',
              width: r * 2, height: r * 2,
              marginLeft: -r, marginTop: -r,
              borderRadius: '50%',
              border: '0.5px solid rgba(83,74,183,0.12)',
              pointerEvents: 'none',
            }} />
          ))}

          <EarthSphere size={sphereSize} small={isReading && !isMobile} />

          {nodes.map((node, i) => (
            <Satellite
              key={node.id}
              node={node}
              index={i}
              isReading={isReading}
              onSelect={setSelectedNode}
              isMobile={isMobile}
            />
          ))}

          {!isReading && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.5 }}
              style={{
                position: 'absolute',
                bottom: -36,
                left: '50%',
                transform: 'translateX(-50%)',
                whiteSpace: 'nowrap',
                fontFamily: 'var(--font-jetbrains-mono)',
                fontSize: 10,
                color: '#333330',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
              }}
            >
              {nodes.length} entries in orbit
            </motion.p>
          )}
        </motion.div>

        {/* Desktop: inline post reader */}
        <AnimatePresence>
          {selectedNode && !isMobile && (
            <PostReader
              key={selectedNode.id}
              node={selectedNode}
              onBack={() => setSelectedNode(null)}
              isMobile={false}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Mobile: full-screen post reader overlay */}
      <AnimatePresence>
        {selectedNode && isMobile && (
          <motion.div
            key={`mobile-reader-${selectedNode.id}`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            style={{
              position: 'fixed', inset: 0, zIndex: 60,
              backgroundColor: '#020810',
              display: 'flex', flexDirection: 'column',
              padding: '72px 24px 48px',
            }}
          >
            <PostReader node={selectedNode} onBack={() => setSelectedNode(null)} isMobile />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isReading && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1 }}
            style={{
              position: 'absolute',
              bottom: 28,
              left: '50%',
              transform: 'translateX(-50%)',
              fontFamily: 'var(--font-jetbrains-mono)',
              fontSize: 10,
              color: '#222220',
              whiteSpace: 'nowrap',
              letterSpacing: '0.12em',
            }}
          >
            {isMobile ? 'tap a satellite to read' : 'hover a satellite to preview · click to read'}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
