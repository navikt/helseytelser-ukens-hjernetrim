import { useState, useCallback, useEffect } from 'react'
import { GoogleMap, Marker } from '@react-google-maps/api'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import Bg from '../bg'

const MAP_CENTER = { lat: 65, lng: 13 }
const MAP_OPTIONS = {
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  zoomControlOptions: { position: 7 },
}

export default function GuessScreen({ round, roundIndex, totalRounds, totalScore, onSubmit }) {
  const [yearGuess, setYearGuess] = useState(1960)
  const [locationGuess, setLocationGuess] = useState(null)
  const [timeLeft, setTimeLeft] = useState(5  * 60)

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000)
    return () => clearInterval(interval)
  }, [])

  const isWarning = timeLeft <= 30
  const pct = (timeLeft / 300) * 100

  function formatTime(s) {
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  }

  const handleMapClick = useCallback((e) => {
    setLocationGuess({ lat: e.latLng.lat(), lng: e.latLng.lng() })
  }, [])

  const handleSubmit = () => {
    if (!locationGuess) return
    onSubmit({ year: yearGuess, lat: locationGuess.lat, lng: locationGuess.lng })
  }

  return (
    <div className="relative flex flex-col h-screen bg-stone-950 overflow-hidden">
      <div className={`warning-vignette${isWarning ? ' active' : ''}`} />
      <Bg />
      <div className="flex flex-1 min-h-0">
      {/* Bilde — zoombart/pannbart */}
      <div className="w-3/5 relative flex-shrink-0 bg-black overflow-hidden">
        <Bg />
        <TransformWrapper minScale={1} maxScale={8} centerOnInit>
          <TransformComponent
            wrapperStyle={{ width: '100%', height: '100%' }}
            contentStyle={{ width: '100%', height: '100%' }}
          >
            <img
              src={round.imagePath}
              alt="Hvor og når ble dette bildet tatt?"
              className="w-full h-full object-contain select-none"
              draggable={false}
            />
          </TransformComponent>
        </TransformWrapper>
        <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded text-lg font-medium pointer-events-none flex items-center gap-3">
          <span>Runde {roundIndex + 1} / {totalRounds}</span>
          <span className={`font-mono font-bold ${isWarning ? 'text-red-400' : 'text-stone-300'}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* Høyre panel */}
      <div className="relative w-2/5 flex flex-col min-w-0 border-l border-stone-800">
        <div className="text-right px-4 py-2 text-sm text-stone-400">
          Poeng:{' '}
          <span className="text-white font-semibold">{totalScore.toLocaleString()}</span>
        </div>

        {/* Kart — full høyde */}
        <div className="flex-1 min-h-0">
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            zoom={5}
            center={MAP_CENTER}
            options={MAP_OPTIONS}
            onClick={handleMapClick}
          >
            {locationGuess && <Marker position={locationGuess} />}
          </GoogleMap>
        </div>

        {/* Årsslider + send inn */}
        <div className="bg-stone-900 border-t border-stone-800 p-4 space-y-4 flex-shrink-0">
          <div className="flex items-center justify-between text-sm text-stone-400">
            <span>1900</span>
            <span className="text-3xl font-bold text-white">{yearGuess}</span>
            <span>2024</span>
          </div>
          <input
            type="range"
            min="1900"
            max="2024"
            value={yearGuess}
            onChange={(e) => setYearGuess(Number(e.target.value))}
            className="w-full accent-stone-400 cursor-pointer"
          />
          <button
            onClick={handleSubmit}
            disabled={!locationGuess}
            className="w-full bg-stone-700 hover:bg-stone-600 disabled:bg-stone-800 disabled:text-stone-500 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition"
          >
            {locationGuess ? 'Send inn svar' : 'Klikk på kartet for å plassere en pin'}
          </button>
        </div>
      </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full bg-stone-800 flex-shrink-0">
        <div
          className="h-full transition-[width] duration-1000 ease-linear"
          style={{ width: `${pct}%`, backgroundColor: isWarning ? '#ef4444' : '#e98e2d' }}
        />
      </div>
    </div>
  )
}
