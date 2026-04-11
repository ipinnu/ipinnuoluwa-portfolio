'use client'

interface CometProps {
  title?: string
  onCometClick?: () => void
}

export default function Comet({ title, onCometClick }: CometProps) {
  return (
    <div
      className="comet"
      onClick={onCometClick}
      style={{ cursor: onCometClick ? 'pointer' : 'default', zIndex: 9 }}
      title={title}
    >
      {/* Tail gradient */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to right, transparent, rgba(245,245,240,0.15), rgba(245,245,240,0.5))',
        borderRadius: 2,
      }} />
    </div>
  )
}
