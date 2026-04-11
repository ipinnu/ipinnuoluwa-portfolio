'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { CelestialNode } from '@/lib/types/celestial'

// ─── Mercury sphere ──────────────────────────────────────────────────────────
function MercurySphere({ size = 300 }: { size?: number }) {
  const s = size
  return (
    <div style={{ position: 'relative', width: s, height: s, flexShrink: 0 }}>

      {/* Exosphere glow — barely visible, sodium/potassium tinge */}
      <div style={{
        position: 'absolute',
        top: -s * 0.04, left: -s * 0.04,
        width: s * 1.08, height: s * 1.08,
        borderRadius: '50%',
        background: 'radial-gradient(circle, transparent 45%, rgba(180,120,60,0.07) 60%, transparent 80%)',
        pointerEvents: 'none',
      }} />

      {/* Planet body */}
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: '50%',
        background: `radial-gradient(circle at 32% 28%,
          #D4D4D4 0%,
          #A9A9A9 15%,
          #8B8B8B 35%,
          #5A5A5A 60%,
          #2A2A2A 85%,
          #141414 100%
        )`,
        boxShadow: `
          inset -${s*0.14}px -${s*0.14}px ${s*0.3}px rgba(0,0,0,0.85),
          inset ${s*0.03}px ${s*0.03}px ${s*0.08}px rgba(220,200,180,0.15),
          0 0 ${s*0.25}px rgba(180,120,60,0.12)
        `,
        overflow: 'hidden',
      }}>

        {/* Surface texture — dark plains, highland terrain */}
        <svg viewBox="0 0 300 300" width={s} height={s} style={{ position: 'absolute', inset: 0 }} aria-hidden>
          {/* Dark smooth volcanic plains (Caloris Planitia exterior) */}
          <ellipse cx="155" cy="165" rx="80" ry="55" fill="#4A4A4A" opacity="0.45" />
          <ellipse cx="60"  cy="220" rx="55" ry="40" fill="#505050" opacity="0.4" />
          <ellipse cx="230" cy="100" rx="45" ry="35" fill="#484848" opacity="0.35" />

          {/* ── Caloris Basin ── ~20°N 169°W → upper-left area */}
          {/* Outer rim — bright ejecta blanket */}
          <ellipse cx="90" cy="95" rx="70" ry="65" fill="none" stroke="#C0C0C0" strokeWidth="3" opacity="0.5" />
          {/* Outer ring 2 */}
          <ellipse cx="90" cy="95" rx="58" ry="54" fill="none" stroke="#B0B0B0" strokeWidth="1.5" opacity="0.35" />
          {/* Basin floor — darker */}
          <ellipse cx="90" cy="95" rx="45" ry="42" fill="#525252" opacity="0.6" />
          {/* Inner basin features */}
          <ellipse cx="90" cy="95" rx="28" ry="26" fill="#606060" opacity="0.4" />
          <ellipse cx="90" cy="95" rx="14" ry="13" fill="#707070" opacity="0.3" />
          {/* Basin label area — central peak ring */}
          <circle cx="90" cy="95" r="5" fill="#888880" opacity="0.5" />

          {/* ── Scattered impact craters ── */}
          {/* Large craters */}
          <circle cx="195" cy="65"  r="22" fill="none" stroke="#BEBEBE" strokeWidth="2.5" opacity="0.55" />
          <circle cx="195" cy="65"  r="15" fill="#585858" opacity="0.4" />
          <circle cx="195" cy="65"  r="5"  fill="#707070" opacity="0.35" /> {/* central peak */}

          <circle cx="250" cy="190" r="18" fill="none" stroke="#B8B8B8" strokeWidth="2" opacity="0.5" />
          <circle cx="250" cy="190" r="12" fill="#545454" opacity="0.45" />

          <circle cx="55"  cy="165" r="14" fill="none" stroke="#C0C0C0" strokeWidth="2" opacity="0.45" />
          <circle cx="55"  cy="165" r="9"  fill="#565656" opacity="0.4" />

          <circle cx="210" cy="235" r="20" fill="none" stroke="#BCBCBC" strokeWidth="2" opacity="0.4" />
          <circle cx="210" cy="235" r="13" fill="#505050" opacity="0.35" />
          <circle cx="210" cy="235" r="4"  fill="#686868" opacity="0.3" />

          <circle cx="160" cy="50"  r="12" fill="none" stroke="#C8C8C8" strokeWidth="1.5" opacity="0.5" />
          <circle cx="160" cy="50"  r="8"  fill="#5A5A5A" opacity="0.4" />

          <circle cx="130" cy="200" r="10" fill="none" stroke="#BCBCBC" strokeWidth="1.5" opacity="0.45" />
          <circle cx="130" cy="200" r="6"  fill="#545454" opacity="0.35" />

          {/* Medium craters */}
          <circle cx="240" cy="140" r="9"  fill="none" stroke="#C0C0C0" strokeWidth="1.5" opacity="0.4" />
          <circle cx="240" cy="140" r="5"  fill="#5A5A5A" opacity="0.35" />

          <circle cx="80"  cy="245" r="8"  fill="none" stroke="#BEBEBE" strokeWidth="1.5" opacity="0.4" />
          <circle cx="35"  cy="120" r="10" fill="none" stroke="#C4C4C4" strokeWidth="1.5" opacity="0.45" />
          <circle cx="170" cy="135" r="7"  fill="none" stroke="#BCBCBC" strokeWidth="1"   opacity="0.35" />
          <circle cx="270" cy="60"  r="8"  fill="none" stroke="#BEBEBE" strokeWidth="1.5" opacity="0.4" />
          <circle cx="45"  cy="65"  r="7"  fill="none" stroke="#C0C0C0" strokeWidth="1"   opacity="0.4" />
          <circle cx="115" cy="155" r="6"  fill="none" stroke="#BABABA" strokeWidth="1"   opacity="0.3" />
          <circle cx="185" cy="180" r="5"  fill="none" stroke="#C0C0C0" strokeWidth="1"   opacity="0.35" />

          {/* Small crater field */}
          {[
            [220,115,4],[140,78,3],[265,168,4],[95,130,3],[185,240,3],
            [155,175,4],[60,195,3],[240,265,3],[180,100,3],[110,235,4],
            [280,120,3],[30,170,3],[155,260,3],[290,240,4],[70,40,3],
          ].map(([cx,cy,r],i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke="#C0C0C0" strokeWidth="1" opacity="0.3" />
          ))}

          {/* ── Discovery Rupes (lobate scarp) ~NW quadrant ── */}
          <path d="M 40 80 Q 55 120 48 160 Q 44 180 50 200"
            fill="none" stroke="#D4D4D4" strokeWidth="2.5" opacity="0.4"
            strokeLinecap="round" />
          {/* Secondary scarp */}
          <path d="M 230 75 Q 242 100 238 130"
            fill="none" stroke="#C8C8C8" strokeWidth="1.5" opacity="0.3"
            strokeLinecap="round" />

          {/* Wrinkle ridges — subtle surface texture */}
          <path d="M 120 160 Q 145 155 165 162 Q 185 168 200 158"
            fill="none" stroke="#888888" strokeWidth="1" opacity="0.25" strokeLinecap="round"/>
          <path d="M 160 185 Q 175 182 190 187"
            fill="none" stroke="#888888" strokeWidth="1" opacity="0.2" strokeLinecap="round"/>

          {/* Bright hollows — unique to Mercury, shallow irregular depressions */}
          {[[125,85,3],[145,110,2],[100,130,2.5],[170,70,2],[200,150,2]].map(([cx,cy,r],i)=>(
            <circle key={`h${i}`} cx={cx} cy={cy} r={r} fill="#D4D4CC" opacity="0.5" />
          ))}
        </svg>

        {/* ── Terminator gradient — hard shadow line (no atmosphere) ── */}
        <div style={{
          position: 'absolute', inset: 0,
          borderRadius: '50%',
          background: `linear-gradient(105deg,
            transparent 0%,
            transparent 42%,
            rgba(0,0,0,0.25) 50%,
            rgba(0,0,0,0.75) 60%,
            rgba(0,0,0,0.95) 70%
          )`,
        }} />

        {/* Specular highlight — close to the sun */}
        <div style={{
          position: 'absolute',
          top: '12%', left: '18%',
          width: '32%', height: '24%',
          borderRadius: '50%',
          background: 'rgba(230,210,190,0.3)',
          filter: 'blur(10px)',
        }} />
      </div>
    </div>
  )
}

// ─── Forge installation (content entry on surface) ────────────────────────────
interface InstallationProps {
  node: CelestialNode
  index: number
  onSelect: (node: CelestialNode) => void
}

// Positions on the lit side of Mercury
const INSTALLATION_POSITIONS = [
  { top: '28%', left: '52%' },
  { top: '48%', left: '62%' },
  { top: '62%', left: '48%' },
  { top: '35%', left: '70%' },
  { top: '68%', left: '62%' },
]

function Installation({ node, index, onSelect }: InstallationProps) {
  const [hovered, setHovered] = useState(false)
  const pos = INSTALLATION_POSITIONS[index % INSTALLATION_POSITIONS.length]

  return (
    <div style={{ position: 'absolute', ...pos, zIndex: hovered ? 20 : 11 }}>
      <motion.button
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        onClick={() => onSelect(node)}
        whileHover={{ scale: 1.6 }}
        style={{
          width: 7, height: 7,
          borderRadius: 1,
          background: '#E8FF47',
          border: 'none',
          cursor: 'pointer',
          boxShadow: hovered ? '0 0 10px 3px rgba(232,255,71,0.6)' : '0 0 4px rgba(232,255,71,0.4)',
          display: 'block',
          transition: 'box-shadow 0.2s',
        }}
        aria-label={node.title}
      />
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              bottom: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              whiteSpace: 'nowrap',
              backgroundColor: 'rgba(8,6,4,0.96)',
              border: '0.5px solid rgba(232,255,71,0.3)',
              borderRadius: 6,
              padding: '8px 12px',
              pointerEvents: 'none',
              minWidth: 180,
            }}
          >
            <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#E8FF47', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
              The Forge
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
            <p style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#E8FF47', margin: '5px 0 0' }}>
              {node.status === 'active' ? '● deployed' : '◌ in progress'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Mini Mercury ─────────────────────────────────────────────────────────────
function MiniMercury({ size = 22 }: { size?: number }) {
  const s = size
  return (
    <div style={{ position: 'relative', width: s, height: s, flexShrink: 0 }}>
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: '50%',
        background: `radial-gradient(circle at 32% 28%, #CCCCCC 0%, #888888 30%, #585858 58%, #282828 82%, #121212 100%)`,
        boxShadow: `inset -${s*0.14}px -${s*0.14}px ${s*0.28}px rgba(0,0,0,0.85)`,
        overflow: 'hidden',
      }}>
        <svg viewBox="0 0 100 100" width={s} height={s} style={{ position: 'absolute', inset: 0 }} aria-hidden>
          {/* Caloris Basin */}
          <ellipse cx="30" cy="32" rx="22" ry="20" fill="none" stroke="#C0C0C0" strokeWidth="2" opacity="0.45"/>
          <ellipse cx="30" cy="32" rx="14" ry="13" fill="#525252" opacity="0.5"/>
          {/* Craters */}
          <circle cx="65" cy="22" r="7" fill="none" stroke="#BEBEBE" strokeWidth="1.5" opacity="0.45"/>
          <circle cx="80" cy="62" r="5" fill="none" stroke="#B8B8B8" strokeWidth="1" opacity="0.4"/>
          <circle cx="55" cy="72" r="4" fill="none" stroke="#BCBCBC" strokeWidth="1" opacity="0.35"/>
          {/* Scarp */}
          <path d="M14 26 Q18 40 16 52" fill="none" stroke="#D0D0D0" strokeWidth="1.5" opacity="0.3" strokeLinecap="round"/>
        </svg>
        {/* Terminator */}
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'linear-gradient(105deg, transparent 40%, rgba(0,0,0,0.28) 50%, rgba(0,0,0,0.78) 62%, rgba(0,0,0,0.96) 72%)' }} />
        {/* Specular */}
        <div style={{ position: 'absolute', top: '14%', left: '18%', width: '28%', height: '22%', borderRadius: '50%', background: 'rgba(230,210,190,0.25)', filter: 'blur(2px)' }} />
      </div>
    </div>
  )
}

// ─── Forge detail panel ───────────────────────────────────────────────────────
function ForgeDetail({ node, onBack }: { node: CelestialNode; onBack: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
      style={{ flex: 1, paddingLeft: 52, maxWidth: 560 }}
    >
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 28, padding: 0 }}>
        <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#E8FF47' }}>←</span>
        <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#444440' }}>back to surface</span>
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <MiniMercury size={22} />
        <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#E8FF47', textTransform: 'uppercase', letterSpacing: '0.18em' }}>
          The Forge · Mercury Surface
        </span>
      </div>

      <h1 style={{ fontFamily: 'var(--font-syne)', fontSize: 30, fontWeight: 800, color: '#F5F5F0', margin: '0 0 8px', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
        {node.title}
      </h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: node.status === 'active' ? '#22c55e' : '#EF9F27' }} />
        <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: node.status === 'active' ? '#22c55e' : '#EF9F27', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          {node.status}
        </span>
      </div>

      {node.summary && (
        <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 16, fontWeight: 300, color: '#888884', lineHeight: 1.75, marginBottom: 24 }}>
          {node.summary}
        </p>
      )}

      {node.tags.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
          {node.tags.map(tag => (
            <span key={tag} style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 9, color: '#444440', background: '#0D0D0D', border: '0.5px solid #1A1A1A', padding: '3px 8px', borderRadius: 2 }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 10 }}>
        {node.project_slug && (
          <a href={`/work/${node.project_slug}`} style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 13, fontWeight: 500, color: '#0A0A0A', backgroundColor: '#A3C4B4', padding: '9px 18px', borderRadius: 4, textDecoration: 'none' }}>
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
interface MercuryForgeSceneProps {
  nodes: CelestialNode[]
  initialNode?: CelestialNode | null
  onClose: () => void
}

export default function MercuryForgeScene({ nodes, initialNode, onClose }: MercuryForgeSceneProps) {
  const [selected, setSelected] = useState<CelestialNode | null>(initialNode ?? null)

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
      style={{ backgroundColor: '#050302' }}
    >
      {/* Stars */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {Array.from({ length: 130 }).map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${((i * 137.5) % 100)}%`,
            top: `${((i * 97.3) % 100)}%`,
            width: i % 7 === 0 ? 2 : 1,
            height: i % 7 === 0 ? 2 : 1,
            borderRadius: '50%',
            backgroundColor: '#F5F5F0',
            opacity: 0.08 + (i % 6) * 0.04,
          }} />
        ))}
      </div>

      {/* Sun glow — Mercury is close to the sun, visible upper-left */}
      <div className="absolute pointer-events-none" style={{
        top: -120, left: -120, width: 400, height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,200,80,0.35) 0%, rgba(255,150,30,0.12) 40%, transparent 70%)',
      }} />

      {/* Breadcrumb */}
      <div style={{ position: 'absolute', top: 24, left: 24, zIndex: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#333330' }}>My World</button>
        <span style={{ color: '#222220', fontSize: 10 }}>→</span>
        <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: selected ? '#444440' : '#E8FF47' }}>
          The Forge
        </button>
        {selected && (
          <>
            <span style={{ color: '#222220', fontSize: 10 }}>→</span>
            <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#E8FF47' }}>
              {selected.title.length > 22 ? selected.title.slice(0, 22) + '…' : selected.title}
            </span>
          </>
        )}
      </div>

      <button onClick={onClose} style={{ position: 'absolute', top: 24, right: 24, zIndex: 20, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#333330' }}>
        esc ×
      </button>

      {/* Scene */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 48px 40px' }}>

        {/* Mercury + installations */}
        <motion.div
          animate={selected
            ? { scale: 0.42, x: -260, opacity: 0.65 }
            : { scale: 1, x: 0, opacity: 1 }
          }
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          style={{ position: 'relative', flexShrink: 0 }}
        >
          <MercurySphere size={300} />

          {/* Surface installations */}
          {nodes.map((node, i) => (
            <Installation key={node.id} node={node} index={i} onSelect={setSelected} />
          ))}

          {!selected && (
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
              style={{ position: 'absolute', bottom: -32, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#333330', letterSpacing: '0.16em', textTransform: 'uppercase' }}
            >
              {nodes.length} deployments
            </motion.p>
          )}
        </motion.div>

        {/* Detail panel */}
        <AnimatePresence>
          {selected && (
            <ForgeDetail key={selected.id} node={selected} onBack={() => setSelected(null)} />
          )}
        </AnimatePresence>
      </div>

      {!selected && (
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, color: '#222220', whiteSpace: 'nowrap', letterSpacing: '0.12em' }}
        >
          hover an installation · click to explore
        </motion.p>
      )}
    </motion.div>
  )
}
