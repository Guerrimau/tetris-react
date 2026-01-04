import { useRef, useState } from "react";
import "./App.css";

const ROWS = 15;
const BUFFER = 2;
const MEMORY_ROWS = ROWS + BUFFER;
const COLUMNS = 10;
const SQUARE_SIZE = 50;
const CANVA_HEIGHT = SQUARE_SIZE * ROWS;
const CANVA_WIDTH = SQUARE_SIZE * COLUMNS;

class Block {
  public figureId;
  public color;
  public positionX;
  public positionY;
  // public leftBlock: Block | null;
  // public rightBlock: Block | null;
  // public topBlock: Block | null;
  // public bottomBlock: Block | null;

  constructor(
    figureId: number,
    positionX: number,
    positionY: number,
    color: string
    // leftBlock?: Block | null,
    // rightBlock?: Block | null,
    // topBlock?: Block | null,
    // bottomBlock?: Block | null
  ) {
    this.positionX = positionX;
    this.positionY = positionY;
    this.color = color;
    this.figureId = figureId;
    // this.leftBlock = leftBlock || null;
    // this.rightBlock = rightBlock || null;
    // this.topBlock = topBlock || null;
    // this.bottomBlock = bottomBlock || null;
  }
}

type CellType = Block | null;

const generateGameStateMatrix = (): null[][] => {
  return Array(MEMORY_ROWS).fill(Array(COLUMNS).fill(null));
};

function App() {
  const initialState = generateGameStateMatrix();
  const [gameState, setGameState] = useState<CellType[][]>(initialState);
  const figureIdCounterRef = useRef(0);

  const addBlock = (block: Block, gameState: CellType[][]) => {
    const newState = gameState.map((row) => [...row]);
    newState[block.positionY][block.positionX] = block;
    return newState;
  };

  const addFigure = (gameState) => {
    const newFigureId = figureIdCounterRef.current + 1;
    figureIdCounterRef.current = newFigureId;

    const blockCoordenates = [
      {
        x: 5,
        y: 5,
      },
      {
        x: 5,
        y: 5 - 1,
      },
      {
        x: 4,
        y: 5 - 1,
      },
      {
        x: 6,
        y: 5 - 1,
      },
    ];
    const color = "red";
    let stateCopy = [...gameState].map((row) => [...row]) as CellType[][];

    blockCoordenates.forEach((blockCoord) => {
      const block = new Block(newFigureId, blockCoord.x, blockCoord.y, color);
      stateCopy = addBlock(block, stateCopy);
    });

    return stateCopy;
  };

  const onStartGame = () => {
    const updatedState = addFigure(gameState);
    setGameState(updatedState);
  };

  const updateLatestFigurePosition = (
    modX: number,
    modY: number,
    state: CellType[][]
  ) => {
    const stateCopy = state.map((row) => [...row]);

    const blockCoordenates: {
      currentX: number | null;
      currentY: number | null;
      block: CellType;
    }[] = [];

    stateCopy.forEach((row, indexY) => {
      row.forEach((item, indexX) => {
        if (item?.figureId === figureIdCounterRef.current) {
          blockCoordenates.push({
            currentX: indexX,
            currentY: indexY,
            block: item,
          });
        }
      });
    });

    if (blockCoordenates.length === 0) {
      return;
    }

    const sortByMod = (a, b) => {
      if (modX > 0) return b.currentX - a.currentX;
      if (modX < 0) return a.currentX - b.currentX;
      if (modY > 0) return b.currentY - a.currentY;
      if (modY < 0) return a.currentY - b.currentY;
      return 1;
    };

    let shouldNotMove = false;

    blockCoordenates.sort(sortByMod).forEach((item) => {
      if (shouldNotMove) return;

      stateCopy[item.currentY][item.currentX] = null;

      const updatedY = item.currentY + modY;
      const updatedX = item.currentX + modX;

      if (updatedY < 0 || stateCopy[updatedY][updatedX] ) {
        shouldNotMove = true;
        return
      }

      stateCopy[updatedY][updatedX] = item.block;
    });

    if(!shouldNotMove) setGameState(stateCopy)


    return shouldNotMove
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowRight":
        updateLatestFigurePosition(+1, 0, gameState);
        break;
      case "ArrowLeft":
        updateLatestFigurePosition(-1, 0, gameState);
        break;
      case "ArrowUp":
        updateLatestFigurePosition(0, 1, gameState);
        break;
      case "ArrowDown":
        updateLatestFigurePosition(0, -1, gameState);
        break;
      default:
        break;
    }
  };

  return (
    <div tabIndex={0} onKeyDown={handleKeyDown}>
      <div
        style={{
          height: `${CANVA_HEIGHT}px`,
          width: `${CANVA_WIDTH}px`,
          border: "1px solid grey",
          display: "grid",
          gridTemplateColumns: `repeat(${COLUMNS}, ${SQUARE_SIZE}px)`,
          gridTemplateRows: `repeat(${ROWS}, ${SQUARE_SIZE}px)`,
        }}
      >
        {[...gameState].reverse().map((row, index) => {
          if (index + 1 <= BUFFER) return null;
          return row.map((item: Block | null) => {
            return (
              <div
                style={{
                  backgroundColor: item?.color,
                  height: SQUARE_SIZE,
                  width: SQUARE_SIZE,
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
