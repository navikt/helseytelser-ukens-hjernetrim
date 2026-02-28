import Bg from '../bg'

export default function StartScreen({ onStart }) {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-stone-950 text-white gap-6 overflow-hidden">
      <Bg />
      <p className="relative text-xl text-stone-400 font-bold tracking-tight">Helseytelser ukens hjernetrim</p>
      <h1 className="relative text-6xl font-bold tracking-tight">Tidsgjetter</h1>
      <p className="relative text-stone-400 text-lg">Gjett årstall og sted for 5 bilder i Norge</p>
      <p className="relative text-stone-400 text-lg">Zoom inn på bildene for å se små detaljer</p>
      <button
        onClick={onStart}
        className="relative mt-4 bg-stone-700 hover:bg-stone-600 text-white font-semibold px-10 py-3 rounded-lg text-lg transition"
      >
        Start hjernetrim
      </button>
    </div>
  )
}
