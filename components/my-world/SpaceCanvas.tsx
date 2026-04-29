'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import type { CelestialNode, CometData } from '@/lib/types/celestial'
import { PLANET_CONFIG } from '@/lib/types/celestial'
import { useIsMobile } from '@/hooks/useIsMobile'
import StarField from './StarField'
import TheSun from './TheSun'
import Planet from './Planet'
import Comet from './Comet'
import MercuryForgeScene from './realms/MercuryForgeScene'
import ChronicleEarthScene from './realms/ChronicleEarthScene'
import SaturnArchiveScene from './realms/SaturnArchiveScene'
import JupiterDreamScene from './realms/JupiterDreamScene'
import PasswordGate   from './asset-manager/PasswordGate'
import Dashboard       from './asset-manager/Dashboard'
import ChronicleStudio from './chronicle-studio/ChronicleStudio'
import ArchiveStudio   from './archive/ArchiveStudio'

interface SpaceCanvasProps {
  nodes: CelestialNode[]
  comet: CometData | null
}

export default function SpaceCanvas({ nodes, comet }: SpaceCanvasProps) {
  const { scrollY } = useScroll()
  const isMobile = useIsMobile()
  const [openNode, setOpenNode] = useState<CelestialNode | null>(null)
  const [openPlanet, setOpenPlanet] = useState<'forge' | 'chronicle' | 'archive' | 'dream' | null>(null)
  const [assetManagerState,   setAssetManagerState]   = useState<'closed' | 'password' | 'open'>('closed')
  const [chronicleStudioOpen, setChronicleStudioOpen] = useState(false)
  const [archiveState,        setArchiveState]         = useState<'closed' | 'password' | 'open'>('closed')

  // Parallax transforms per layer
  const sunY        = useTransform(scrollY, [0, 4000], [0, -4000 * 0.3])
  const starY1      = useTransform(scrollY, [0, 4000], [0, -4000 * 0.08])
  const starY2      = useTransform(scrollY, [0, 4000], [0, -4000 * 0.15])
  const forgeY      = useTransform(scrollY, [0, 4000], [0, -4000 * 0.8])
  const chronicleY  = useTransform(scrollY, [0, 4000], [0, -4000 * 0.65])
  const archiveY    = useTransform(scrollY, [0, 4000], [0, -4000 * 0.55])
  const dreamY      = useTransform(scrollY, [0, 4000], [0, -4000 * 0.45])
  const cometY      = useTransform(scrollY, [0, 4000], [0, -4000 * 0.2])

  // Entry text fade
  const entryOpacity  = useTransform(scrollY, [0, 300], [1, 0])
  const entryY        = useTransform(scrollY, [0, 300], [0, -40])

  // Planet label fades (appear when scroll reaches their section)
  const forgeLabel    = useTransform(scrollY, [600, 900], [0, 1])
  const chronicleLabel = useTransform(scrollY, [1200, 1500], [0, 1])
  const archiveLabel  = useTransform(scrollY, [1800, 2100], [0, 1])
  const dreamLabel    = useTransform(scrollY, [2400, 2700], [0, 1])

  const handleOpenNode = useCallback((node: CelestialNode) => {
    setOpenNode(node)
    setOpenPlanet(node.planet as 'forge' | 'chronicle' | 'archive' | 'dream')
  }, [])
  const handleClose = useCallback(() => {
    setOpenNode(null)
    setOpenPlanet(null)
  }, [])

  // Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenNode(null)
        setOpenPlanet(null)
        setAssetManagerState('closed')
        setChronicleStudioOpen(false)
        setArchiveState('closed')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const forgeNodes     = nodes.filter(n => n.planet === 'forge')
  const chronicleNodes = nodes.filter(n => n.planet === 'chronicle')
  const archiveNodes   = nodes.filter(n => n.planet === 'archive')
  const dreamNodes     = nodes.filter(n => n.planet === 'dream')

  return (
    <>
      {/* ─── Floating breadcrumb ─── */}
      <div className="fixed top-20 left-6 z-10 font-mono text-[11px] text-text-tertiary pointer-events-none">
        My World
      </div>

      {/* ─── Main scroll canvas ─── */}
      <div
        className="relative brainbox-grid"
        style={{ height: '600vh', backgroundColor: '#0A0A0A', overflowX: 'hidden' }}
      >
        {/* Ambient top glow */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 30% at 50% 0%, rgba(232,220,100,0.05) 0%, transparent 60%)', zIndex: 0 }}
        />

        {/* ── Layer 1: Distant stars ── */}
        <motion.div className="absolute inset-0 pointer-events-none" style={{ y: starY1 }}>
          <StarField />
        </motion.div>

        {/* ── Layer 2: Closer stars / nebula hints ── */}
        <motion.div className="absolute inset-0 pointer-events-none" style={{ y: starY2, opacity: 0.6 }}>
          <StarField />
        </motion.div>

        {/* ── Layer 3: The Source (sun) ── */}
        <motion.div
          className="absolute pointer-events-none"
          style={{ y: sunY, top: '16vh', left: '50%', x: '-50%', zIndex: 3 }}
        >
          <TheSun />
          {/* "Everything starts here." */}
          <motion.p
            style={{ opacity: entryOpacity }}
            className="font-syne text-[13px] text-text-tertiary text-center mt-3 whitespace-nowrap"
          >
            Everything starts here.
          </motion.p>
        </motion.div>

        {/* ── Entry section text ── */}
        <motion.div
          style={{ opacity: entryOpacity, y: entryY, position: 'absolute', top: '53vh', left: '50%', transform: 'translateX(-50%)', zIndex: 5, textAlign: 'center' }}
          className="pointer-events-none"
        >
          <p className="font-syne text-lg text-text-secondary">Welcome to my world.</p>
          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: 1, height: 32,
              background: 'linear-gradient(to bottom, #444440, transparent)',
              animation: 'chevron-bounce 2s infinite',
            }} />
          </div>
        </motion.div>

        {/* ── Layer 7: The Forge ── */}
        <motion.div
          className="absolute"
          style={{ y: forgeY, bottom: '280vh', ...(isMobile ? { left: '50%', x: '-50%' } : { right: '12%' }), zIndex: 7 }}
        >
          <motion.div style={{ opacity: forgeLabel }}>
            <p className="font-mono text-[10px] text-text-tertiary uppercase tracking-widest mb-3 text-right" style={{ textAlign: isMobile ? 'center' : 'right' }}>
              {PLANET_CONFIG.forge.name} · {PLANET_CONFIG.forge.subtitle}
            </p>
          </motion.div>
          <Planet
            type="forge"
            nodes={forgeNodes}
            onOpenNode={handleOpenNode}
            onLockClick={() => setAssetManagerState('password')}
            onPlanetClick={() => setOpenPlanet('forge')}
          />
        </motion.div>

        {/* ── Layer 6: The Chronicle ── */}
        <motion.div
          className="absolute"
          style={{ y: chronicleY, bottom: '180vh', ...(isMobile ? { left: '50%', x: '-50%' } : { left: '10%' }), zIndex: 6 }}
        >
          <motion.div style={{ opacity: chronicleLabel }}>
            <p className="font-mono text-[10px] text-text-tertiary uppercase tracking-widest mb-3">
              {PLANET_CONFIG.chronicle.name} · {PLANET_CONFIG.chronicle.subtitle}
            </p>
          </motion.div>
          <Planet
            type="chronicle"
            nodes={chronicleNodes}
            onOpenNode={handleOpenNode}
            onInkClick={() => setChronicleStudioOpen(true)}
            onPlanetClick={() => setOpenPlanet('chronicle')}
          />
        </motion.div>

        {/* ── Layer 5: The Archive ── */}
        <motion.div
          className="absolute"
          style={{ y: archiveY, bottom: '100vh', ...(isMobile ? { left: '50%', x: '-50%' } : { right: '18%' }), zIndex: 5 }}
        >
          <motion.div style={{ opacity: archiveLabel }}>
            <p className="font-mono text-[10px] text-text-tertiary uppercase tracking-widest mb-3" style={{ textAlign: isMobile ? 'center' : 'right' }}>
              {PLANET_CONFIG.archive.name} · {PLANET_CONFIG.archive.subtitle}
            </p>
          </motion.div>
          <Planet type="archive" nodes={archiveNodes} onOpenNode={handleOpenNode} onPlanetClick={() => setOpenPlanet('archive')} />
        </motion.div>

        {/* ── Layer 4: The Dream ── */}
        <motion.div
          className="absolute"
          style={{ y: dreamY, bottom: '20vh', ...(isMobile ? { left: '50%', x: '-50%' } : { left: '15%' }), zIndex: 4 }}
        >
          <motion.div style={{ opacity: dreamLabel }}>
            <p className="font-mono text-[10px] text-text-tertiary uppercase tracking-widest mb-3">
              {PLANET_CONFIG.dream.name} · {PLANET_CONFIG.dream.subtitle}
            </p>
          </motion.div>
          <Planet type="dream" nodes={dreamNodes} onOpenNode={handleOpenNode} onArchiveClick={() => setArchiveState('password')} onPlanetClick={() => setOpenPlanet('dream')} />
          <p className="font-syne text-[11px] text-text-tertiary mt-4 italic opacity-50">
            Not yet. But soon.
          </p>
        </motion.div>

        {/* ── Layer 9: Comet ── */}
        <motion.div className="absolute inset-0 pointer-events-none" style={{ y: cometY, zIndex: 9 }}>
          <Comet title={comet?.title} />
        </motion.div>

        {/* ── Deep space footer ── */}
        <div
          className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end pb-20"
          style={{ height: '15vh', zIndex: 10 }}
        >
          <p className="font-syne text-[13px] text-text-tertiary opacity-30 mb-6">
            The universe is still expanding.
          </p>
          <a
            href="/"
            className="font-mono text-[10px] text-text-tertiary hover:text-neon transition-colors"
          >
            ← return to surface
          </a>
        </div>
      </div>

      {/* ─── Realm overlays ─── */}
      <AnimatePresence>
        {openPlanet === 'forge' && (
          <MercuryForgeScene
            key="mercury-forge"
            nodes={forgeNodes}
            initialNode={openNode?.planet === 'forge' ? openNode : null}
            onClose={handleClose}
          />
        )}
        {openPlanet === 'chronicle' && (
          <ChronicleEarthScene
            key="chronicle-earth"
            nodes={chronicleNodes}
            initialNode={openNode?.planet === 'chronicle' ? openNode : null}
            onClose={handleClose}
          />
        )}
        {openPlanet === 'archive' && (
          <SaturnArchiveScene
            key="saturn-archive"
            nodes={archiveNodes}
            initialNode={openNode?.planet === 'archive' ? openNode : null}
            onClose={handleClose}
          />
        )}
        {openPlanet === 'dream' && (
          <JupiterDreamScene
            key="jupiter-dream"
            nodes={dreamNodes}
            initialNode={openNode?.planet === 'dream' ? openNode : null}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>

      {/* ─── Chronicle Studio ─── */}
      <AnimatePresence>
        {chronicleStudioOpen && (
          <ChronicleStudio
            key="chronicle-studio"
            onClose={() => setChronicleStudioOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ─── Asset Manager ─── */}
      <AnimatePresence>
        {assetManagerState === 'password' && (
          <PasswordGate
            onSuccess={() => setAssetManagerState('open')}
            onClose={() => setAssetManagerState('closed')}
          />
        )}
        {assetManagerState === 'open' && (
          <Dashboard onClose={() => setAssetManagerState('closed')} />
        )}
      </AnimatePresence>

      {/* ─── Archive ─── */}
      <AnimatePresence>
        {archiveState === 'password' && (
          <PasswordGate
            envKey={process.env.NEXT_PUBLIC_ARCHIVE_KEY ?? process.env.NEXT_PUBLIC_ASSET_MANAGER_KEY}
            onSuccess={() => setArchiveState('open')}
            onClose={() => setArchiveState('closed')}
          />
        )}
        {archiveState === 'open' && (
          <ArchiveStudio onClose={() => setArchiveState('closed')} />
        )}
      </AnimatePresence>
    </>
  )
}
