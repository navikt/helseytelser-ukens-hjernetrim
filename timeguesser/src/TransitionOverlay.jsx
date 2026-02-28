import { useEffect, useRef } from 'react'

const CLIPS = [
  './assets/transitions/part1.webm',
  './assets/transitions/part2.webm',
  './assets/transitions/part3.webm',
  // './assets/transitions/part4.webm',
  './assets/transitions/part5.webm',
  './assets/transitions/part6.webm',
  './assets/transitions/part7.webm',
  // './assets/transitions/part8.webm',
]

const NAVIGATE_BEFORE_END = 0.45

export default function TransitionOverlay({ onNavigate, onComplete }) {
  const videoRef = useRef(null)
  const src = useRef(CLIPS[Math.floor(Math.random() * CLIPS.length)]).current
  const onNavigateRef = useRef(onNavigate)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => { onNavigateRef.current = onNavigate }, [onNavigate])
  useEffect(() => { onCompleteRef.current = onComplete }, [onComplete])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.volume = 0.05
    video.play().catch(() => { onNavigateRef.current(); onCompleteRef.current() })

    let navigated = false

    const handleTimeUpdate = () => {
      if (!navigated && video.duration && video.currentTime >= video.duration - NAVIGATE_BEFORE_END) {
        navigated = true
        onNavigateRef.current()
      }
    }

    const handleEnded = () => {
      if (!navigated) { navigated = true; onNavigateRef.current() }
      onCompleteRef.current()
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('ended', handleEnded)
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('ended', handleEnded)
    }
  }, []) // runs once on mount — callbacks accessed via refs to avoid re-running

  return (
    <div className="fixed inset-0 z-50" style={{ pointerEvents: 'all' }}>
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover"
        style={{ filter: 'sepia(0.4) brightness(0.6)', opacity: 0.6 }}
        playsInline
      />
    </div>
  )
}
