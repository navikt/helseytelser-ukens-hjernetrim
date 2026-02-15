import { useEffect, useRef } from "react";
import { CircularButton } from "~/components/circular-button";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamName: string;
  onTeamNameChange: (name: string) => void;
  resultsText: string;
  averageGuessInterval: string;
  totalMistakes: number;
}

export function ShareModal({
  isOpen,
  onClose,
  teamName,
  onTeamNameChange,
  resultsText,
  averageGuessInterval,
  totalMistakes,
}: ShareModalProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.select();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-stone-50 rounded-lg shadow-xl max-w-md w-full p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold">Del dine resultat</h2>

        <div className="flex flex-col gap-2">
          <label htmlFor="team-name" className="font-medium">
            Team navn:
          </label>
          <input
            id="team-name"
            type="text"
            value={teamName}
            onChange={(e) => onTeamNameChange(e.target.value)}
            className="px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-900"
            placeholder="Skriv ditt teamnavn her"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="results" className="font-medium">
            Resultat:
          </label>
          <textarea
            id="results"
            ref={textareaRef}
            value={resultsText}
            readOnly
            rows={8}
            className="px-3 py-2 border border-stone-300 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 resize-none"
          />
          <div className="flex flex-col gap-1 text-sm text-stone-600">
            <p>Snitt mellom gjetting: {averageGuessInterval}</p>
            <p>Antall feil: {totalMistakes}</p>
          </div>
          <p>Husk å del i #helseytelser-ukens-hjernetrim 😊</p>
        </div>

        <div className="flex gap-3 justify-end">
          <CircularButton onClick={onClose}>Lukk</CircularButton>
          <CircularButton
            variant="filled"
            onClick={() => {
              if (textareaRef.current) {
                textareaRef.current.select();
                navigator.clipboard.writeText(resultsText);
              }
            }}
          >
            Kopier
          </CircularButton>
        </div>
       
      </div>
    </div>
  );
}
