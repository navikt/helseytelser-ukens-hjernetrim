// Tune the background here — applies to all dark screens
const BG_IMAGE   = './assets/photocopy-v4.jpg'
const BG_OPACITY = 0.8
const BG_FILTER  = 'sepia(10%) brightness(0.4)'

export default function Bg() {
  return (
    <div
      className="absolute inset-0 bg-cover bg-center pointer-events-none"
      style={{
        backgroundImage: `url(${BG_IMAGE})`,
        opacity: BG_OPACITY,
        filter: BG_FILTER,
      }}
    />
  )
}
