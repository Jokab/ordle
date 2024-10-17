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
          <div className="text-3xl font-bold">Du vann! Spela igen?</div>
        );
      } else if (gameState === GameState.LOSS) {
          return (
            <div className="text-3xl font-bold">Inte den här gången :( Det rätta ordet var {goalWord}. Spela igen?</div>
          );
      } else {
          return <></>;
      }
    }

    return (
      <dialog className="w-9/12 rounded-lg bg-gray-100" ref={dialogRef}>
        <div className="p-6 flex flex-col h-full w-full items-center justify-center text-center gap-10">
          {dialogContent()}
          {/* Tabindex is hack to prevent dialog from autofocusing the button when it opens.
              autoFocus=false didn't work.
              Else causes bug where pressing enter on the last guess automatically also clicks
              button, causing restart.
              Not great for accessibility but this is toy project after all. */}
          <button 
            tabIndex={-1}
            onClick={click} 
            className="w-1/2 bg-accent rounded-lg p-2 text-xl hover:bg-sky-500">
              Starta om
          </button>
        </div>
      </dialog>
    );
}