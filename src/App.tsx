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
  const cellClass = (locked: boolean, correct: boolean) => classNames({
    Cell: true,
    'Cell-guessed': locked && !correct,
    'Cell-correct': correct
  })
  return (
    <tr>
      {
        [Array(5).fill(0).map((_, i: number) => 
          <td className={cellClass(!!guess?.locked, !!guess?.correct)} key={i}>
              {guess?.word ? guess.word[i] : undefined}
          </td>)
        ]
      }
    </tr>
  );
}

type Guess = {
  word: string;
  locked: boolean;
  correct: boolean;
}

const guessesInitialState: Guess[] = [
  {word: "", locked: false, correct: false},
  {word: "", locked: false, correct: false},
  {word: "", locked: false, correct: false},
  {word: "", locked: false, correct: false},
  {word: "", locked: false, correct: false},
  {word: "", locked: false, correct: false}
]

const word = "JAKOB";

const App: FunctionComponent<{}> = () => {
  const [guesses, setGuesses] = useState<Guess[]>(guessesInitialState)
  const [currentRow, setCurrentRow] = useState(0);

  useEffect(() => {
    const handleKeydown = (event: any) => {
      if (event.keyCode === 13 && guesses[currentRow].word.length === 5) {
        const updatedGuess = guesses.slice();
        if (updatedGuess[currentRow].word === word) {
          updatedGuess[currentRow].correct = true;
        }

        updatedGuess[currentRow].locked = true;
        setGuesses(updatedGuess)
        
        setCurrentRow(currentRow + 1);
      } else if (event.keyCode >= 65 && event.keyCode <= 90 && guesses[currentRow].word.length < 5) {
        const updatedGuess = guesses.slice();
        updatedGuess[currentRow].word += event.key.toUpperCase();
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
      <Grid word={word} guesses={guesses}/>
    </div>
  );
}

export default App;
