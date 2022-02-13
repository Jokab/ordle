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

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && guesses[currentRow].letters.length === 5) {
        const updatedGuess = guesses.slice();
        const currentWord = updatedGuess[currentRow].letters.map(x => x.letter).reduce((a: string,b:string) => a + b)
        if (currentWord === goalWord) {
          updatedGuess[currentRow].correct = true;
        }
        
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
        
        setCurrentRow(currentRow + 1);
      } else if (event.code >= 'KeyA' && event.code <= 'KeyZ' && guesses[currentRow].letters.length < 5) {
        const updatedGuess = guesses.slice();
        updatedGuess[currentRow].letters.push({
          letter: event.key.toUpperCase(), 
          state: LetterState.NONE
        });
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
    </div>
  );
}

export default App;
