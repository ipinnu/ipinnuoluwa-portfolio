import type { Metadata } from 'next'
import { getBrainboxNodes } from '@/lib/brainbox'
import BrainboxCanvas from '@/components/brainbox/BrainboxCanvas'
import BrainboxMobile from '@/components/brainbox/BrainboxMobile'

export const metadata: Metadata = {
  title: 'My World',
  description: "Ipinnuoluwa's mind as a navigable space. Thoughts, projects, papers and wonders.",
}

export default async function BrainboxPage() {
  const nodes = await getBrainboxNodes()

  return (
    <>
      {/* Desktop canvas */}
      <div className="hidden md:block">
        <BrainboxCanvas nodes={nodes} />
      </div>
      {/* Mobile feed */}
      <div className="md:hidden">
        <BrainboxMobile nodes={nodes} />
      </div>
    </>
  )
}
