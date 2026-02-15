"use client";

import { useState } from "react";

export function HelpButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-stone-400 text-stone-600 hover:border-stone-600 hover:text-stone-900 transition-colors"
        aria-label="How to play"
      >
        <span className="text-xl font-semibold">?</span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between">
              <h2 className="text-xl font-bold">Hvordan gå frem</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-stone-400 hover:text-stone-900 transition-colors"
                aria-label="Close"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div className="space-y-4 text-sm text-stone-700">
              <p>
                Finn grupper av fire ord som deler noe til felles.
              </p>

              <div>
                <h3 className="font-semibold text-stone-900 mb-2">
                  Slik spiller du:
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Velg fire ord du tror tilhører samme kategori</li>
                  <li>Trykk &ldquo;Send inn&rdquo; for å sjekke svaret ditt</li>
                  <li>Du har kun fire forsøk!</li>
                  <li>Noen kategorier kan være enklere den andre</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-stone-900 mb-2">
                  Tips:
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Se etter åpenbare forbindelser først</li>
                  <li>Ord kan passe i flere kategorier - finn den rette!</li>
                  <li>Hvis du står fast, prøv å tenke utenfor boksen</li>
                </ul>
              </div>

              <p className="text-xs text-stone-500">
                Lykke til!
              </p>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="mt-6 w-full rounded-lg bg-stone-900 py-2 px-4 text-white hover:bg-stone-800 transition-colors"
            >
              Lukk
            </button>
          </div>
        </div>
      )}
    </>
  );
}
