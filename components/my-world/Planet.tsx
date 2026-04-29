'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import type { CelestialNode, Planet as PlanetType } from '@/lib/types/celestial'
import { PLANET_CONFIG } from '@/lib/types/celestial'
import Moon from './Moon'
import LockArtifact    from './LockArtifact'
import InkArtifact     from './InkArtifact'
import ArchiveArtifact from './ArchiveArtifact'

interface PlanetProps {
  type: PlanetType
  nodes: CelestialNode[]
  onOpenNode: (node: CelestialNode) => void
  onLockClick?:    () => void
  onInkClick?:     () => void
  onArchiveClick?: () => void
  onPlanetClick?:  () => void
}

const MOON_RADII = [65, 85, 105, 125]

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}

// ─── Mercury (The Forge) ──────────────────────────────────────────────────────
function MercuryBody({ size }: { size: number }) {
  const s = size
  return (
    <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden' }}>
      {/* Base gray rocky surface */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(circle at 32% 28%,
          #D0D0D0 0%, #A8A8A8 15%, #888888 35%, #585858 60%, #282828 85%, #121212 100%
        )`,
      }} />
      {/* Caloris Basin hint */}
      <svg viewBox="0 0 100 100" width={s} height={s} style={{ position: 'absolute', inset: 0 }} aria-hidden>
        <ellipse cx="30" cy="32" rx="22" ry="20" fill="none" stroke="#C0C0C0" strokeWidth="1.5" opacity="0.45"/>
        <ellipse cx="30" cy="32" rx="14" ry="13" fill="#525252" opacity="0.5"/>
        {/* craters */}
        <circle cx="65" cy="22" r="7"  fill="none" stroke="#BEBEBE" strokeWidth="1" opacity="0.5"/>
        <circle cx="65" cy="22" r="4"  fill="#585858" opacity="0.4"/>
        <circle cx="80" cy="62" r="6"  fill="none" stroke="#B8B8B8" strokeWidth="1" opacity="0.45"/>
        <circle cx="18" cy="55" r="5"  fill="none" stroke="#C0C0C0" strokeWidth="1" opacity="0.4"/>
        <circle cx="55" cy="72" r="4"  fill="none" stroke="#BCBCBC" strokeWidth="0.8" opacity="0.4"/>
        <circle cx="74" cy="42" r="3"  fill="none" stroke="#C0C0C0" strokeWidth="0.8" opacity="0.35"/>
        {/* Discovery Rupes scarp */}
        <path d="M14 26 Q18 40 16 52" fill="none" stroke="#D0D0D0" strokeWidth="1.2" opacity="0.35" strokeLinecap="round"/>
      </svg>
      {/* Hard terminator — no atmosphere */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(105deg, transparent 0%, transparent 42%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.78) 62%, rgba(0,0,0,0.96) 72%)`,
      }} />
      {/* Specular highlight */}
      <div style={{ position: 'absolute', top: '14%', left: '20%', width: '28%', height: '22%', borderRadius: '50%', background: 'rgba(230,210,190,0.28)', filter: 'blur(4px)' }} />
    </div>
  )
}

// ─── Earth (The Chronicle) ────────────────────────────────────────────────────
function EarthBody({ size }: { size: number }) {
  const s = size
  return (
    <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden' }}>
      {/* Ocean base */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(circle at 35% 32%, #2A6DB8 0%, #1A4F8C 35%, #0F3566 65%, #061828 100%)`,
      }} />
      {/* SVG continents */}
      <svg viewBox="0 0 100 100" width={s} height={s} style={{ position: 'absolute', inset: 0 }} aria-hidden>
        {/* Africa */}
        <ellipse cx="54" cy="55" rx="9" ry="13" fill="#2d6a2d" opacity="0.8"/>
        {/* Europe */}
        <ellipse cx="50" cy="36" rx="7" ry="5" fill="#3a7a3a" opacity="0.75"/>
        {/* Americas */}
        <ellipse cx="32" cy="42" rx="8" ry="12" fill="#2d6a2d" opacity="0.8"/>
        {/* Asia */}
        <ellipse cx="66" cy="38" rx="14" ry="9" fill="#3a7a3a" opacity="0.75"/>
        {/* Australia */}
        <ellipse cx="74" cy="65" rx="6" ry="5" fill="#2d6a2d" opacity="0.7"/>
        {/* Antarctica ice cap */}
        <ellipse cx="50" cy="92" rx="16" ry="6" fill="#E8E8F0" opacity="0.6"/>
      </svg>
      {/* Cloud wisps */}
      <svg viewBox="0 0 100 100" width={s} height={s} style={{ position: 'absolute', inset: 0 }} aria-hidden>
        <ellipse cx="42" cy="28" rx="10" ry="3" fill="rgba(255,255,255,0.45)" />
        <ellipse cx="68" cy="48" rx="8"  ry="2.5" fill="rgba(255,255,255,0.4)" />
        <ellipse cx="28" cy="58" rx="9"  ry="2.5" fill="rgba(255,255,255,0.38)" />
        <ellipse cx="55" cy="68" rx="7"  ry="2" fill="rgba(255,255,255,0.35)" />
      </svg>
      {/* 3D lighting */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(circle at 35% 32%, rgba(255,255,255,0.1) 0%, transparent 45%), radial-gradient(circle at 70% 72%, rgba(0,0,0,0.72) 0%, transparent 55%)`,
      }} />
    </div>
  )
}

// ─── Jupiter (The Dream) ──────────────────────────────────────────────────────
function JupiterBody({ size }: { size: number }) {
  const s = size
  return (
    <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden' }}>
      {/* Banded atmosphere */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(to bottom,
          #3D2820 0%, #3D2820 6%,
          #6B5040 6%, #6B5040 11%,
          #C8B888 11%, #C8B888 17%,
          #8B6848 17%, #8B6848 22%,
          #D4C090 22%, #D4C090 28%,
          #C87941 28%, #C87941 38%,
          #FFFACD 38%, #FFFACD 48%,
          #C87941 48%, #C87941 60%,
          #E8D5A0 60%, #E8D5A0 67%,
          #A07858 67%, #A07858 72%,
          #C8B080 72%, #C8B080 78%,
          #806050 78%, #806050 84%,
          #4A2C1A 84%, #4A2C1A 100%
        )`,
      }} />
      {/* Great Red Spot */}
      <div style={{
        position: 'absolute',
        top: '51%', left: '28%',
        width: `${s * 0.22}px`, height: `${s * 0.13}px`,
        borderRadius: '50%',
        background: 'radial-gradient(ellipse at 40% 40%, #CD5C5C 0%, #8B3A00 50%, #4A1800 100%)',
      }} />
      {/* 3D lighting */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(circle at 35% 30%, rgba(255,240,200,0.12) 0%, transparent 45%), radial-gradient(circle at 75% 75%, rgba(0,0,0,0.75) 0%, transparent 55%)`,
      }} />
      {/* Specular */}
      <div style={{ position: 'absolute', top: '14%', left: '22%', width: '26%', height: '18%', borderRadius: '50%', background: 'rgba(255,248,220,0.28)', filter: 'blur(6px)' }} />
    </div>
  )
}

// ─── Saturn (The Archive) ─────────────────────────────────────────────────────
function SaturnBody({ size }: { size: number }) {
  const s = size
  // Rings extend beyond sphere — we need a wider container
  const ringW = s * 2.2
  const ringH = s * 0.22

  const RINGS = [
    { inner: 1.25, outer: 1.52, opacity: 0.18, color: '#B89858' },
    { inner: 1.56, outer: 1.94, opacity: 0.52, color: '#D4B878' },
    { inner: 1.95, outer: 2.12, opacity: 0.36, color: '#C0A060' },
    { inner: 2.14, outer: 2.26, opacity: 0.28, color: '#B89858' },
  ]

  return (
    // Wider container to accommodate rings — centered on planet
    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: ringW, height: s, pointerEvents: 'none' }}>

      {/* Rings BEHIND */}
      {RINGS.map((r, i) => {
        const oPx = (r.outer * s) / 2
        const iPx = (r.inner * s) / 2
        return (
          <div key={`rb${i}`} style={{
            position: 'absolute', top: '50%', left: '50%',
            width: oPx * 2, height: oPx * 0.26,
            marginLeft: -oPx, marginTop: -(oPx * 0.26) / 2,
            borderRadius: '50%',
            clipPath: 'inset(50% 0 0 0)',
            background: `radial-gradient(ellipse, transparent ${(iPx/oPx)*100}%, ${r.color} ${(iPx/oPx)*100}%, ${r.color} 100%)`,
            opacity: r.opacity * 0.7,
            pointerEvents: 'none',
            zIndex: 4,
          }} />
        )
      })}

      {/* Planet body */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        width: s, height: s,
        marginLeft: -s/2, marginTop: -s/2,
        borderRadius: '50%',
        overflow: 'hidden',
        zIndex: 10,
        pointerEvents: 'auto',
      }}>
        {/* Banded surface */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(to bottom,
            #3A2C1A 0%, #3A2C1A 7%,
            #7A6038 7%, #7A6038 13%,
            #C8B060 13%, #C8B060 20%,
            #8B6A3A 20%, #8B6A3A 26%,
            #D4BC78 26%, #D4BC78 33%,
            #B89040 33%, #B89040 40%,
            #E8D898 40%, #E8D898 52%,
            #C8A048 52%, #C8A048 61%,
            #D8C070 61%, #D8C070 68%,
            #9A7840 68%, #9A7840 75%,
            #503820 75%, #503820 100%
          )`,
        }} />
        {/* Polar hexagon hint */}
        <svg viewBox="0 0 100 100" width={s} height={s} style={{ position: 'absolute', inset: 0, opacity: 0.5 }} aria-hidden>
          <polygon points="50,6 72,18 72,42 50,54 28,42 28,18" fill="none" stroke="#3A2810" strokeWidth="2" opacity="0.5"/>
        </svg>
        {/* 3D lighting */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(circle at 32% 28%, rgba(255,240,180,0.15) 0%, transparent 45%), radial-gradient(circle at 72% 75%, rgba(0,0,0,0.8) 0%, transparent 55%)`,
        }} />
        {/* Specular */}
        <div style={{ position: 'absolute', top: '14%', left: '20%', width: '28%', height: '20%', borderRadius: '50%', background: 'rgba(255,244,200,0.3)', filter: 'blur(5px)' }} />
      </div>

      {/* Rings IN FRONT */}
      {RINGS.map((r, i) => {
        const oPx = (r.outer * s) / 2
        const iPx = (r.inner * s) / 2
        return (
          <div key={`rf${i}`} style={{
            position: 'absolute', top: '50%', left: '50%',
            width: oPx * 2, height: oPx * 0.26,
            marginLeft: -oPx, marginTop: -(oPx * 0.26) / 2,
            borderRadius: '50%',
            clipPath: 'inset(0 0 50% 0)',
            background: `radial-gradient(ellipse, transparent ${(iPx/oPx)*100}%, ${r.color} ${(iPx/oPx)*100}%, ${r.color} 100%)`,
            opacity: r.opacity,
            pointerEvents: 'none',
            zIndex: 12,
          }} />
        )
      })}
    </div>
  )
}

// ─── Planet shell ─────────────────────────────────────────────────────────────
export default function Planet({ type, nodes, onOpenNode, onLockClick, onInkClick, onArchiveClick, onPlanetClick }: PlanetProps) {
  const config = PLANET_CONFIG[type]
  const size = config.size
  const rgb = hexToRgb(config.color)
  const isSaturn = type === 'archive'
  const isDream = type === 'dream'

  const orbitRadius = useMemo(() =>
    nodes.map((_, i) => MOON_RADII[Math.min(i, MOON_RADII.length - 1)]),
  [nodes])

  // Saturn needs extra width for rings
  const containerSize = isSaturn
    ? Math.max(size * 2.2, size + 260)
    : size + 260

  return (
    <div style={{ position: 'relative', width: containerSize, height: containerSize }}>

      {/* Orbit track rings */}
      {orbitRadius.map((r, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: '50%', left: '50%',
            width: r * 2, height: r * 2,
            marginLeft: -r, marginTop: -r,
            borderRadius: '50%',
            border: `0.5px solid rgba(${rgb},${isDream ? 0.06 : 0.1})`,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Planet sphere wrapper — clickable */}
      <motion.div
        onClick={onPlanetClick}
        style={{
          position: 'absolute',
          top: '50%', left: '50%',
          width: size, height: size,
          marginLeft: -size / 2, marginTop: -size / 2,
          borderRadius: '50%',
          cursor: onPlanetClick ? 'pointer' : 'default',
          boxShadow: `
            inset -${size * 0.12}px -${size * 0.12}px ${size * 0.3}px rgba(0,0,0,0.75),
            inset ${size * 0.04}px ${size * 0.04}px ${size * 0.12}px rgba(255,255,255,0.08),
            0 0 ${size * 0.6}px rgba(${rgb},${isDream ? 0.1 : 0.15}),
            0 0 ${size * 1.2}px rgba(${rgb},0.05)
          `,
          opacity: isDream ? 0.8 : 1,
          filter: isDream ? 'blur(0.3px)' : 'none',
          zIndex: 10,
          overflow: (isSaturn || (isDream && !!onArchiveClick)) ? 'visible' : 'hidden',
        }}
        animate={isDream
          ? { scale: [1, 1.02, 1], opacity: [0.75, 0.85, 0.75] }
          : { scale: [1, 1.008, 1] }
        }
        transition={{ duration: isDream ? 5 : 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        {type === 'forge'     && <MercuryBody size={size} />}
        {type === 'chronicle' && <EarthBody   size={size} />}
        {type === 'dream'     && <JupiterBody size={size} />}
        {type === 'archive'   && <SaturnBody  size={size} />}

        {/* Archive artifact — inside sphere wrapper (overflow:visible) so it sits on the planet */}
        {type === 'dream' && onArchiveClick && (
          <div style={{ position: 'absolute', bottom: -18, right: -18 }} onClick={e => e.stopPropagation()}>
            <ArchiveArtifact onTriggered={onArchiveClick} />
          </div>
        )}
      </motion.div>

      {/* Glow pulse ring */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        width: size * 1.6, height: size * 1.6,
        marginLeft: -(size * 1.6) / 2, marginTop: -(size * 1.6) / 2,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(${rgb},0.1) 0%, transparent 70%)`,
        animation: 'planet-pulse 5s ease-in-out infinite',
        pointerEvents: 'none',
        zIndex: 9,
      }} />

      {/* Moons */}
      {nodes.map((node, i) => (
        <Moon
          key={node.id}
          node={node}
          index={i}
          radius={orbitRadius[i]}
          onOpen={onOpenNode}
        />
      ))}

      {/* Lock artifact (Forge only) */}
      {type === 'forge' && onLockClick && (
        <LockArtifact onTriggered={onLockClick} />
      )}

      {/* Ink artifact (Chronicle only) */}
      {type === 'chronicle' && onInkClick && (
        <InkArtifact onTriggered={onInkClick} />
      )}

    </div>
  )
}
