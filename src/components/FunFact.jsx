import { useState } from 'react'

export default function Riddle({ text }) {
  const [revealed, setRevealed] = useState(false)

  return (
    <div style={styles.container}>
      <p style={styles.label}>🎲 Devinette</p>
      <p style={styles.text}>{text}</p>
      <button onClick={() => setRevealed(r => !r)} style={styles.btn}>
        {revealed ? '🙈 Masquer la réponse' : '💡 Révéler la réponse'}
      </button>
      {revealed && (
        <p style={styles.answer}>👆 C'est le pays que tu viens de tirer !</p>
      )}
    </div>
  )
}

const styles = {
  container: {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '14px',
    padding: '16px 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  label: {
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.35)',
    margin: 0,
  },
  text: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: 'rgba(255,255,255,0.8)',
    fontStyle: 'italic',
    margin: 0,
  },
  btn: {
    alignSelf: 'flex-start',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '8px',
    color: 'rgba(255,255,255,0.7)',
    fontSize: '12px',
    padding: '5px 12px',
    cursor: 'pointer',
  },
  answer: {
    fontSize: '13px',
    color: '#86efac',
    margin: 0,
    fontWeight: '600',
  },
}
