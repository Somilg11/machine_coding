### Chips Input [Type - Easy]

```
import { useState } from "react";
import "./styles.css";

export default function App() {
  const [inputText, setInputText] = useState("");
  const [chips, setChips] = useState([]);

  const handleKeyDown = (e) => {
    if (inputText.trim() === "") return;
    if (e.key === "Enter") {
      setChips((prev) => [...prev, inputText]);
      setInputText("");
    }
  };

  const handleDeleteChip = (index) => {
    const copyChips = [...chips];
    copyChips.splice(index, 1);
    setChips(copyChips);
  };

  return (
    <div className="App">
      <h1>Chips - Input</h1>
      <div className="container">
        <input
          type="text"
          placeholder="Enter chip"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e)}
        />
        <div>
          <div className="chips-container">
            {chips.map((chip, index) => (
              <div key={index} className="chips">
                {chip}
                <button
                  className="cross-button"
                  onClick={() => handleDeleteChip(index)}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
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

.chips-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.chips {
  margin: 5px;
  padding: 5px 10px 5px 10px;
  font-weight: 700;
  background-color: whitesmoke;
  border-radius: 10px;
}

.cross-button {
  margin-left: 5px;
  border: none;
  color: red;
  cursor: pointer;
  border-radius: 100%;
}
```