import { GameState } from "./types"
import { goalWord } from "./wordlist"

interface GameProps {
    gameState: GameState | undefined
}

export default ({gameState = undefined}: GameProps) : React.JSX.Element => {
    if (gameState === GameState.WIN) {
      return <div className="mb-10 text-2xl">Du vann!</div>
    } else if (gameState === GameState.LOSS) {
        return <div className="mb-10 text-2xl">Det gick inte denna gången! :-( Rätt ord var: {goalWord}</div>
    } else {
      return <></>
    }
  }