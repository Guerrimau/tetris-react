import { useEffect, useRef, useState } from "react";
import "./App.css";
import { generateGameStateMatrix, getRandomInt } from "./utils";
import { ALL_FIGURES } from "./figures";
import {
  BUFFER,
  CANVA_HEIGHT,
  CANVA_WIDTH,
  COLUMNS,
  ROWS,
  SQUARE_SIZE,
} from "./config";
import { Block } from "./Block";
import type { ItemType } from "./types";

function App() {
  const initialState = generateGameStateMatrix();

  const [gameState, setGameState] = useState<ItemType[][]>(initialState);
  const [gameFinished, setGameFinished] = useState(false);

  const gameStateRef = useRef<ItemType[][]>(initialState);
  const figureBagRef = useRef<number[]>([]);
  const figureIdCounterRef = useRef(0);

  const updateState = (newState: ItemType[][]) => {
    setGameState(newState);
    gameStateRef.current = newState;
  };

  const getNextFigure = () => {
    if (figureBagRef.current.length === 0) {
      figureBagRef.current = ALL_FIGURES.map((_, i) => i);
      for (let i = figureBagRef.current.length - 1; i > 0; i--) {
        const j = getRandomInt(0, i);
        [figureBagRef.current[i], figureBagRef.current[j]] = [
          figureBagRef.current[j],
          figureBagRef.current[i],
        ];
      }
    }

    const figureIndex = figureBagRef.current.pop()!;
    return ALL_FIGURES[figureIndex];
  };

  const addBlock = (
    block: Block,
    gameState: ItemType[][]
  ): { newState: ItemType[][]; added: boolean } => {
    const newState = gameState.map((row) => [...row]);
    if (newState[block.positionY][block.positionX])
      return { newState, added: false };

    newState[block.positionY][block.positionX] = block;
    return { newState, added: true };
  };

  const addFigure = (gameState: ItemType[][]) => {
    const newFigureId = figureIdCounterRef.current + 1;
    figureIdCounterRef.current = newFigureId;

    let stateCopy = [...gameState].map((row) => [...row]) as ItemType[][];
    let added = true;

    const figure = getNextFigure();

    figure.coords.forEach((figureBlock) => {
      const block = new Block(
        newFigureId,
        figureBlock.x,
        figureBlock.y,
        figure.color
      );
      const addBlockRes = addBlock(block, stateCopy);
      if (!addBlockRes.added) {
        added = addBlockRes.added;
      }
      stateCopy = addBlockRes.newState;
    });

    return { newState: stateCopy, added };
  };

  const getLatestFigureBlockCoordenates = (stateCopy: ItemType[][]) => {
    const blockCoordenates: {
      currentX: number | null;
      currentY: number | null;
      block: ItemType;
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
    return blockCoordenates;
  };

  const updateLatestFigurePosition = (
    modX: number,
    modY: number,
    state: ItemType[][]
  ) => {
    const stateCopy = state.map((row) => [...row]);

    const blockCoordenates = getLatestFigureBlockCoordenates(stateCopy);

    const sortByMod = (a: any, b: any) => {
       
      if (modX > 0) return b.currentX - a.currentX;
      if (modX < 0) return a.currentX - b.currentX;
      if (modY > 0) return b.currentY - a.currentY;
      if (modY < 0) return a.currentY - b.currentY;
      return 1;
    };

    let shouldNotMove = false;

    blockCoordenates.sort(sortByMod).forEach((item) => {
      if (shouldNotMove) return;

      stateCopy[item.currentY as number][item.currentX as number] = null;

      const updatedY = (item.currentY as number) + modY;
      const updatedX = (item.currentX as number) + modX;

      if (updatedY < 0 || stateCopy[updatedY][updatedX]) {
        shouldNotMove = true;
        return true;
      }

      stateCopy[updatedY][updatedX] = item.block;
    });

    if (!shouldNotMove) {
      updateState(stateCopy);
    }

    return shouldNotMove;
  };

  const rotateLatestFigure = (state: ItemType[][]) => {
    const stateCopy = state.map((row) => [...row]);
    const blockCoordenates = getLatestFigureBlockCoordenates(stateCopy);

    let lowestY = Infinity;
    let lowestX = Infinity;

    blockCoordenates.forEach((block) => {
      if (Number(block.currentY) < lowestY) {
        lowestY = Number(block.currentY);
      }

      if (Number(block.currentX) < lowestX) {
        lowestX = Number(block.currentX);
      }
    });

    const figureMatrix: ItemType[][] = [];
    let maxIndex = 0;

    blockCoordenates.forEach((block) => {
      const adjustedX = Number(block.currentX) - lowestX;
      const adjustedY = Number(block.currentY) - lowestY;

      if (adjustedX > maxIndex) maxIndex = adjustedX;
      if (adjustedY > maxIndex) maxIndex = adjustedY;

      if (!figureMatrix[adjustedX]) {
        figureMatrix[adjustedX] = [];
      }
      figureMatrix[adjustedX][adjustedY] = block.block;
    });

    // Traspose Matrix With Empty Values
    const trasposedMatrix: ItemType[][] = Array.from(
      { length: maxIndex + 1 },
      () => Array(maxIndex + 1).fill(null)
    );

    // Traspose - copy from figureMatrix[i][j] to trasposedMatrix[j][i]
    for (let i = 0; i <= maxIndex; i++) {
      for (let j = 0; j <= maxIndex; j++) {
        // Check if figureMatrix[i] exists and figureMatrix[i][j] has a value
        if (figureMatrix[i] && figureMatrix[i][j]) {
          trasposedMatrix[j][i] = figureMatrix[i][j];
        }
      }
    }
    // Reverse
    for (let i = 0; i < trasposedMatrix.length; i++) {
      trasposedMatrix[i].reverse();
    }

    blockCoordenates.forEach((block) => {
      stateCopy[block.currentY as number][block.currentX as number] = null;
    });

    trasposedMatrix.forEach((rows, indexX) => {
      rows.forEach((item, indexY) => {
        const newY = lowestY + indexY;
        const newX = lowestX + indexX;

        stateCopy[newY][newX] = item;
      });
    });

    updateState(stateCopy);
  };

  const handleStartGame = () => {
    const { newState: updatedState } = addFigure(gameState);
    updateState(updatedState);
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
        rotateLatestFigure(gameState);
        break;
      case "ArrowDown":
        updateLatestFigurePosition(0, -1, gameState);
        break;
      default:
        break;
    }
  };

  const checkAndDeleteCompleteRows = (gameState: ItemType[][]) => {
    const incompleteRows = gameState.filter(
      (row) => !row.every((item) => item !== null)
    );
    const deletedCount = gameState.length - incompleteRows.length;

    const newRows = Array(deletedCount)
      .fill(null)
      .map(() => Array(COLUMNS).fill(null));

    return [...incompleteRows, ...newRows];
  };

  const autoMoveDownCurrentFigure = () => {
    const shouldNotMove = updateLatestFigurePosition(
      0,
      -1,
      gameStateRef.current
    );
    if (shouldNotMove) {
      const addFigureRes = addFigure(gameStateRef.current);
      if (!addFigureRes.added) return setGameFinished(!addFigureRes.added);

      const updatedState = checkAndDeleteCompleteRows(addFigureRes.newState);
      updateState(updatedState);
      return;
    }
    setTimeout(() => {
      autoMoveDownCurrentFigure();
    }, 500);
  };

  useEffect(() => {
    if (figureIdCounterRef.current === 0 || gameFinished) return;
    autoMoveDownCurrentFigure();
  }, [figureIdCounterRef.current]); //eslint-disable-line

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
      <button onClick={handleStartGame}>Start Game</button>
    </div>
  );
}

export default App;
