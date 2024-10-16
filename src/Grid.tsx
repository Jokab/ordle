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
    'bg-gray-400 text-5xl font-bold w-full rounded-md flex justify-center items-center h-16': true,
    'bg-gray-400': letter?.state === LetterState.NONE,
    'bg-lime-600': letter?.state === LetterState.CORRECT,
    'bg-gray-600': letter?.state === LetterState.WRONG,
    'bg-yellow-500': letter?.state === LetterState.WRONG_POSITION
  });
  return (
    [Array(5).fill(0).map((_, i: number) => 
      <div className={cellClass(guess?.letters[i])} key={i}>
        {guess?.letters && guess?.letters.length > i ? guess.letters[i].letter : undefined}
      </div>)
    ]
  );
}