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
  const [itemHistory, setItemHistory] = useState([])
  const idCounterRef = useRef(0);

  const addToTheTop = (block: Block) => {
    setGameState((prevState) => {
      const newState = prevState.map((row) => [...row]);
      newState[block.positionX][block.positionY] = block;
      return newState;
    });
  };

  const onStartGame = () => {
    const latestId = idCounterRef.current + 1
    const block = new Block(latestId, 0, 0, "red");
    idCounterRef.current = latestId
    setItemHistory(prev => [...prev, block])
    addToTheTop(block);
  };

  console.log(itemHistory)

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowRight":
        
        break;
      case "ArrowLeft":
        
        break;
    
      default:
        break;
    }
    
  }

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
        {gameState.map((rows) => {
          return rows.map((item: Block | null) => {
            if (!item) return null;

            return (
              <div
                style={{
                  backgroundColor: item.color,
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
