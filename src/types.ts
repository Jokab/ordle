export enum LetterState {
    CORRECT,
    WRONG_POSITION,
    WRONG,
    NONE
  }
  
export type Letter = {
    letter: string;
    state: LetterState;
}

export type Guess = {
    letters: Letter[];
    locked: boolean;
    correct: boolean;
}

export const guessesInitialState: Guess[] = [
    {letters: [] as Letter[], locked: false, correct: false},
    {letters: [] as Letter[], locked: false, correct: false},
    {letters: [] as Letter[], locked: false, correct: false},
    {letters: [] as Letter[], locked: false, correct: false},
    {letters: [] as Letter[], locked: false, correct: false},
    {letters: [] as Letter[], locked: false, correct: false}
]

export enum GameState {
    WIN,
    LOSS,
    PENDING
}