# Tetris - React State Management Deep Dive

A fully functional Tetris game built with React to explore advanced state management patterns in complex, frame-dependent scenarios.

## 🎯 The Challenge

This project was built specifically to test state management in scenarios that push React's limits:
- **Frame-based rendering** - Continuous game loop with setTimeout-based gravity
- **Multi-source state synchronization** - Active piece, locked grid, figure bag system
- **Real-time collision detection** - Frame-by-frame validation before movement
- **Matrix transformations** - Complex rotation logic with transpose operations
- **Ref-based state hybrid** - Using both `useState` and `useRef` to manage renders vs game loop

## 🧪 Key Implementation Patterns

### 1. **Dual State Architecture**
```typescript
const [gameState, setGameState] = useState<ItemType[][]>(initialState);
const gameStateRef = useRef<ItemType[][]>(initialState);
```
- `useState` triggers renders for UI updates
- `useRef` provides stable reference for recursive game loop
- This prevents stale closures in the auto-drop mechanism

### 2. **Seven-Bag Randomizer**
Implemented the official Tetris randomizer algorithm:
```typescript
const getNextFigure = () => {
  if (figureBagRef.current.length === 0) {
    // Refill bag with all 7 pieces, then shuffle
    figureBagRef.current = ALL_FIGURES.map((_, i) => i);
    // Fisher-Yates shuffle
  }
  return ALL_FIGURES[figureBagRef.current.pop()!];
};
```
Ensures fair piece distribution - no frustrating droughts!

### 3. **Smart Movement Validation**
```typescript
const sortByMod = (a: any, b: any) => {
  if (modX > 0) return b.currentX - a.currentX; // Moving right
  if (modX < 0) return a.currentX - b.currentX; // Moving left
  if (modY > 0) return b.currentY - a.currentY; // Moving down
  // ...
};
```
Blocks are updated in directional order to prevent self-collision during movement.

### 4. **Matrix Rotation Algorithm**
Three-step rotation process:
1. Extract figure blocks into isolated matrix
2. Transpose the matrix
3. Reverse each row

This implements a 90° clockwise rotation mathematically.

### 5. **Line Clear Detection**
```typescript
const checkAndDeleteCompleteRows = (gameState: ItemType[][]) => {
  const incompleteRows = gameState.filter(
    (row) => !row.every((item) => item !== null)
  );
  const deletedCount = gameState.length - incompleteRows.length;
  // Generate new empty rows at top
  const newRows = Array(deletedCount).fill(null)
    .map(() => Array(COLUMNS).fill(null));
  return [...incompleteRows, ...newRows];
};
```

### 6. **Recursive Auto-Drop with Cleanup**
```typescript
const autoMoveDownCurrentFigure = () => {
  const shouldNotMove = updateLatestFigurePosition(0, -1, gameStateRef.current);
  if (shouldNotMove) {
    // Lock piece, spawn new one, check lines
    const addFigureRes = addFigure(gameStateRef.current);
    if (!addFigureRes.added) return setGameFinished(true); // Game over
    // ...
  }
  setTimeout(() => autoMoveDownCurrentFigure(), 500);
};
```

## 🛠️ Built With

- **React** - UI framework
- **TypeScript** - Type safety for complex matrix operations
- **Vite** - Build tool
- **CSS Grid** - Game board rendering

## 💡 What I Learned

### State Management Insights
- **When to use refs vs state** - Refs for values needed in async/recursive functions that shouldn't trigger re-renders
- **Immutable updates** - Why `map((row) => [...row])` is critical for proper React updates
- **Effect dependency arrays** - Managing game loop restart with `figureIdCounterRef.current` dependency

### Algorithm Challenges Solved
- **Directional collision detection** - Sorting blocks by movement direction before updating positions
- **Matrix rotation** - Transpose + reverse for 90° rotation
- **Fair randomization** - Seven-bag system from official Tetris guidelines
- **Game over detection** - Checking if new piece can spawn at top

### Performance Considerations
- Using `useRef` to avoid closure issues in recursive setTimeout
- Grid-based rendering with CSS Grid (no canvas overhead)
- Minimizing re-renders by only updating state when necessary

## 🚀 Run Locally
```bash
npm install
npm run dev
```

## 🎮 Controls

- **Arrow Left/Right** - Move piece
- **Arrow Up** - Rotate piece
- **Arrow Down** - Soft drop
- **Start Game** - Begin playing

## 🔧 Architecture Highlights

- **Buffer zone** - Top rows hidden from view (standard Tetris feature)
- **Figure ID system** - Tracks active vs locked pieces
- **Immutable state updates** - All operations create new state copies
- **Collision-first approach** - Validate before move, not after

---

*Built to master complex state management in React. Learned more debugging rotation logic than expected.* 🎮
