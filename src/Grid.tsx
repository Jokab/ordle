import classNames from "classnames";
import { Guess, Letter, LetterState } from "./types";

interface GridProps {
    guesses: Guess[];
}

export default ({guesses = []}: GridProps) => {
    return (
      <table className="w-96 h-96 table-fixed">
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

interface RowProps {
    guess: Guess;
}
  
const Row = ({guess}: RowProps) => {
    const cellClass = (letter: Letter | undefined) => classNames({
        'bg-gray-400 text-3xl w-10 h-10 text-center truncate border-2': true,
        'bg-green-500': letter?.state === LetterState.CORRECT,
        'bg-gray-500': letter?.state === LetterState.WRONG,
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