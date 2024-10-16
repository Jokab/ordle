import classNames from "classnames";
import { MouseEventHandler, useState, useEffect } from "react";
import { Guess, LetterState, Letter } from "./types";

interface KeyboardProps {
    guesses: Guess[];
    letterClick: MouseEventHandler<HTMLSpanElement> | undefined;
    enterClick: MouseEventHandler<HTMLDivElement> | undefined;
    backspaceClick: MouseEventHandler<HTMLDivElement> | undefined;
}

export default function({guesses, letterClick, enterClick, backspaceClick}: KeyboardProps) {
    const [usedKeys, setUsedKeys] = useState((["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "Å",
      "A", "S", "D", "F", "G", "H", "J", "K", "L", "Ö", "Ä",
      "Z", "X", "C", "V", "B", "N", "M"]).map((letter: string) => ({letter, state: LetterState.NONE}) as Letter))
  
    useEffect(() => {
      const guessedLetters = guesses
        .map((guess: Guess) => guess.letters)
        .reduce((a: Letter[], b: Letter[]) => a.concat(b, []))
  
      const newKeys = usedKeys.slice();
      newKeys.forEach(x => {
        const matchingGuess = guessedLetters.filter(y => x.letter === y.letter)
        if (matchingGuess && matchingGuess.length > 0) {
          x.state = matchingGuess[0].state;
        }
      });
      setUsedKeys(usedKeys);
    }, [setUsedKeys, guesses, usedKeys]);
  
    const drawLetters = (keys: Letter[], startIndex: number, endIndex: number) => {
      const elems = []
      for (let i = startIndex; i < endIndex; i++) {
        const cellClass = (letter: Letter | undefined) => classNames({
          'text-3xl text-center truncate w-9 border-2 border-zinc-500 rounded-md bg-zinc-300': true,
          'bg-green-400': letter?.state === LetterState.CORRECT,
          'bg-gray-500': letter?.state === LetterState.WRONG,
          'bg-yellow-300': letter?.state === LetterState.WRONG_POSITION
        });
        elems.push(<span className={cellClass(keys[i])} key={i} onClick={letterClick}>{keys[i].letter}</span>)
      }
      return elems;
    }
    return (
      <div className="flex items-center justify-center flex-col w-96">
        <div className="flex mt-2 items-center justify-between w-96">
          {drawLetters(usedKeys, 0, 11)}
        </div>
        <div className="flex mt-2 items-center justify-between w-96">
          {drawLetters(usedKeys, 11, 22)}
        </div>
        <div className="flex mt-2 items-center justify-between w-96">
          <div className="border-2 border-zinc-500 rounded-md font-medium text-2xl  p-1 bg-zinc-300" onClick={enterClick}>Enter</div>
          <div className="flex items-center justify-between w-56">
            {drawLetters(usedKeys, 22, 29)}
          </div>
          <div className="border-2 border-zinc-500 rounded-md font-medium text-2xl p-1 bg-zinc-300" onClick={backspaceClick}>Radera</div>
        </div>
      </div>
    )
  }