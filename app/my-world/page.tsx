import type { Metadata } from 'next'
import { getCelestialNodes, getActiveComet } from '@/lib/celestial'
import SpaceCanvas from '@/components/my-world/SpaceCanvas'

export const metadata: Metadata = {
  title: 'My World — Ipinnuoluwa',
  description: 'A living solar system of projects, thoughts, papers, and dreams.',
}

export default async function MyWorldPage() {
  const [nodes, comet] = await Promise.all([
    getCelestialNodes(),
    getActiveComet(),
  ])

  return (
    <main style={{ backgroundColor: '#0A0A0A' }}>
      <SpaceCanvas nodes={nodes} comet={comet} />
    </main>
  )
}
