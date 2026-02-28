import { useState, useRef } from 'react'
import { useLoadScript } from '@react-google-maps/api'
import rounds from './data/rounds.json'
import { haversineKm, calcYearScore, calcLocationScore } from './utils/scoring'
import StartScreen from './screens/StartScreen'
import GuessScreen from './screens/GuessScreen'
import ResultScreen from './screens/ResultScreen'
import EndScreen from './screens/EndScreen'
import Bg from './bg'
import TransitionOverlay from './TransitionOverlay'

export default function App() {
  const [phase, setPhase] = useState('start') // 'start' | 'guess' | 'result' | 'end'
  const [roundIndex, setRoundIndex] = useState(0)
  const [results, setResults] = useState([])
  const [lastGuess, setLastGuess] = useState(null)
  const [transitioning, setTransitioning] = useState(false)
  const [slideKey, setSlideKey] = useState(0)
  const pendingFn = useRef(null)

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: (() => {
      const s = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
      const unshifted = s.split('').map(c => {
        if (c >= 'a' && c <= 'z') return String.fromCharCode((c.charCodeAt(0) - 97 - 5 + 26) % 26 + 97)
        if (c >= 'A' && c <= 'Z') return String.fromCharCode((c.charCodeAt(0) - 65 - 5 + 26) % 26 + 65)
        return c
      }).join('')
      return atob(unshifted)
    })(),
  })

  const totalScore = results.reduce((sum, r) => sum + r.yearScore + r.locationScore, 0)
  const currentRound = rounds[roundIndex]
  const lastResult = results[results.length - 1]

  function withTransition(fn) {
    return (...args) => {
      pendingFn.current = () => fn(...args)
      setTransitioning(true)
    }
  }

  // Called during the video tail — triggers the page change + slide animation
  function handleNavigate() {
    setSlideKey((k) => k + 1)
    pendingFn.current?.()
    pendingFn.current = null
  }

  // Called when the video actually ends — removes the overlay
  function handleOverlayDone() {
    setTransitioning(false)
  }

  function handleStart() {
    setPhase('guess')
    setRoundIndex(0)
    setResults([])
    setLastGuess(null)
  }

  function handleSubmitGuess(guess) {
    const round = rounds[roundIndex]
    const distanceKm = haversineKm(guess.lat, guess.lng, round.lat, round.lng)
    const yearScore = calcYearScore(Math.abs(guess.year - round.year))
    const locationScore = calcLocationScore(distanceKm)
    setLastGuess(guess)
    setResults((prev) => [...prev, { yearScore, locationScore, distanceKm }])
    setPhase('result')
  }

  function handleNext() {
    if (roundIndex + 1 >= rounds.length) {
      setPhase('end')
    } else {
      setRoundIndex((i) => i + 1)
      setLastGuess(null)
      setPhase('guess')
    }
  }

  let screen = null

  if (phase === 'start') {
    screen = <StartScreen onStart={withTransition(handleStart)} />
  } else if (!isLoaded) {
    screen = (
      <div className="relative flex items-center justify-center min-h-screen bg-stone-950 text-white overflow-hidden">
        <Bg />
        <span className="relative">Laster kart...</span>
      </div>
    )
  } else if (phase === 'guess') {
    screen = (
      <GuessScreen
        round={currentRound}
        roundIndex={roundIndex}
        totalRounds={rounds.length}
        totalScore={totalScore}
        onSubmit={handleSubmitGuess}
      />
    )
  } else if (phase === 'result') {
    screen = (
      <ResultScreen
        round={rounds[roundIndex]}
        guess={lastGuess}
        yearScore={lastResult.yearScore}
        locationScore={lastResult.locationScore}
        distanceKm={lastResult.distanceKm}
        onNext={withTransition(handleNext)}
        isLastRound={roundIndex + 1 >= rounds.length}
      />
    )
  } else if (phase === 'end') {
    screen = <EndScreen results={results} onPlayAgain={withTransition(handleStart)} />
  }

  return (
    <>
      <div key={slideKey} className="screen-enter">
        {screen}
      </div>
      {transitioning && (
        <TransitionOverlay onNavigate={handleNavigate} onComplete={handleOverlayDone} />
      )}
    </>
  )
}
