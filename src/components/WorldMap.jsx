import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { ComposableMap, Geographies, Geography, useMapContext } from 'react-simple-maps'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'
const SVG_W = 800
const SVG_H = 600

const COLORS = {
  background: '#0f0f1a',
  country: '#1e3a5f',
  border: '#2a5298',
  hover: '#2e6ab0',
  button: '#2a5298',
  buttonHover: '#3a73c5',
}

// Accès au contexte de projection (doit être enfant de ComposableMap)
function ProjectionCapture({ projRef }) {
  const { projection } = useMapContext()
  projRef.current = projection
  return null
}

const WorldMap = forwardRef(function WorldMap({ onLaunch }, ref) {
  const containerRef = useRef(null)
  const projRef = useRef(null)
  const [zoom, setZoom] = useState({ active: false, x: 50, y: 50, scale: 1 })
  const [shake, setShake] = useState(false)

  useImperativeHandle(ref, () => ({
    // Convertit [lng, lat] en coordonnées écran
    getScreenCoords(lng, lat) {
      if (!projRef.current || !containerRef.current) return null
      const svgCoords = projRef.current([lng, lat])
      if (!svgCoords) return null
      const [svgX, svgY] = svgCoords
      const rect = containerRef.current.getBoundingClientRect()
      return {
        x: rect.left + (svgX / SVG_W) * rect.width,
        y: rect.top + (svgY / SVG_H) * rect.height,
      }
    },
    // Zoom centré sur un point écran
    zoomTo(screenX, screenY, scale) {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      setZoom({
        active: true,
        x: screenX - rect.left,
        y: screenY - rect.top,
        scale,
      })
    },
    // Retour zoom normal + vibration d'impact
    triggerImpact(screenX, screenY, scale) {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      setShake(true)
      setTimeout(() => setShake(false), 500)
      setTimeout(() => {
        setZoom({
          active: true,
          x: screenX - rect.left,
          y: screenY - rect.top,
          scale,
        })
      }, 300)
    },
    resetZoom() {
      setZoom({ active: false, x: 50, y: 50, scale: 1 })
    },
  }))

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', width: '100%', height: '100vh', background: COLORS.background, overflow: 'hidden' }}
    >
      {/* Conteneur zoomable */}
      <div
        style={{
          width: '100%',
          height: '100%',
          transform: zoom.active ? `scale(${zoom.scale})` : 'scale(1)',
          transformOrigin: `${zoom.x}px ${zoom.y}px`,
          transition: zoom.active ? 'transform 0.6s ease-out' : 'transform 0.5s ease-in-out',
          animation: shake ? 'mapShake 0.4s ease-out' : 'none',
        }}
      >
        <ComposableMap
          projectionConfig={{ scale: 160, center: [0, 10] }}
          style={{ width: '100%', height: '100%' }}
        >
          <ProjectionCapture projRef={projRef} />
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: { fill: COLORS.country, stroke: COLORS.border, strokeWidth: 0.5, outline: 'none' },
                    hover:   { fill: COLORS.hover,    stroke: COLORS.border, strokeWidth: 0.7, outline: 'none', cursor: 'pointer' },
                    pressed: { fill: COLORS.hover, outline: 'none' },
                  }}
                />
              ))
            }
          </Geographies>
        </ComposableMap>
      </div>

      {/* Titre */}
      <div style={{ position: 'absolute', top: '32px', left: '50%', transform: 'translateX(-50%)', zIndex: 5, pointerEvents: 'none', textAlign: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '42px', fontWeight: '800', color: '#fff', letterSpacing: '-1px', textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>
          🎯 DartAway
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: '14px', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.5px' }}>
          Lance la fusée. Découvre ta destination.
        </p>
      </div>

      {/* Bouton — en dehors du zoom */}
      <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
        <button
          onClick={onLaunch}
          style={{
            background: COLORS.button,
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            padding: '16px 40px',
            fontSize: '18px',
            fontWeight: '600',
            cursor: 'pointer',
            letterSpacing: '0.5px',
            boxShadow: '0 4px 24px rgba(42,82,152,0.5)',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = COLORS.buttonHover}
          onMouseLeave={e => e.currentTarget.style.background = COLORS.button}
        >
          🚀 Lancer la fusée
        </button>
      </div>

      <style>{`
        @keyframes mapShake {
          0%   { transform: scale(1) translate(0,0); }
          20%  { transform: scale(1) translate(-4px,-3px); }
          40%  { transform: scale(1) translate(4px,3px); }
          60%  { transform: scale(1) translate(-3px,-2px); }
          80%  { transform: scale(1) translate(3px,2px); }
          100% { transform: scale(1) translate(0,0); }
        }
      `}</style>
    </div>
  )
})

export default WorldMap
