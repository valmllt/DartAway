import { useState } from 'react'
import WorldMap from './components/WorldMap'
import DestinationModal from './components/DestinationModal'
import { COUNTRIES } from './data/countries'

function App() {
  const [destination, setDestination] = useState(null)

  function handleLaunch() {
    const random = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)]
    setDestination(random)
  }

  return (
    <>
      <WorldMap onLaunch={handleLaunch} />
      <DestinationModal country={destination} onClose={() => setDestination(null)} />
    </>
  )
}

export default App
