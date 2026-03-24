import { useState } from 'react'
import WorldMap from './components/WorldMap'
import DestinationModal from './components/DestinationModal'
import DartAnimation from './components/DartAnimation'
import { COUNTRIES } from './data/countries'

function App() {
  const [destination, setDestination] = useState(null)
  const [animating, setAnimating] = useState(false)
  const [soundEnabled] = useState(true)

  function handleLaunch() {
    if (animating) return
    setAnimating(true)
  }

  function handleAnimationComplete() {
    const random = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)]
    setAnimating(false)
    setDestination(random)
  }

  return (
    <>
      <WorldMap onLaunch={handleLaunch} />
      {animating && (
        <DartAnimation
          onComplete={handleAnimationComplete}
          soundEnabled={soundEnabled}
        />
      )}
      <DestinationModal country={destination} onClose={() => setDestination(null)} />
    </>
  )
}

export default App
