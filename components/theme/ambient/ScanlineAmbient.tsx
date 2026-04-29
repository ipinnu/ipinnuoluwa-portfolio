import type { AmbientProps } from '../AmbientLayer'

export default function ScanlineAmbient({ mode }: AmbientProps) {
  if (mode === 'light') return null

  return (
    <div
      style={{
        position:        'absolute',
        inset:           0,
        backgroundImage: `repeating-linear-gradient(
          transparent 0px,
          transparent 1px,
          rgba(255,255,255,0.015) 1px,
          rgba(255,255,255,0.015) 2px
        )`,
        backgroundSize:  '100% 2px',
        pointerEvents:   'none',
      }}
    />
  )
}
