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
    letters: Letter[];
    locked: boolean;
    correct: boolean;
}

export const guessesInitialState: Guess[] = 
    [...Array(allowedGuesses).keys()].map(_ => ({
        letters: [] as Letter[], 
        locked: false, 
        correct: false})
    );

export enum GameState {
    WIN,
    LOSS,
    PENDING
}