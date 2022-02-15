import './App.css';
import classNames from 'classnames';
import wordlist from './wordlist';

import React, { FunctionComponent, useEffect, useState } from 'react';


const Grid: FunctionComponent<{word: string; guesses: Guess[]}> = ({guesses = []}) => {
  return (
    <table className="w-80 h-80">
      <tbody className="border-2">
        {
          [Array(6).fill(0).map((_, i:number) => 
            <Row guess={guesses[i]} key={i}/>)
          ]
        }
      </tbody>
    </table>
  );
}

const Row: FunctionComponent<{guess: Guess}> = ({guess = undefined}) => {
  const cellClass = (letter: Letter | undefined) => classNames({
    'bg-gray-400 text-2xl w-10 h-10 text-center truncate border-2': true,
    'bg-green-400': letter?.state === LetterState.CORRECT,
    'bg-gray-600': letter?.state === LetterState.WRONG,
    'bg-yellow-400': letter?.state === LetterState.WRONG_POSITION
  });
  return (
    <tr>
      {
        [Array(5).fill(0).map((_, i: number) => 
          <td className={cellClass(guess?.letters[i])} key={i}>
              {guess?.letters && guess?.letters.length > i ? guess.letters[i].letter : undefined}
          </td>)
        ]
      }
    </tr>
  );
}

const GameOver: FunctionComponent<{gameState: GameState | undefined}> = ({gameState = undefined}) => {
  if (gameState === GameState.WIN) {
    return <div className="mb-10 text-2xl">Du vann!</div>
  } else if (gameState === GameState.LOSS) {
      return <div className="mb-10 text-2xl">Det gick inte denna gången! :-(</div>
  } else {
    return <></>
  }
}

const UsedLetters: FunctionComponent<{guesses: Guess[]}> = ({guesses = []}) => {
  const [keys, setKeys] = useState((["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "Å",
    "A", "S", "D", "F", "G", "H", "J", "K", "L", "Ö", "Ä",
    "Z", "X", "C", "V", "B", "N", "M"]).map((letter: string) => ({letter, state: LetterState.NONE}) as Letter))

  useEffect(() => {
    const guessedLetters = guesses
    .map((guess: Guess) => guess.letters)
    .reduce((a: Letter[], b: Letter[]) => a.concat(b, []))

    const newKeys = keys.slice();
    newKeys.forEach(x => {
      const matchingGuess = guessedLetters.filter(y => x.letter === y.letter)
      if (matchingGuess && matchingGuess.length > 0) {
        x.state = matchingGuess[0].state;
      }
    });
    setKeys(keys);
  });

  const drawLetters = (keys: Letter[], startIndex: number, endIndex: number) => {
    const elems = []
    for (let i = startIndex; i < endIndex; i++) {
      const cellClass = (letter: Letter | undefined) => classNames({
        'bg-gray-400 text-2xl text-center truncate w-5': true,
        'bg-green-400': letter?.state === LetterState.CORRECT,
        'bg-gray-600': letter?.state === LetterState.WRONG,
        'bg-yellow-300': letter?.state === LetterState.WRONG_POSITION
      });
      elems.push(<span className={cellClass(keys[i])} key={i}>{keys[i].letter}</span>)
    }
    return elems;
  }
  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex mt-2 items-center justify-between bg-gray-400 w-80">
        {drawLetters(keys, 0, 11)}
      </div>
      <div className="flex mt-2 items-center justify-between bg-gray-400 w-80">
        {drawLetters(keys, 11, 22)}
      </div>
      <div className="flex mt-2 items-center justify-between bg-gray-400 w-48">
        {drawLetters(keys, 22, 29)}
      </div>
    </div>
  )
}

enum LetterState {
  CORRECT,
  WRONG_POSITION,
  WRONG,
  NONE
}

type Letter = {
  letter: string;
  state: LetterState;
}

type Guess = {
  letters: Letter[];
  locked: boolean;
  correct: boolean;
}

const guessesInitialState: Guess[] = [
  {letters: [] as Letter[], locked: false, correct: false},
  {letters: [] as Letter[], locked: false, correct: false},
  {letters: [] as Letter[], locked: false, correct: false},
  {letters: [] as Letter[], locked: false, correct: false},
  {letters: [] as Letter[], locked: false, correct: false},
  {letters: [] as Letter[], locked: false, correct: false}
]

enum GameState {
  WIN,
  LOSS,
  PENDING
}


const App: FunctionComponent<{}> = () => {
  const [guesses, setGuesses] = useState<Guess[]>(guessesInitialState)
  const [currentRow, setCurrentRow] = useState(0);
  const [gameState, setGameState] = useState(GameState.PENDING);

  const goalWord = wordlist[Math.floor(Math.random() * wordlist.length)].toUpperCase();

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (gameState === GameState.WIN || gameState === GameState.LOSS) {
        return;
      }
      if (event.key === 'Enter' && guesses[currentRow].letters.length === 5) {
        // User has locked in a guess
        const updatedGuess = guesses.slice();
        const currentWord = updatedGuess[currentRow].letters.map(x => x.letter).reduce((a: string,b:string) => a + b)
        if (!wordlist.includes(currentWord)) {
          return;
        }

        const markedLetters: string[] = []
        // First, make a pass over all correct letters since these have priority of being marked
        updatedGuess[currentRow].letters.forEach((letter: Letter, index: number) => {
          if (letter.letter === goalWord[index]) {
            letter.state = LetterState.CORRECT;
            markedLetters.push(letter.letter);
          }
        });

        // Second, make a pass over non processed letters since these have lower priority
        updatedGuess[currentRow].letters
          .filter(letter => letter.state !== LetterState.CORRECT)
          .forEach((letter: Letter) => {
            if (goalWord.includes(letter.letter)) {
              if (markedLetters.filter(x => x === letter.letter).length < goalWord.split('').filter(x => x === letter.letter).length) {
                // Only want to mark letter as wrong position if there are more letters in the goal word than the ones
                // that have been placed correctly
                letter.state = LetterState.WRONG_POSITION;
              } else {
                letter.state = LetterState.WRONG
              }
            } else if (!goalWord.includes(letter.letter)) {
              letter.state = LetterState.WRONG
            } else {
              letter.state = LetterState.NONE;
            }
            markedLetters.push(letter.letter);
          }
        );

        updatedGuess[currentRow].locked = true;
        setGuesses(updatedGuess)
        if (currentWord === goalWord) {
          updatedGuess[currentRow].correct = true;
          setGameState(GameState.WIN);
        } else if (currentWord !== goalWord && currentRow === 5) {
          setGameState(GameState.LOSS);
        } else {
          setCurrentRow(currentRow + 1);
        }
      } else if ((event.code >= 'KeyA' && event.code <= 'KeyZ' && guesses[currentRow].letters.length < 5) ||
          event.code === 'BracketLeft' || event.code === 'Quote' || event.code === 'Semicolon') {
        let letter = "";
        // Swedish special letters are really weirdly represented in event codes
        switch (event.code) {
          case 'BracketLeft':
            letter = "Å";
            break;
          case 'Quote':
            letter = 'Ä';
            break;
          case 'Semicolon':
            letter = 'Ö';
            break;
          default:
            letter = event.key.toUpperCase();
        }
        const updatedGuess = guesses.slice();
        updatedGuess[currentRow].letters.push({
          letter: letter,
          state: LetterState.NONE
        });
        setGuesses(updatedGuess)
      } else if (event.code === "Backspace") {
        const updatedGuess = guesses.slice();
        updatedGuess[currentRow].letters.pop();
        setGuesses(updatedGuess)  
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown)
    }
  })


  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <GameOver gameState={gameState}/>
      <Grid word={goalWord} guesses={guesses}/>
      <UsedLetters guesses={guesses}/>
    </div>
  );
}

export default App;
