'use client'

interface BreadcrumbProps {
  trail: { label: string; onClick: () => void }[]
}

export default function Breadcrumb({ trail }: BreadcrumbProps) {
  return (
    <div
      className="fixed z-10 font-mono text-[11px] flex items-center gap-1"
      style={{ top: 80, left: 24, color: '#444440' }}
    >
      {trail.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <span>→</span>}
          <button
            onClick={crumb.onClick}
            className="hover:text-text-secondary transition-colors"
          >
            {crumb.label}
          </button>
        </span>
      ))}
    </div>
  )
}
