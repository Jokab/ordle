import classNames from "classnames";
import { MouseEventHandler, useState, useEffect } from "react";
import { Guess, LetterState, Letter } from "./types";

interface KeyboardProps {
    guesses: Guess[];
    letterClick: MouseEventHandler | undefined;
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

  const drawKeys = (keys: Letter[], startIndex: number, endIndex: number) => {
    const elems = []
    for (let i = startIndex; i < endIndex; i++) {
      elems.push(<Key letter={keys[i]} key={i} onClick={letterClick} />)
    }
    return elems;
  }

  const keyRow = "flex items-center justify-between gap-1 w-full";
  const actionButton = "bg-accent rounded-md font-bold text-xl p-1 cursor-pointer hover:opacity-85";

  return (
    <div className="grid w-full max-w-[360px] max-h-[420px] gap-2 mt-2">
      <div className={keyRow}>
        {drawKeys(usedKeys, 0, 11)}
      </div>
      <div className={keyRow}>
        {drawKeys(usedKeys, 11, 22)}
      </div>
      <div className={keyRow}>
        <div className={actionButton} onClick={enterClick}>Enter</div>
        <div className={keyRow}>
          {drawKeys(usedKeys, 22, 29)}
        </div>
        <div className={actionButton} onClick={backspaceClick}>Radera</div>
      </div>
    </div>
  )
}

interface KeyProps {
  letter: Letter;
  onClick: MouseEventHandler<HTMLSpanElement> | undefined;
}

const Key = ({letter, onClick}: KeyProps) => {
  const cellClass = (letter: Letter) => classNames({
    'text-xl text-center font-bold w-full rounded-md p-0.5 cursor-pointer': true,
    'bg-accent hover:opacity-85': letter.state === LetterState.NONE,
    'bg-green': letter.state === LetterState.CORRECT,
    'bg-grayish': letter.state === LetterState.WRONG,
    'bg-yellow': letter.state === LetterState.WRONG_POSITION
  });

  return (
    <span onClick={onClick} className={cellClass(letter)}>{letter.letter}</span>
  )
}