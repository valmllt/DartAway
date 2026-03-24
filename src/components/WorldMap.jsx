import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { ComposableMap, Geographies, Geography, useMapContext } from 'react-simple-maps'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'
const SVG_W = 800
const SVG_H = 600

const COLORS = {
  background: '#03000f',
  country: '#0a0a2e',
  countryAlt: '#07071f',
  border: '#00ffe1',
  hover: '#ff00aa',
  button: 'transparent',
  buttonHover: 'transparent',
  buttonBorder: '#00ffe1',
  buttonBorderHover: '#ff00aa',
  buttonText: '#00ffe1',
  buttonTextHover: '#ff00aa',
  buttonGlow: 'rgba(0,255,225,0.35)',
  buttonGlowHover: 'rgba(255,0,170,0.45)',
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
      {/* Scanlines overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,255,225,0.03) 0px, rgba(0,255,225,0.03) 1px, transparent 1px, transparent 4px)',
      }} />

      {/* Vignette corners */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,10,0.85) 100%)',
      }} />

      {/* Title */}
      <div style={{
        position: 'absolute', top: '28px', left: '50%', transform: 'translateX(-50%)',
        zIndex: 5, pointerEvents: 'none', textAlign: 'center',
      }}>
        <div style={{
          fontFamily: "'Courier New', monospace",
          fontSize: '13px',
          letterSpacing: '6px',
          color: '#00ffe1',
          textTransform: 'uppercase',
          textShadow: '0 0 8px #00ffe1, 0 0 24px rgba(0,255,225,0.4)',
          opacity: 0.7,
        }}>
          // DARTAWAY — TARGET SELECTION //
        </div>
      </div>

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
              geographies.map((geo, i) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: {
                      fill: i % 2 === 0 ? COLORS.country : COLORS.countryAlt,
                      stroke: COLORS.border,
                      strokeWidth: 0.4,
                      outline: 'none',
                      filter: 'drop-shadow(0 0 2px rgba(0,255,225,0.15))',
                    },
                    hover: {
                      fill: '#1a0030',
                      stroke: COLORS.hover,
                      strokeWidth: 0.8,
                      outline: 'none',
                      cursor: 'pointer',
                      filter: 'drop-shadow(0 0 6px rgba(255,0,170,0.6))',
                    },
                    pressed: { fill: '#2a0040', outline: 'none' },
                  }}
                />
              ))
            }
          </Geographies>
        </ComposableMap>
      </div>

      {/* Bouton — en dehors du zoom */}
      <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
        <button
          className="cyber-btn"
          onClick={onLaunch}
          style={{
            background: 'transparent',
            color: COLORS.buttonText,
            border: `1.5px solid ${COLORS.buttonBorder}`,
            borderRadius: '4px',
            padding: '14px 44px',
            fontSize: '15px',
            fontFamily: "'Courier New', monospace",
            fontWeight: '700',
            cursor: 'pointer',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            textShadow: `0 0 8px ${COLORS.buttonBorder}`,
            boxShadow: `0 0 18px ${COLORS.buttonGlow}, inset 0 0 18px rgba(0,255,225,0.05)`,
            transition: 'all 0.2s ease',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={e => {
            const b = e.currentTarget
            b.style.color = COLORS.buttonTextHover
            b.style.borderColor = COLORS.buttonBorderHover
            b.style.textShadow = `0 0 10px ${COLORS.hover}`
            b.style.boxShadow = `0 0 28px ${COLORS.buttonGlowHover}, inset 0 0 20px rgba(255,0,170,0.08)`
          }}
          onMouseLeave={e => {
            const b = e.currentTarget
            b.style.color = COLORS.buttonText
            b.style.borderColor = COLORS.buttonBorder
            b.style.textShadow = `0 0 8px ${COLORS.buttonBorder}`
            b.style.boxShadow = `0 0 18px ${COLORS.buttonGlow}, inset 0 0 18px rgba(0,255,225,0.05)`
          }}
        >
          ⬡ LANCER LA FUSÉE ⬡
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
