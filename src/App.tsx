import logo from './logo.svg';
import './App.css';
import classNames from 'classnames';

import React, { FunctionComponent, useEffect, useState } from 'react';


const Grid: FunctionComponent<{word: string; guesses: Guess[]}> = ({word = undefined, guesses = []}) => {
  return (
    <table className="Grid">
      <tbody>
        {
          [Array(6).fill(0).map((_, i:number) => 
            <Row word={guesses[i]?.word} locked={guesses[i]?.locked} key={i}/>)
          ]
        }
      </tbody>
    </table>
  );
}

const Row: FunctionComponent<{word: string; locked: boolean}> = ({word = undefined, locked = false}) => {
  return (
    <tr>
      {
        [Array(5).fill(0).map((_, i: number) => 
          <Cell letter={word ? word[i] : undefined} locked={locked} key={i}/>)
        ]
      }
    </tr>
  );
}

const Cell: FunctionComponent<{letter: string | undefined; locked: boolean}> = ({letter = undefined, locked=false}) => {
  const cellClass = classNames({
    Cell: true,
    'Cell-guessed': locked
  })
  return (
      <td className={cellClass} >{letter}</td>
  );
}

type Guess = {
  word: string;
  locked: boolean;
}

const guessesInitialState: Guess[] = [
  {word: "", locked: false},
  {word: "", locked: false},
  {word: "", locked: false},
  {word: "", locked: false},
  {word: "", locked: false},
  {word: "", locked: false}
]

const App: FunctionComponent<{}> = () => {
  const [guesses, setGuesses] = useState<Guess[]>(guessesInitialState)
  const [currentRow, setCurrentRow] = useState(0);
  
  useEffect(() => {
    const handleKeydown = (event: any) => {
      if (event.keyCode === 13 && guesses[currentRow].word.length === 5) {
        const updatedGuess = guesses.slice();
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

  const word = "HEJSAN";

  return (
    <div className="App">
      <Grid word={word} guesses={guesses}/>
    </div>
  );
}



export default App;
