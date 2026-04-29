'use client'

import { useEffect } from 'react'

export function GlassFilter() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const light  = document.getElementById('glass-key-light')
      const fill   = document.getElementById('glass-fill-light')
      const soft   = document.getElementById('glass-soft-key')
      if (light) { light.setAttribute('x', String(e.clientX)); light.setAttribute('y', String(e.clientY)) }
      if (soft)  { soft.setAttribute('x',  String(e.clientX)); soft.setAttribute('y',  String(e.clientY)) }
      if (fill)  {
        fill.setAttribute('x', String(window.innerWidth  - e.clientX * 0.3))
        fill.setAttribute('y', String(window.innerHeight - e.clientY * 0.3))
      }
    }
    window.addEventListener('mousemove', handler, { passive: true })
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  return (
    <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
      <defs>
        {/* Full liquid glass — hover state */}
        <filter id="liquid-glass" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.012" numOctaves="3" seed="4" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" xChannelSelector="R" yChannelSelector="G" result="displaced" />
          <feSpecularLighting in="noise" surfaceScale="4" specularConstant="0.9" specularExponent="140" result="key-specular">
            <fePointLight id="glass-key-light" x="300" y="100" z="400" />
          </feSpecularLighting>
          <feSpecularLighting in="noise" surfaceScale="2" specularConstant="0.4" specularExponent="60" result="fill-specular">
            <fePointLight id="glass-fill-light" x="700" y="600" z="250" />
          </feSpecularLighting>
          <feBlend in="fill-specular" in2="key-specular" mode="screen" result="combined-specular" />
          <feBlend in="displaced" in2="combined-specular" mode="screen" result="lit" />
          <feComposite in="lit" in2="SourceGraphic" operator="in" />
        </filter>

        {/* Soft glass — rest state */}
        <filter id="liquid-glass-soft" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="4" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" result="displaced" />
          <feSpecularLighting in="noise" surfaceScale="2" specularConstant="0.5" specularExponent="80" result="specular">
            <fePointLight id="glass-soft-key" x="300" y="100" z="350" />
          </feSpecularLighting>
          <feBlend in="displaced" in2="specular" mode="screen" result="lit" />
          <feComposite in="lit" in2="SourceGraphic" operator="in" />
        </filter>

        {/* Rim light */}
        <filter id="rim-light" x="-5%" y="-5%" width="110%" height="110%">
          <feSpecularLighting in="SourceGraphic" surfaceScale="1" specularConstant="0.6" specularExponent="200" result="rim">
            <fePointLight id="glass-rim-light" x="400" y="-100" z="100" />
          </feSpecularLighting>
          <feComposite in="rim" in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
    </svg>
  )
}
