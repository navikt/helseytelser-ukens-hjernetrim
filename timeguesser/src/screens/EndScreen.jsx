import { useState } from 'react'
import { roundEmoji } from '../utils/scoring'
import Bg from '../bg'

const MAX_PER_ROUND = 5000

export default function EndScreen({ results, onPlayAgain }) {
  const [name, setName] = useState('')
  const [copied, setCopied] = useState(false)

  const totalScore = results.reduce((sum, r) => sum + r.yearScore + r.locationScore, 0)
  const maxTotal = results.length * MAX_PER_ROUND

  function generateShareText() {
    const lines = results.map((r) => {
      const total = r.yearScore + r.locationScore
      return `${roundEmoji(total)}: ${total.toLocaleString()}`
    })
    const header = `Tidsgjetter - ${name || ''} `
    return [
      header,
      ...lines,
      `Totalt: ${totalScore.toLocaleString()}`,
    ].join('\n')
  }

  function handleCopy() {
    navigator.clipboard.writeText(generateShareText())
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const hasName = name.trim().length > 0

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-stone-950 text-white gap-6 px-8 overflow-hidden">
      <Bg />
      <h1 className="relative text-5xl font-bold">Bra jobbet!</h1>

      <div className="relative text-center">
        <p className="text-stone-400 text-lg mb-1">Totalt</p>
        <p className="text-7xl font-bold">{totalScore.toLocaleString()}</p>
        <p className="text-stone-500 text-lg">/ {maxTotal.toLocaleString()}</p>
      </div>

      {/* Name input (required) */}
      <div className="relative w-full max-w-sm space-y-3">
        <input
          type="text"
          placeholder="Skriv inn navn / lag"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-stone-800 border border-stone-700 text-white placeholder-stone-500 rounded-lg px-4 py-2.5 focus:outline-none focus:border-stone-500"
        />

        
        
          <>
            <textarea
              readOnly
              value={generateShareText()}
              rows={results.length + 2}
              className="w-full bg-stone-900 border border-stone-700 text-stone-300 rounded-lg px-4 py-3 text-sm font-mono resize-none focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="w-full bg-stone-700 hover:bg-stone-600 text-white font-semibold py-2.5 rounded-lg transition"
            >
              {copied ? '✓ Kopiert!' : 'Kopier'}
            </button>
            <p className="text-stone-400 text-lg text-center">
              Husk å del på{' '}
              <a
                href="https://nav-it.slack.com/archives/C0ADXDZPC6B"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#e98e2d] hover:underline"
              >
                #helseytelser-ukens-hjernetrim
              </a>
            </p>
          </>
        
      </div>

      {/* <button
        onClick={onPlayAgain}
        className="text-stone-500 hover:text-stone-300 text-sm transition underline"
      >
        Prøv igjen
      </button> */}
    </div>
  )
}
