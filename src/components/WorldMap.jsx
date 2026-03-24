import { useState } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

const COLORS = {
  background: '#0f0f1a',
  country: '#1e3a5f',
  border: '#2a5298',
  hover: '#2e6ab0',
  button: '#2a5298',
  buttonHover: '#3a73c5',
}

export default function WorldMap({ onLaunch }) {
  const [hoveredGeo, setHoveredGeo] = useState(null)

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', background: COLORS.background, overflow: 'hidden' }}>
      <ComposableMap
        projectionConfig={{ scale: 160, center: [0, 10] }}
        style={{ width: '100%', height: '100%' }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onMouseEnter={() => setHoveredGeo(geo.rsmKey)}
                onMouseLeave={() => setHoveredGeo(null)}
                style={{
                  default: {
                    fill: COLORS.country,
                    stroke: COLORS.border,
                    strokeWidth: 0.5,
                    outline: 'none',
                  },
                  hover: {
                    fill: COLORS.hover,
                    stroke: COLORS.border,
                    strokeWidth: 0.7,
                    outline: 'none',
                    cursor: 'pointer',
                  },
                  pressed: {
                    fill: COLORS.hover,
                    outline: 'none',
                  },
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>

      <div style={{
        position: 'absolute',
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
      }}>
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
            transition: 'background 0.2s, transform 0.1s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = COLORS.buttonHover}
          onMouseLeave={e => e.currentTarget.style.background = COLORS.button}
          onMouseDown={e => e.currentTarget.style.transform = 'translateX(-50%) scale(0.97)'}
          onMouseUp={e => e.currentTarget.style.transform = 'translateX(-50%) scale(1)'}
        >
          🎯 Lancer la fléchette
        </button>
      </div>
    </div>
  )
}
