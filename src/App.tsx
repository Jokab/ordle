import './App.css';
import classNames from 'classnames';

import React, { FunctionComponent, useEffect, useState } from 'react';


const Grid: FunctionComponent<{word: string; guesses: Guess[]}> = ({guesses = []}) => {
  return (
    <table className="Grid">
      <tbody>
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
    Cell: true,
    'Cell-correct': letter?.state === LetterState.CORRECT,
    'Cell-wrong': letter?.state === LetterState.WRONG,
    'Cell-wrong-pos': letter?.state === LetterState.WRONG_POSITION
  })
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

const GameOver: FunctionComponent<{gameOver: boolean}> = ({gameOver = false}) => {
  if (gameOver) {
    return <div>Du vann!</div>
  } else {
    return <></>
  }
}

const UsedLetters: FunctionComponent<{guesses: Guess[]}> = ({guesses = []}) => {
  const guessedLetters = guesses
    .map((guess: Guess) => guess.letters)
    .reduce((a: Letter[], b: Letter[]) => a.concat(b, []))
  const keys =
    (["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "Å",
    "A", "S", "D", "F", "G", "H", "J", "K", "L", "Ö", "Ä",
    "Z", "X", "C", "V", "B", "N", "M"]).map((letter: string) => ({letter, state: LetterState.NONE}) as Letter);

  keys.forEach(x => {
    const matchingGuess = guessedLetters.filter(y => x.letter === y.letter)
    if (matchingGuess && matchingGuess.length > 0) {
      x.state = matchingGuess[0].state;
    }
  })

  const drawLetters = (keys: Letter[]) => {
    const elems = []
    for (let i = 0; i < keys.length; i++) {
      const cellClass = (letter: Letter | undefined) => classNames({
        'Cell-correct': letter?.state === LetterState.CORRECT,
        'Cell-wrong': letter?.state === LetterState.WRONG,
        'Cell-wrong-pos': letter?.state === LetterState.WRONG_POSITION
      })
      elems.push(<span className={cellClass(keys[i])}>{keys[i].letter}</span>)
    }
    return elems;
  }
  return (
    <div className="UsedLetters">
      {drawLetters(keys)}
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

const goalWord = "JAKOB";

const App: FunctionComponent<{}> = () => {
  const [guesses, setGuesses] = useState<Guess[]>(guessesInitialState)
  const [currentRow, setCurrentRow] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (gameOver) {
        return;
      }
      if (event.key === 'Enter' && guesses[currentRow].letters.length === 5) {
        const updatedGuess = guesses.slice();
        const currentWord = updatedGuess[currentRow].letters.map(x => x.letter).reduce((a: string,b:string) => a + b)

        updatedGuess[currentRow].letters.forEach((word: Letter, index: number) => {
          if (word.letter === goalWord[index]) {
            word.state = LetterState.CORRECT;
          } else if (goalWord.includes(word.letter)) {
            word.state = LetterState.WRONG_POSITION;
          } else if (!goalWord.includes(word.letter)) {
            word.state = LetterState.WRONG
          } else {
            word.state = LetterState.NONE;
          }
        })

        updatedGuess[currentRow].locked = true;
        setGuesses(updatedGuess)
        if (currentWord === goalWord) {
          updatedGuess[currentRow].correct = true;
          setGameOver(true);
        } else {
          setCurrentRow(currentRow + 1);
        }
      } else if (event.code >= 'KeyA' && event.code <= 'KeyZ' && guesses[currentRow].letters.length < 5) {
        const updatedGuess = guesses.slice();
        updatedGuess[currentRow].letters.push({
          letter: event.key.toUpperCase(), 
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
    <div className="App">
      <Grid word={goalWord} guesses={guesses}/>
      <GameOver gameOver={gameOver}/>
      <UsedLetters guesses={guesses}/>
    </div>
  );
}

export default App;
