import { MouseEventHandler, useRef } from "react";
import { GameState } from "./types"
import { goalWord } from "./wordlist"

interface GameProps {
    gameState: GameState | undefined;
    click: MouseEventHandler;
}

export default ({gameState = undefined, click}: GameProps) : React.JSX.Element => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    const dialogContent = () => {
      if (dialogRef.current && (gameState === GameState.WIN || gameState === GameState.LOSS)) {
        dialogRef.current.showModal();
      }
      if (gameState === GameState.WIN) {
        return (
          <>
            <div className="text-3xl font-bold">Du vann! Spela igen?</div>
            <button onClick={click} className="w-1/2 bg-gray-400 rounded-lg p-2 text-xl hover:bg-sky-500">Starta om</button>
          </>
        );
      } else if (gameState === GameState.LOSS) {
          return (
            <div className="text-3xl font-bold">Inte den här gången :( Det rätta ordet var {goalWord}</div>
          );
      } else {
          return <></>;
      }
    }

    console.log(goalWord);
    return (
      <dialog className="w-9/12 rounded-lg bg-gray-100" ref={dialogRef}>
        <div className="p-6 flex flex-col h-full w-full items-center justify-center text-center gap-10">
          {dialogContent()}
        </div>
      </dialog>
    );
}