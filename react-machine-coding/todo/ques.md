### TODO [Type - Medium]

```
import { useState } from "react";
import "./styles.css";

export default function App() {
  const [input, setInput] = useState();
  const [todolist, setTodoList] = useState([]);

  const addTodoItem = () => {
    if (input.trim() === "") return;
    const item = {
      id: Date.now().toString(),
      text: input,
      completed: false,
    };
    setTodoList((prev) => [...prev, item]);
    setInput("");
  };

  const toggleCompleted = (id) => {
    setTodoList(
      todolist.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            completed: !t.completed,
          };
        } else {
          return t;
        }
      })
    );
  };

  const deleteTodo = (id) => {
    setTodoList(todolist.filter((t) => t.id != id));
  };

  return (
    <div className="App">
      <h1>TODO List</h1>
      <div>
        <input
          type="text"
          placeholder="Enter todo"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={() => addTodoItem()}>Add</button>
        <ul>
          {todolist.map((t) => (
            <li key={t.id}>
              <input
                type="checkbox"
                checked={t.completed}
                onChange={() => toggleCompleted(t.id)}
              />
              <span className={t.completed ? "strikethrough" : ""}>
                {t.text}{" "}
              </span>
              <button onClick={() => deleteTodo(t.id)}>delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

```