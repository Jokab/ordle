import classNames from "classnames";
import { Guess, Letter, LetterState } from "./types";
import { allowedGuesses } from "./config";

interface GridProps {
    guesses: Guess[];
}

export default ({guesses = []}: GridProps) => {
  return (
    <div className="grid grid-cols-5 grid-rows-6 gap-2 w-full h-full max-w-[360px] max-h-[420px]">
      {
        [Array(allowedGuesses).fill(0).map((_, i:number) => 
          <Row guess={guesses[i]} key={i}/>)
        ]
      }
    </div>
  );
}

interface RowProps {
    guess: Guess;
}
  
const Row = ({guess}: RowProps) => {
  const cellClass = (letter: Letter | undefined) => classNames({
    'bg-accent text-5xl font-bold w-full rounded-md flex justify-center items-center h-16': true,
    'bg-accent': letter?.state === LetterState.NONE,
    'bg-green': letter?.state === LetterState.CORRECT,
    'bg-grayish': letter?.state === LetterState.WRONG,
    'bg-yellow': letter?.state === LetterState.WRONG_POSITION
  });
  return (
    [...Array(5)].map((_, i: number) => 
      <div className={cellClass(guess?.letters[i])} key={i}>
        {guess?.letters && guess?.letters.length > i ? guess.letters[i].letter : undefined}
      </div>
    )
  );
}