"use client";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { CircularButton } from "~/components/circular-button";
import {
  colors,
  getColor,
  getCommonColors,
  getTotalMistakes,
  regenerateWordPool,
  validateGuess,
} from "~/lib/game";
import { GameOptions, gameOptionsSchema } from "~/lib/game-options";
import { alphabetical, hasSameElements, range, toSwapped } from "~/lib/utils";
import { FinishedCategory } from "./play/finished-category";
import { ShareModal } from "./play/share-modal";
import { WordTile } from "./play/word-tile";
import { examples } from "~/lib/examples";

/* eslint-disable react-hooks/exhaustive-deps */

export default function Page() {
  const params = useSearchParams();
  const [mistakesAnimateRef] = useAutoAnimate();
  const [poolAnimateRef, setPoolAnimated] = useAutoAnimate();

  const [gameOptions, setGameOptions] = useState<GameOptions | undefined>();
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [wordPool, setWordPool] = useState<string[]>([]);
  const [guesses, setGuesses] = useState<string[][]>([]);
  const [revealAnswers, setRevealAnswers] = useState(false);
  const [bouncingWord, setBouncingWord] = useState<string | null>(null);
  const [shakingWords, setShakingWords] = useState<string[]>([]);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  

  useEffect(() => {
    // if (!params.has("options")) return;

    try {
      // const decoded = JSON.parse(atob(params.get("options")!));
      // const options = gameOptionsSchema.parse(decoded);
      // console.info("setting game options from URL", options);

      const options = examples[0];

      for (let i = 0; i < 4; i++) {
        options.words[i].sort(alphabetical);
      }

      console.info("setting game options from URL", options);

      setGameOptions(options);
      setWordPool(regenerateWordPool(options, guesses));
    } catch {
      console.error("could not parse game options from URL");
    }
  }, []);

  // derived state - must be calculated before hooks
  const totalMistakes = gameOptions ? getTotalMistakes(gameOptions, guesses) : 0;
  const remainingMistakes = 4 - totalMistakes;
  const wonGame = wordPool.length === 0;
  const lostGame = remainingMistakes === 0;
  const submitDisabled =
    selectedWords.length !== 4 ||
    guesses.some((guess) => hasSameElements(guess, selectedWords));

  // Handle revealing answers after losing
  useEffect(() => {
    if (lostGame && !revealAnswers) {
      const timer = setTimeout(() => {
        setRevealAnswers(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [lostGame, revealAnswers]);

  // Generate emoji results from guesses
  const generateEmojiResults = () => {
    const colorEmojis = ['🟪', '🟦', '🟩', '🟨'];
    return guesses.map((guess) => {
      return guess.map((word) => {
        const colorIndex = getColor(gameOptions!, word);
        return colorEmojis[colorIndex];
      }).join('');
    }).join('\n');
  };

  const resultsText = `Team: ${teamName || '---'}\n${generateEmojiResults()}\nKoblinger (uke 8)`;

  // ensure that gameOptions won't be undefined
  if (gameOptions === undefined) {
    return <main></main>;
  }

  return (
    <main className="flex flex-col gap-4">
      <div>
        <Toaster
          containerStyle={{
            position: "relative",
            inset: 0,
            flexShrink: 0,
          }}
          toastOptions={{
            duration: 3000,
            className:
              "!shrink-0 !rounded-md !bg-stone-900 !p-2 !text-stone-50 !shadow-md",
          }}
        />

        {/* <h2>
          <span className="text-2xl font-semibold">
            {gameOptions.title.toUpperCase()}
          </span>{" "}
          by {gameOptions.author.toUpperCase()}
        </h2> */}

        {/* <p className="text-stone-500">
          <Link
            href={`/new?options=${params.get("options")}`}
            className="underline"
          >
            remix this game
          </Link>{" "}
          or{" "}
          <Link href="/new" className="underline">
            create your own
          </Link>
        </p> */}
      </div>

      <div className="flex flex-col gap-2 sm:gap-4">
        {/* print out finished categories */}
        {guesses.map((guess) =>
          validateGuess(gameOptions, guess) ? (
            <FinishedCategory
              name={gameOptions.names[getColor(gameOptions, guess[0])]}
              words={gameOptions.words[getColor(gameOptions, guess[0])]}
              color={colors[getColor(gameOptions, guess[0])]}
              key={getColor(gameOptions, guess[0])}
            />
          ) : undefined,
        )}

        {/* Reveal remaining answers after losing */}
        {lostGame && revealAnswers && (
          <>
            {range(4).map((i) => {
              const categoryWords = gameOptions.words[i];
              const isSolved = guesses.some((guess) => 
                validateGuess(gameOptions, guess) && 
                getColor(gameOptions, guess[0]) === i
              );
              
              if (isSolved) return null;
              
              return (
                <FinishedCategory
                  key={i}
                  name={gameOptions.names[i]}
                  words={categoryWords}
                  color={colors[i]}
                />
              );
            })}
          </>
        )}

        {/* grid from the word pool */}
        {wordPool.length > 0 && !(lostGame && revealAnswers) && (
          <div className="grid grid-cols-4 gap-2 sm:gap-4" ref={poolAnimateRef}>
            {wordPool.map((word) => (
              <WordTile
                key={word}
                selected={selectedWords.includes(word)}
                bouncing={bouncingWord === word}
                shaking={shakingWords.includes(word)}
                onClick={() => {
                  if (selectedWords.includes(word)) {
                    setSelectedWords(selectedWords.filter((w) => w !== word));
                  } else if (selectedWords.length < 4) {
                    setSelectedWords([...selectedWords, word]);
                  }
                }}
              >
                {word}
              </WordTile>
            ))}
          </div>
        )}
      </div>

      {/* display the mistakes that the user has left */}
      <div
        className="flex items-center gap-2 place-self-center sm:place-self-auto"
        ref={mistakesAnimateRef}
      >
        <p>Gjenværende feil:</p>
        {range(remainingMistakes).map((_, i) => (
          <span className="h-4 w-4 rounded-full bg-stone-600" key={i}></span>
        ))}
      </div>

      {!wonGame && !lostGame ? (
        <div className="flex flex-wrap gap-4 place-self-center sm:place-self-auto">
          <CircularButton
            onClick={() =>
              setWordPool(regenerateWordPool(gameOptions, guesses))
            }
          >
            Stokk om
          </CircularButton>

          <CircularButton
            disabled={selectedWords.length === 0}
            onClick={() => setSelectedWords([])}
          >
            Nullstill valg
          </CircularButton>

          <CircularButton
            variant={submitDisabled ? undefined : "filled"}
            disabled={submitDisabled}
            onClick={async () => {
              // First, animate each selected word bouncing sequentially
              const wordsInOrder = wordPool.filter(word => selectedWords.includes(word));
              
              for (const word of wordsInOrder) {
                setBouncingWord(word);
                await new Promise((res) => setTimeout(res, 300));
              }
              
              setBouncingWord(null);
              
              const result = validateGuess(gameOptions, selectedWords);

              if (result === true) {
                // sort so the words swap to the right order
                const sortedSelected = selectedWords.toSorted(alphabetical);

                // swap guesses into the beginning of the pool
                for (let a = 0; a < 4; a++) {
                  setWordPool((pool) => {
                    const b = pool.indexOf(sortedSelected[a]);
                    return toSwapped(pool, a, b);
                  });
                }

                setPoolAnimated(true);

                await new Promise((res) => setTimeout(res, 500));
                setGuesses([...guesses, selectedWords]);
                setSelectedWords([]);
                setWordPool((pool) =>
                  pool.filter((word) => !selectedWords.includes(word)),
                );

                setPoolAnimated(false);
              } else {
                // Incorrect guess - shake all 4 words together
                setShakingWords(selectedWords);
                
                // Wait for shake animation to complete
                await new Promise((res) => setTimeout(res, 500));
                setShakingWords([]);
                
                if (getCommonColors(gameOptions, selectedWords) === 3) {
                  toast("En unna...");
                }

                setGuesses([...guesses, selectedWords]);
                setSelectedWords([]);
              }
            }}
          >
            Send inn
          </CircularButton>
        </div>
      ) : wonGame ? (
        <div className="flex flex-col gap-4 items-center">
          <p>Du vant, gratulerer! Del i #helseytelser-ukens-hjernetrim</p>
          <CircularButton variant="filled" onClick={() => setIsShareModalOpen(true)}>
            Del dine resultat
          </CircularButton>
        </div>
      ) : lostGame ? (
        <div className="flex flex-col gap-4 items-center">
          <p>{!revealAnswers ? "Lykke til neste gang. Del i #helseytelser-ukens-hjernetrim (kanskje for vanskelig?)" : ""}</p>
          {revealAnswers && (
            <CircularButton variant="filled" onClick={() => setIsShareModalOpen(true)}>
              Del dine resultat
            </CircularButton>
          )}
        </div>
      ) : null}

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        teamName={teamName}
        onTeamNameChange={setTeamName}
        resultsText={resultsText}
      />
    </main>
  );
}
