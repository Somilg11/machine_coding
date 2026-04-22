### Tic-Tac-Toe

```
import { useState } from "react";
import "./styles.css";

export default function App() {
  const [board, setBoard] = useState(Array(9).fill(""));
  const [turn, setTurn] = useState("X");

  const winnerPattern = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const checkWinner = () => {
    for (let [a, b, c] of winnerPattern) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  const winner = checkWinner();

  const handleClick = (i) => {
    if (board[i] || winner) return;

    const newBoard = [...board];
    newBoard[i] = turn;

    setBoard(newBoard);
    setTurn(turn === "X" ? "0" : "X");
  };

  const reset = () => {
    setBoard(Array(9).fill(""));
    setTurn("X");
  };

  return (
    <div className="App">
      <h1>tic-tac-toe</h1>
      <div>
        <div className="board">
          {board.map((cell, index) => (
            <button
              key={index}
              className="cell"
              onClick={() => handleClick(index)}
            >
              {cell}
            </button>
          ))}
        </div>
        <div>
          <h3>{winner ? `Winner: ${winner}` : `Turn: ${turn}`}</h3>
        </div>
        <button className="restart" onClick={reset}>
          restart
        </button>
      </div>
    </div>
  );
}
```

```
.App {
  font-family: sans-serif;
  text-align: center;
}

.board {
  display: grid;
  grid-template-columns: repeat(3, 80px);
  gap: 8px;
  justify-content: center;
  margin: 20px 0;
}

.cell {
  height: 80px;
  font-size: 28px;
  cursor: pointer;
}

.restart {
  padding: 8px 16px;
  cursor: pointer;
}
```