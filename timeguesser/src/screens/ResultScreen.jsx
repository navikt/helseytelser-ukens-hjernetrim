import { useCallback } from 'react'
import { GoogleMap, Marker, Polyline } from '@react-google-maps/api'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import Bg from '../bg'

const MAP_OPTIONS = {
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  zoomControl: false,
  gestureHandling: 'none',
}

export default function ResultScreen({ round, guess, yearScore, locationScore, distanceKm, onNext, isLastRound }) {
  const yearDiff = Math.abs(guess.year - round.year)
  const actual = { lat: round.lat, lng: round.lng }
  const guessed = { lat: guess.lat, lng: guess.lng }

  const onMapLoad = useCallback((map) => {
    const bounds = new window.google.maps.LatLngBounds()
    bounds.extend(actual)
    bounds.extend(guessed)
    map.fitBounds(bounds, 60)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="relative flex h-screen bg-stone-950 text-white overflow-hidden">
      <Bg />

      {/* Left column: info header + map + distance */}
      <div className="relative w-[55%] flex flex-col flex-shrink-0 border-r border-stone-800">

        {/* Years off — prominent */}
        <div className="px-10 pt-30 pb-5 border-b border-stone-800">
          {/* add link from url here */}
          <p className="text-stone-300 text-sm font-medium mb-2 underline">
            Kilde: <a href={round.url} target="_blank" rel="noopener noreferrer" className="text-stone-300 underline">DigitaltMuseum</a>
          </p>
          <p className="text-stone-300 text-2xl font-medium mb-2">{round.description}</p>
          <div className="flex items-baseline gap-3">
            <span className="mr-1 font-bold px-3 py-2 rounded text-4xl tracking-wide" style={{ backgroundColor: "#c57927" }}>
              {round.year}
            </span>
            <span className="text-3xl font-bold text-white">
              {yearDiff === 0
                ? 'Eksakt år!'
                : `Du var ${yearDiff} år unna`}
            </span>
            
          </div>
        </div>

        {/* Map — fixed height, not full */}
        <div className="h-200 flex-shrink-0">
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            zoom={3}
            center={actual}
            options={MAP_OPTIONS}
            onLoad={onMapLoad}
          >
            <Marker
              position={actual}
              label={{ text: '✓', color: 'white', fontWeight: 'bold', fontSize: '14px' }}
            />
            <Marker
              position={guessed}
              icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' }}
            />
            <Polyline
              path={[actual, guessed]}
              options={{ strokeColor: '#a8a29e', strokeWeight: 2, strokeOpacity: 0.9 }}
            />
          </GoogleMap>
        </div>

        {/* Distance off — prominent */}
        <div className="px-10 py-2 border-t border-stone-800 flex-1 flex flex-col pt-6">
          
          <p className="text-3xl font-bold text-white">
            Ditt gjett var <span style={{ color: "#e98e2d" }}>{Math.round(distanceKm).toLocaleString()} km</span>  fra riktig sted
          </p>
        </div>
      </div>

      {/* Right column: photo + scores */}
      <div className="relative w-[45%] flex flex-col min-w-0">

        {/* Photo — zoomable/pannable */}
        <div className="relative flex-1 bg-black overflow-hidden min-h-0">
          <Bg />
          <TransformWrapper minScale={1} maxScale={8} centerOnInit>
            <TransformComponent
              wrapperStyle={{ width: '100%', height: '100%' }}
              contentStyle={{ width: '100%', height: '100%' }}
            >
              <img
                src={round.imagePath}
                alt="answer"
                className="w-full h-full object-contain select-none"
                draggable={false}
              />
            </TransformComponent>
          </TransformWrapper>
        </div>

        {/* Poengfordeling */}
        <div className="bg-stone-900 border-t border-stone-800 p-4 flex-shrink-0">
          <div className="flex items-center gap-px mb-4 rounded-lg overflow-hidden border border-stone-700">
            <div className="flex-1 text-center py-3 bg-stone-800">
              <div className="text-xs text-stone-400 uppercase tracking-widest mb-1">År</div>
              <div className="text-3xl font-bold text-white">{yearScore.toLocaleString()}</div>
              <div className="text-xs text-stone-500">/ 3000</div>
            </div>
            <div className="w-px self-stretch bg-stone-700" />
            <div className="flex-1 text-center py-3 bg-stone-800">
              <div className="text-xs text-stone-400 uppercase tracking-widest mb-1">Sted</div>
              <div className="text-3xl font-bold text-white">{locationScore.toLocaleString()}</div>
              <div className="text-xs text-stone-500">/ 2000</div>
            </div>
            <div className="w-px self-stretch bg-stone-700" />
            <div className="flex-1 text-center py-3 bg-stone-700">
              <div className="text-xs text-stone-300 uppercase tracking-widest mb-1">Totalt</div>
              <div className="text-3xl font-bold text-white">
                {(yearScore + locationScore).toLocaleString()}
              </div>
              <div className="text-xs text-stone-400">/ 5000</div>
            </div>
          </div>
          <button
            onClick={onNext}
            className="w-full bg-stone-700 hover:bg-stone-600 text-white font-semibold py-2.5 rounded-lg transition"
          >
            {isLastRound ? 'Se sluttresultat →' : 'Neste runde →'}
          </button>
        </div>
      </div>
    </div>
  )
}
