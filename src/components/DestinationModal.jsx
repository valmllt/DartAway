import WeatherWidget from './WeatherWidget'
import Riddle from './FunFact'
import ManagerMessage from './ManagerMessage'
import { getRiddle } from '../data/riddles'
import { getManagerMessage } from '../data/managerTemplates'

export default function DestinationModal({ country, onClose }) {
  if (!country) return null

  const riddle = getRiddle(country)
  const message = getManagerMessage(country)

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

        <Riddle text={riddle} />
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
