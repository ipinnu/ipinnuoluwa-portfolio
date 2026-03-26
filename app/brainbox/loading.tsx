import EntrySphere from '@/components/three/EntrySphere'

export default function BrainboxLoading() {
  return (
    <div
      className="flex flex-col items-center justify-center brainbox-grid"
      style={{ height: 'calc(100vh - 64px)' }}
    >
      <EntrySphere />
      <p
        className="font-syne text-sm mt-6 animate-fade-in"
        style={{ color: '#888884', animationDelay: '0.5s', opacity: 0, animationFillMode: 'forwards' }}
      >
        Welcome to my world.
      </p>
    </div>
  )
}
