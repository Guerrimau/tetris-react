import { useRef, useState } from "react";
import "./App.css";

const rows = 15;
const columns = 10;
const squareSize = 50;
const canvaHeight = squareSize * rows;
const canvaWidth = squareSize * columns;

class Block {
  public id;
  public positionX;
  public positionY;
  public color;

  constructor(id: number, positionX: number, positionY: number, color: string) {
    this.positionX = positionX;
    this.positionY = positionY;
    this.color = color;
    this.id = id;
  }
}

const generateGameStateMatrix = () => {
  return Array(rows).fill(Array(columns).fill(null));
};

function App() {
  const initialState = generateGameStateMatrix();
  const [gameState, setGameState] = useState(initialState);
  const idCounterRef = useRef(0);

  const addBlock = (block: Block) => {
    setGameState((prevState) => {
      const newState = prevState.map((row) => [...row]);
      newState[block.positionY][block.positionX] = block;
      return newState;
    });
  };

  const onStartGame = () => {
    const latestId = idCounterRef.current + 1;
    const block = new Block(latestId, 0, 0, "red");
    idCounterRef.current = latestId;
    addBlock(block);
  };

  const updateLatestBlockPosition = (
    modX: number,
    modY: number,
    state: (Block | null)[][]
  ) => {
    const stateCopy = state.map((row) => [...row]);

    let currentX: number | null = null;
    let currentY: number | null = null;
    let block: Block | null = null;

    stateCopy.forEach((row, indexY) => {
      row.forEach((item, indexX) => {
        console.log(item);
        if (item?.id === idCounterRef.current) {
          currentX = indexX;
          currentY = indexY;
          block = item;
        }
      });
    });

    if (currentX === null || currentY === null || block === null) {
      return;
    }

    stateCopy[currentY][currentX] = null;

    const updatedY = currentY + modY;
    const updatedX = currentX + modX;

    stateCopy[updatedY][updatedX] = block;

    setGameState(stateCopy);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowRight":
        updateLatestBlockPosition(+1, 0, gameState);
        break;
      case "ArrowLeft":
        updateLatestBlockPosition(-1, 0, gameState);
        break;
      case "ArrowUp":
        updateLatestBlockPosition(0, 1, gameState);
        break;
      case "ArrowDown":
        updateLatestBlockPosition(0, -1, gameState);
        break;
      default:
        break;
    }
  };

  return (
    <div tabIndex={0} onKeyDown={handleKeyDown}>
      <div
        style={{
          height: `${canvaHeight}px`,
          width: `${canvaWidth}px`,
          border: "1px solid grey",
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, ${squareSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${squareSize}px)`,
        }}
      >
        {[...gameState].reverse().map((rows) => {
          return rows.map((item: Block | null) => {
            return (
              <div
                style={{
                  backgroundColor: item?.color,
                  height: squareSize,
                  width: squareSize,
                }}
              ></div>
            );
          });
        })}
      </div>
      <button onClick={onStartGame}>Start Game</button>
    </div>
  );
}

export default App;
