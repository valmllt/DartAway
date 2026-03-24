import { useRef, useState } from 'react'
import WorldMap from './components/WorldMap'
import DestinationModal from './components/DestinationModal'
import RocketAnimation from './components/RocketAnimation'
import { COUNTRIES } from './data/countries'
import { getCentroid } from './data/centroids'

function App() {
  const worldMapRef = useRef(null)
  const [destination, setDestination] = useState(null)
  const [animating, setAnimating] = useState(false)
  const [rocketTarget, setRocketTarget] = useState({ x: null, y: null, country: null })

  function handleLaunch() {
    if (animating) return

    // Pick country now so rocket can fly to its exact position
    const country = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)]
    const { lng, lat, zoom } = getCentroid(country)

    const coords = worldMapRef.current?.getScreenCoords(lng, lat)
    const targetX = coords?.x ?? window.innerWidth / 2
    const targetY = coords?.y ?? window.innerHeight * 0.38

    setRocketTarget({ x: targetX, y: targetY, zoom, country })
    setAnimating(true)
  }

  function handleImpact() {
    const { x, y, zoom } = rocketTarget
    worldMapRef.current?.triggerImpact(x, y, zoom)
  }

  function handleAnimationComplete() {
    setAnimating(false)
    setDestination(rocketTarget.country)
  }

  function handleClose() {
    setDestination(null)
    worldMapRef.current?.resetZoom()
  }

  return (
    <>
      <WorldMap ref={worldMapRef} onLaunch={handleLaunch} />
      {animating && (
        <RocketAnimation
          targetX={rocketTarget.x}
          targetY={rocketTarget.y}
          onImpact={handleImpact}
          onComplete={handleAnimationComplete}
          soundEnabled={true}
        />
      )}
      <DestinationModal country={destination} onClose={handleClose} />
    </>
  )
}

export default App
