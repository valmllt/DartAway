import { useEffect, useRef, useState } from 'react'

// ─── SVG Fusée (orientée vers la droite pour offsetRotate:auto) ─────────────
function RocketSVG() {
  return (
    <svg width="64" height="28" viewBox="0 0 64 28" style={{ display: 'block' }}>
      <defs>
        <radialGradient id="rflame" cx="50%" cy="30%" r="60%">
          <stop offset="0%"   stopColor="#fff7aa" />
          <stop offset="40%"  stopColor="#fb923c" />
          <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="rbody" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#e2e8f0" />
          <stop offset="50%"  stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
        <linearGradient id="rnose" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#f1f5f9" />
        </linearGradient>
      </defs>

      {/* Flamme (à gauche = arrière de la fusée) */}
      <ellipse cx="6" cy="14" rx="10" ry="7" fill="url(#rflame)" opacity="0.9" />

      {/* Corps principal */}
      <rect x="14" y="9" width="30" height="10" rx="5" fill="url(#rbody)" />

      {/* Nez (à droite = avant) */}
      <polygon points="44,9 64,14 44,19" fill="url(#rnose)" />

      {/* Hublot */}
      <circle cx="30" cy="14" r="4" fill="#0ea5e9" opacity="0.8" />
      <circle cx="30" cy="14" r="2.5" fill="#7dd3fc" opacity="0.6" />

      {/* Ailerons */}
      <polygon points="14,9 8,2 18,9"  fill="#64748b" />
      <polygon points="14,19 8,26 18,19" fill="#64748b" />
    </svg>
  )
}

// ─── Sons ────────────────────────────────────────────────────────────────────
function playWhoosh() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const dur = 1.0
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
    const src = ctx.createBufferSource(); src.buffer = buf
    const flt = ctx.createBiquadFilter(); flt.type = 'bandpass'
    flt.frequency.setValueAtTime(120, ctx.currentTime)
    flt.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.8)
    flt.Q.value = 1
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.15)
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + dur)
    src.connect(flt); flt.connect(gain); gain.connect(ctx.destination)
    src.start()
  } catch (_) {}
}

function playImpact() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator(); osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(200, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.3)
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.6, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
    osc.connect(gain); gain.connect(ctx.destination)
    osc.start(); osc.stop(ctx.currentTime + 0.4)
  } catch (_) {}
}

// ─── Flash d'impact ──────────────────────────────────────────────────────────
function ImpactFlash({ x, y, visible }) {
  return (
    <div
      style={{
        position: 'fixed',
        left: x - 60,
        top: y - 60,
        width: 120,
        height: 120,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,220,100,0.9) 0%, rgba(255,140,0,0.5) 40%, transparent 70%)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.2)',
        transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
        pointerEvents: 'none',
        zIndex: 60,
      }}
    />
  )
}

// ─── Composant principal ─────────────────────────────────────────────────────
export default function RocketAnimation({ targetX, targetY, onImpact, onComplete, soundEnabled = true }) {
  const rocketRef = useRef(null)
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    const rocket = rocketRef.current
    if (!rocket) return

    const W = window.innerWidth
    const H = window.innerHeight

    const startX = W / 2 + (Math.random() - 0.5) * 200
    const startY = H - 30

    const endX = targetX ?? W / 2
    const endY = targetY ?? H * 0.38

    // Point de contrôle : arc haut au-dessus de la trajectoire
    const cpX = (startX + endX) / 2 + (Math.random() - 0.5) * 80
    const cpY = Math.min(startY, endY) - H * 0.25

    const pathData = `M ${startX} ${startY} Q ${cpX} ${cpY} ${endX} ${endY}`

    rocket.style.offsetPath = `path('${pathData}')`
    rocket.style.offsetDistance = '0%'
    // auto 90deg : nose du SVG (pointant à droite) s'aligne avec la tangente
    rocket.style.offsetRotate = 'auto'
    rocket.style.opacity = '1'

    let cancelled = false

    async function run() {
      // ── Phase 1 : Décollage (0.3s) ─────────────────────────────────────────
      const takeoff = rocket.animate([
        { offsetDistance: '0%', transform: 'scale(1) translate(0,0)', filter: 'none' },
        { offsetDistance: '0%', transform: 'scale(1.05) translate(-3px,3px)', filter: 'none' },
        { offsetDistance: '0%', transform: 'scale(1.05) translate(3px,-3px)', filter: 'none' },
        { offsetDistance: '0%', transform: 'scale(1.1) translate(0,6px)', filter: 'none' },
      ], { duration: 300, easing: 'ease-in-out', fill: 'forwards' })
      await takeoff.finished
      if (cancelled) return

      if (soundEnabled) playWhoosh()

      // ── Phase 2 : Vol (0.9s) ───────────────────────────────────────────────
      const flight = rocket.animate([
        { offsetDistance: '0%',   transform: 'scale(1.1)',  filter: 'blur(0px)' },
        { offsetDistance: '30%',  transform: 'scale(1)',    filter: 'blur(2px)' },
        { offsetDistance: '65%',  transform: 'scale(0.95)', filter: 'blur(3px)' },
        { offsetDistance: '90%',  transform: 'scale(0.9)',  filter: 'blur(1.5px)' },
        { offsetDistance: '100%', transform: 'scale(1)',    filter: 'blur(0px)' },
      ], { duration: 900, easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)', fill: 'forwards' })
      await flight.finished
      if (cancelled) return

      // ── Phase 3 : Impact (0.4s) ────────────────────────────────────────────
      if (soundEnabled) playImpact()
      setFlash(true)
      setTimeout(() => setFlash(false), 400)
      onImpact?.()

      const impact = rocket.animate([
        { transform: 'scale(1) translate(0,0)' },
        { transform: 'scale(1.2) translate(-5px,-4px)' },
        { transform: 'scale(0.9) translate(5px,4px)' },
        { transform: 'scale(1.1) translate(-3px,-2px)' },
        { transform: 'scale(1) translate(0,0)', opacity: 0 },
      ], { duration: 400, easing: 'ease-out', fill: 'forwards' })
      await impact.finished
      if (cancelled) return

      onComplete?.()
    }

    run()
    return () => { cancelled = true }
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50 }}>
      <div ref={rocketRef} style={{ position: 'absolute', opacity: 0, transformOrigin: 'center center' }}>
        <RocketSVG />
      </div>
      <ImpactFlash x={targetX ?? window.innerWidth / 2} y={targetY ?? window.innerHeight * 0.38} visible={flash} />
    </div>
  )
}
