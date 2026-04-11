export default function Loading() {
  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: '#0A0A0A',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 20, zIndex: 100,
      }}
    >
      {/* CSS 3D sun pulse */}
      <div style={{ position: 'relative', width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          position: 'absolute', width: 100, height: 100, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232,220,100,0.1) 0%, transparent 70%)',
          animation: 'planet-pulse 2s ease-in-out infinite',
        }} />
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #FFF4C2 0%, #F5D840 30%, #C8920A 70%, #7A4D00 100%)',
          boxShadow: '0 0 20px rgba(232,200,60,0.3), inset -4px -4px 10px rgba(0,0,0,0.5)',
        }} />
      </div>
      <p style={{
        fontFamily: 'var(--font-syne)', fontSize: 13,
        color: '#444440', letterSpacing: '0.06em',
      }}>
        entering...
      </p>
    </div>
  )
}
