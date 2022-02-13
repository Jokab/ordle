import logo from './logo.svg';
import './App.css';

import React, { FunctionComponent, useEffect, useState } from 'react';


const Grid: FunctionComponent<{word: string; guesses: string[]}> = ({word = "", guesses = []}) => {
  return (
    <table className="Grid">
      <tbody>
        {
          [Array(6).fill(0).map((_, i:number) => <Row guess={guesses.slice(i*5, i*5+5)} key={i}/>)]
        }
      </tbody>
    </table>
  );
}

const Row: FunctionComponent<{guess: string[]}> = ({guess = []}) => {
  return (
    <tr>
      {
        [Array(5).fill(0).map((_, i: number) => <Cell letter={guess[i]} key={i}/>)]
      }
    </tr>
  );
}

const Cell: FunctionComponent<{letter: string}> = ({letter = ""}) => {
  return (
      <td className="Cell">{letter}</td>
  );
}


const App: FunctionComponent<{}> = () => {
  const [guesses, setGuesses] = useState<string[]>([] as string[])
  
  useEffect(() => {
    const handleKeydown = (event: any) => {
      if (event.keyCode >= 65 && event.keyCode <= 90) {
        const updatedGuess = guesses.slice();
        updatedGuess.push(event.key.toUpperCase());
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
