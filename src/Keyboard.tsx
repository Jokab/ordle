import classNames from "classnames";
import { MouseEventHandler, useState, useEffect } from "react";
import { Guess, LetterState, Letter } from "./types";

interface KeyboardProps {
    guesses: Guess[];
    letterClick: MouseEventHandler<HTMLSpanElement> | undefined;
    enterClick: MouseEventHandler<HTMLDivElement> | undefined;
    backspaceClick: MouseEventHandler<HTMLDivElement> | undefined;
}

export default ({guesses, letterClick, enterClick, backspaceClick}: KeyboardProps) => {
  const [usedKeys, setUsedKeys] = useState(([
    "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "Å",
    "A", "S", "D", "F", "G", "H", "J", "K", "L", "Ö", "Ä",
              "Z", "X", "C", "V", "B", "N", "M"
    ]).map((letter) => ({letter, state: LetterState.NONE})))

  useEffect(() => {
    const guessedLetters = guesses
      .map((guess: Guess) => guess.letters)
      .reduce((a: Letter[], b: Letter[]) => a.concat(b, []))

    const newKeys = [...usedKeys];
    newKeys.forEach(x => {
      const matchingGuess = guessedLetters.filter(y => x.letter === y.letter)
      if (matchingGuess && matchingGuess.length > 0) {
        x.state = matchingGuess[0].state;
      }
    });
    setUsedKeys(newKeys);
  }, [guesses]);

  const drawLetters = (keys: Letter[], startIndex: number, endIndex: number) => {
    const elems = []
    for (let i = startIndex; i < endIndex; i++) {
      const cellClass = (letter: Letter) => classNames({
        'text-xl text-center font-bold w-full rounded-md p-0.5': true,
        'bg-gray-400': letter.state === LetterState.NONE,
        'bg-lime-600': letter.state === LetterState.CORRECT,
        'bg-gray-600': letter.state === LetterState.WRONG,
        'bg-yellow-500': letter.state === LetterState.WRONG_POSITION
      });
      elems.push(<span className={cellClass(keys[i])} key={i} onClick={letterClick}>{keys[i].letter}</span>)
    }
    return elems;
  }
  return (
    <div className="grid w-full max-w-[360px] max-h-[420px] gap-2 mt-2">
      <div className="flex items-center justify-between gap-1">
        {drawLetters(usedKeys, 0, 11)}
      </div>
      <div className="flex items-center justify-between gap-1">
        {drawLetters(usedKeys, 11, 22)}
      </div>
      <div className="flex items-center justify-between gap-1">
        <div className="bg-gray-400 rounded-md font-bold text-xl p-1" onClick={enterClick}>Enter</div>
        <div className="flex items-center justify-between gap-1 w-full">
          {drawLetters(usedKeys, 22, 29)}
        </div>
        <div className="bg-gray-400 rounded-md font-bold text-xl p-1" onClick={backspaceClick}>Radera</div>
      </div>
    </div>
  )
}