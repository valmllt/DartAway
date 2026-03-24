import { useEffect, useState } from 'react'
import { WEATHER_CODES } from '../data/weatherCodes'

const DAYS_FR = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']

function getWeather(code) {
  return WEATHER_CODES[code] ?? { emoji: '🌡️', label: 'Inconnu' }
}

async function fetchWeather(capital) {
  // 1. Géocodage
  const geoRes = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(capital)}&count=1&language=fr`
  )
  const geoData = await geoRes.json()
  if (!geoData.results?.length) throw new Error(`Ville introuvable : ${capital}`)

  const { latitude, longitude } = geoData.results[0]

  // 2. Prévisions 14 jours
  const wxRes = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=14`
  )
  const wxData = await wxRes.json()
  if (!wxData.daily) throw new Error('Données météo indisponibles')

  return wxData.daily.time.map((date, i) => ({
    date,
    code: wxData.daily.weather_code[i],
    max: Math.round(wxData.daily.temperature_2m_max[i]),
    min: Math.round(wxData.daily.temperature_2m_min[i]),
  }))
}

export default function WeatherWidget({ capital }) {
  const [days, setDays] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setDays(null)
    setError(null)
    setLoading(true)

    fetchWeather(capital)
      .then(setDays)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [capital])

  if (loading) return (
    <div style={styles.container}>
      <div style={styles.loadingRow}>
        {[...Array(7)].map((_, i) => (
          <div key={i} style={styles.skeleton} />
        ))}
      </div>
    </div>
  )

  if (error) return (
    <div style={styles.container}>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textAlign: 'center' }}>
        ⚠️ {error}
      </p>
    </div>
  )

  return (
    <div style={styles.container}>
      <p style={styles.label}>Météo · 14 jours</p>
      <div style={styles.grid}>
        {days.map((day) => {
          const d = new Date(day.date)
          const wx = getWeather(day.code)
          const isToday = day === days[0]
          return (
            <div key={day.date} style={{ ...styles.card, ...(isToday ? styles.cardToday : {}) }}>
              <span style={styles.dayName}>
                {isToday ? 'Auj.' : DAYS_FR[d.getDay()]}
              </span>
              <span style={styles.emoji} title={wx.label}>{wx.emoji}</span>
              <span style={styles.tempMax}>{day.max}°</span>
              <span style={styles.tempMin}>{day.min}°</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const styles = {
  container: {
    width: '100%',
    marginTop: '4px',
  },
  label: {
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.35)',
    marginBottom: '10px',
    textAlign: 'center',
  },
  grid: {
    display: 'flex',
    gap: '6px',
    overflowX: 'auto',
    paddingBottom: '4px',
    scrollbarWidth: 'none',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '8px 6px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    minWidth: '46px',
    flex: '0 0 auto',
  },
  cardToday: {
    background: 'rgba(42,82,152,0.3)',
    border: '1px solid rgba(42,82,152,0.6)',
  },
  dayName: {
    fontSize: '10px',
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
  },
  emoji: {
    fontSize: '18px',
    lineHeight: 1,
  },
  tempMax: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#fff',
  },
  tempMin: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.4)',
  },
  loadingRow: {
    display: 'flex',
    gap: '6px',
  },
  skeleton: {
    minWidth: '46px',
    height: '80px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.06)',
    flex: '0 0 auto',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
}
