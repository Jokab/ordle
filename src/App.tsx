import {wordlist, goalWord}  from './wordlist.ts';

import { useCallback, useEffect, useState } from 'react';
import { GameState, Guess, guessesInitialState, Letter, LetterState } from './types';
import Keyboard from './Keyboard.tsx';
import GameOver from './GameOver.tsx';
import Grid from './Grid.tsx';

const App = () => {
  const [guesses, setGuesses] = useState<Guess[]>(guessesInitialState)
  const [currentRow, setCurrentRow] = useState(0);
  const [gameState, setGameState] = useState(GameState.PENDING);

  const handleEnterKey = useCallback(() => {
    // User has locked in a guess
    const updatedGuess = [...guesses]
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
  }, [guesses]);

  const handleLetterKey = useCallback((event: KeyboardEvent) => {
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
    const updatedGuess = [...guesses];
    updatedGuess[currentRow].letters.push({
      letter: letter,
      state: LetterState.NONE
    });
    setGuesses(updatedGuess)
  }, [guesses]);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (gameState === GameState.WIN || gameState === GameState.LOSS) {
        return;
      }
      if (event.key === 'Enter' && guesses[currentRow].letters.length === 5) {
        handleEnterKey();
      } else if ((event.code >= 'KeyA' && event.code <= 'KeyZ' && guesses[currentRow].letters.length < 5) ||
          event.code === 'BracketLeft' || event.code === 'Quote' || event.code === 'Semicolon') {
        handleLetterKey(event);
      } else if (event.code === "Backspace") {
        const updatedGuess = [...guesses]
        updatedGuess[currentRow].letters.pop();
        setGuesses(updatedGuess)  
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown)
    }
  }, [handleEnterKey, handleLetterKey, gameState, currentRow, guesses])

  const handleLetterClick = (e: any) => {
    const updatedGuess = [...guesses];
    updatedGuess[currentRow].letters.push({
      letter: e.target.innerHTML,
      state: LetterState.NONE
    });
    setGuesses(updatedGuess)
  };
  const handleEnterClick = () => {
    handleEnterKey();
  };
  const handleBackspaceClick = () => {
    const updatedGuess = [...guesses];
    updatedGuess[currentRow].letters.pop();
    setGuesses(updatedGuess)  
  };

  return (
    <div className="h-screen w-screen bg-zinc-100">
      <div className="flex flex-col justify-center items-center h-screen w-96 my-0 mx-auto">
        <div className="md:hidden text-5xl absolute top-0 w-full text-center border-2 border-zinc-400 bg-gray-300">Ordle</div>
        <GameOver gameState={gameState}/>
        <Grid guesses={guesses}/>
        <Keyboard guesses={guesses} letterClick={handleLetterClick} enterClick={handleEnterClick} backspaceClick={handleBackspaceClick}/>
      </div>
    </div>
  );
}

export default App;
