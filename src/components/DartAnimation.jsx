import { useEffect, useRef } from 'react'

// SVG dart orienté vers la droite → offsetRotate:auto l'aligne sur la trajectoire
function DartSVG() {
  return (
    <svg width="100" height="24" viewBox="0 0 100 24" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="tip" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#f8fafc" />
        </linearGradient>
        <linearGradient id="barrel" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="40%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>
        <linearGradient id="shaft" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
      </defs>

      {/* Pointe effilée */}
      <polygon points="100,12 82,10 82,14" fill="url(#tip)" />
      {/* Pointe highlight */}
      <line x1="82" y1="11" x2="99" y2="12" stroke="#fff" strokeWidth="0.5" strokeOpacity="0.6" />

      {/* Barrel (corps doré) */}
      <rect x="58" y="9" width="24" height="6" rx="3" fill="url(#barrel)" />
      {/* Barrel striping */}
      <line x1="64" y1="9" x2="64" y2="15" stroke="#92400e" strokeWidth="0.8" strokeOpacity="0.5" />
      <line x1="68" y1="9" x2="68" y2="15" stroke="#92400e" strokeWidth="0.8" strokeOpacity="0.5" />
      <line x1="72" y1="9" x2="72" y2="15" stroke="#92400e" strokeWidth="0.8" strokeOpacity="0.5" />
      <line x1="76" y1="9" x2="76" y2="15" stroke="#92400e" strokeWidth="0.8" strokeOpacity="0.5" />

      {/* Shaft (tige fine) */}
      <rect x="22" y="11" width="36" height="2" rx="1" fill="url(#shaft)" />

      {/* Empennage haut */}
      <path d="M22,11 L2,1 L14,11 Z" fill="#dc2626" />
      <path d="M22,11 L2,1 L14,11 Z" fill="none" stroke="#991b1b" strokeWidth="0.5" />
      {/* Empennage bas */}
      <path d="M22,13 L2,23 L14,13 Z" fill="#dc2626" />
      <path d="M22,13 L2,23 L14,13 Z" fill="none" stroke="#991b1b" strokeWidth="0.5" />
      {/* Empennage centre */}
      <path d="M22,12 L4,12" stroke="#b91c1c" strokeWidth="1" />
    </svg>
  )
}

// ─── Son whoosh ──────────────────────────────────────────────────────────────
function playWhoosh() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const dur = 0.85
    const bufSize = Math.floor(ctx.sampleRate * dur)
    const buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1

    const src = ctx.createBufferSource()
    src.buffer = buffer

    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(150, ctx.currentTime)
    filter.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.7)
    filter.Q.value = 1.2

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 0.1)
    gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.7)
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + dur)

    src.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    src.start()
  } catch (_) {}
}

// ─── Son impact ──────────────────────────────────────────────────────────────
function playImpact() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()

    const osc = ctx.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(180, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(28, ctx.currentTime + 0.25)

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.55, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.3)
  } catch (_) {}
}

// ─── Composant principal ─────────────────────────────────────────────────────
export default function DartAnimation({ onComplete, soundEnabled = true }) {
  const dartRef = useRef(null)

  useEffect(() => {
    const dart = dartRef.current
    if (!dart) return

    const W = window.innerWidth
    const H = window.innerHeight

    // Position de départ : bas de l'écran, légèrement aléatoire
    const startX = W / 2 + (Math.random() - 0.5) * 180
    const startY = H - 30

    // Cible : centre de la carte
    const endX = W / 2
    const endY = H * 0.38

    // Point de contrôle : arc prononcé au-dessus des deux points
    const cpX = (startX + endX) / 2 + (Math.random() - 0.5) * 60
    const cpY = H * 0.04

    const pathData = `M ${startX} ${startY} Q ${cpX} ${cpY} ${endX} ${endY}`

    dart.style.offsetPath = `path('${pathData}')`
    dart.style.offsetDistance = '0%'
    dart.style.offsetRotate = 'auto'
    dart.style.opacity = '1'

    let cancelled = false

    async function run() {
      // ── Phase 1 : Élan (0.2s) ─────────────────────────────────────────────
      const windup = dart.animate(
        [
          { offsetDistance: '0%', transform: 'scale(1) translateY(0px)', filter: 'none' },
          { offsetDistance: '0%', transform: 'scale(1.08) translateY(10px)', filter: 'none' },
        ],
        { duration: 200, easing: 'ease-in-out', fill: 'forwards' }
      )
      await windup.finished
      if (cancelled) return

      // ── Phase 2 : Vol (0.8s) ──────────────────────────────────────────────
      if (soundEnabled) playWhoosh()

      const flight = dart.animate(
        [
          { offsetDistance: '0%',   transform: 'scale(1.08) translateY(10px)', filter: 'blur(0px)' },
          { offsetDistance: '25%',  transform: 'scale(1)',                      filter: 'blur(1.5px)' },
          { offsetDistance: '60%',  transform: 'scale(0.95)',                   filter: 'blur(2.5px)' },
          { offsetDistance: '90%',  transform: 'scale(0.92)',                   filter: 'blur(1px)' },
          { offsetDistance: '100%', transform: 'scale(1)',                      filter: 'blur(0px)' },
        ],
        {
          duration: 800,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          fill: 'forwards',
        }
      )
      await flight.finished
      if (cancelled) return

      // ── Phase 3 : Impact (0.3s) ────────────────────────────────────────────
      if (soundEnabled) playImpact()

      const impact = dart.animate(
        [
          { transform: 'scale(1)    translate(0px,   0px)' },
          { transform: 'scale(1.06) translate(-4px, -3px)' },
          { transform: 'scale(0.97) translate(4px,   3px)' },
          { transform: 'scale(1.03) translate(-3px, -2px)' },
          { transform: 'scale(0.99) translate(3px,   2px)' },
          { transform: 'scale(1)    translate(0px,   0px)' },
        ],
        { duration: 300, easing: 'ease-out', fill: 'forwards' }
      )
      await impact.finished
      if (cancelled) return

      onComplete?.()
    }

    run()
    return () => { cancelled = true }
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50 }}>
      <div
        ref={dartRef}
        style={{ position: 'absolute', opacity: 0, transformOrigin: 'center center' }}
      >
        <DartSVG />
      </div>
    </div>
  )
}
