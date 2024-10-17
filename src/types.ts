import { allowedGuesses } from "./config";

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
    id: number;
    letters: Letter[];
    locked: boolean;
    correct: boolean;
}

// TODO: Don't initialize guesses, add them as they are entered
export const guessesInitialState: Guess[] = 
    [...Array(allowedGuesses).keys()].map((_, i) => ({
        id: i,
        letters: [] as Letter[], 
        locked: false, 
        correct: false})
    );

export enum GameState {
    WIN,
    LOSS,
    PENDING
}