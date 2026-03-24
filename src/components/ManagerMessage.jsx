import { useState } from 'react'

export default function ManagerMessage({ text, loading }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    if (!text) return
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <p style={styles.label}>Message manager</p>
        {!loading && text && (
          <button onClick={handleCopy} style={styles.copyBtn}>
            {copied ? '✅ Copié' : '📋 Copier'}
          </button>
        )}
      </div>
      {loading ? (
        <div style={styles.skeletonWrap}>
          <div style={{ ...styles.skeleton, width: '100%' }} />
          <div style={{ ...styles.skeleton, width: '90%' }} />
          <div style={{ ...styles.skeleton, width: '75%' }} />
          <div style={{ ...styles.skeleton, width: '50%' }} />
        </div>
      ) : (
        <p style={styles.text}>{text ?? '⚠️ Message indisponible.'}</p>
      )}
    </div>
  )
}

const styles = {
  container: {
    width: '100%',
    background: 'rgba(42,82,152,0.12)',
    border: '1px solid rgba(42,82,152,0.3)',
    borderRadius: '14px',
    padding: '16px 18px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  label: {
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    color: 'rgba(147,197,253,0.7)',
  },
  copyBtn: {
    background: 'rgba(42,82,152,0.3)',
    border: '1px solid rgba(42,82,152,0.5)',
    borderRadius: '8px',
    color: '#93c5fd',
    fontSize: '12px',
    padding: '4px 10px',
    cursor: 'pointer',
  },
  text: {
    fontSize: '14px',
    lineHeight: '1.65',
    color: 'rgba(255,255,255,0.75)',
  },
  skeletonWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  skeleton: {
    height: '14px',
    borderRadius: '6px',
    background: 'rgba(42,82,152,0.2)',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
}
