import WeatherWidget from './WeatherWidget'
import ManagerMessage from './ManagerMessage'
import { getManagerMessage } from '../data/managerTemplates'
import { getCriminal } from '../data/criminals'

export default function DestinationModal({ country, onClose }) {
  if (!country) return null

  const message = getManagerMessage(country)
  const criminal = getCriminal(country)

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        overflowY: 'auto',
        padding: '24px 0',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'rgba(255,255,255,0.07)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '24px',
          padding: '40px 48px',
          minWidth: '420px',
          maxWidth: '560px',
          width: '90vw',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          color: '#fff',
        }}
      >
        {/* Badge */}
        <span style={{
          background: 'rgba(42,82,152,0.5)',
          border: '1px solid rgba(42,82,152,0.8)',
          borderRadius: '99px',
          padding: '4px 16px',
          fontSize: '12px',
          fontWeight: '600',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          color: '#93c5fd',
        }}>
          Destination du jour
        </span>

        {/* Drapeau */}
        <img
          src={`https://flagcdn.com/w160/${country.iso2.toLowerCase()}.png`}
          alt={`Drapeau ${country.name}`}
          style={{ width: '120px', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}
        />

        {/* Nom du pays */}
        <h2 style={{ fontSize: '32px', fontWeight: '700', margin: 0, letterSpacing: '-0.5px', textAlign: 'center' }}>
          {country.name}
        </h2>

        {/* Capitale */}
        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>
          🏛️ {country.capital}
        </p>

        <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)' }} />

        <WeatherWidget capital={country.capital} />

        <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)' }} />

        {/* Criminel le plus connu */}
        <div style={{ width: '100%', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.25)', borderRadius: '12px', padding: '16px 20px' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(248,113,113,0.8)', marginBottom: '8px' }}>
            ☠️ Criminel le plus (co)nnu
          </div>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#fca5a5', marginBottom: '4px' }}>
            {criminal.name}
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', lineHeight: '1.5' }}>
            {criminal.crime}
          </div>
          {criminal.years !== '—' && (
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '6px' }}>
              {criminal.years}
            </div>
          )}
        </div>

        <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)' }} />

        <ManagerMessage text={message} />

        <button
          onClick={onClose}
          style={{
            marginTop: '8px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '10px',
            padding: '10px 28px',
            color: '#fff',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          Fermer
        </button>
      </div>
    </div>
  )
}
