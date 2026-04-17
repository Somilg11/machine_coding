### Accordian

```
import { useState } from "react";
import "./styles.css";

const items = [
  {
    id: 1,
    title: "aaa",
    content: "aaabbbccc",
  },
  {
    id: 2,
    title: "bbb",
    content: "aaabbbccc",
  },
  {
    id: 3,
    title: "ccc",
    content: "aaabbbccc",
  },
];

export default function App() {
  const [openIndex, setOpenIndex] = useState(null);
  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  return !items || items.length === 0 ? (
    "No items"
  ) : (
    <div className="accordian">
      {items.map((item, index) => {
        return (
          <div key={index} onChange={() => setOpenIndex}>
            <button
              className="accordian-title"
              onClick={() => handleToggle(index)}
            >
              {item.title}
            </button>
            {openIndex === index && (
              <div className="accordian-content">{item.content}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
```

```
.App {
  font-family: sans-serif;
  text-align: center;
}

.accordian-title {
  display: flex;
  border: none;
  padding: 10px;
  width: 500px;
  justify-content: start;
  font-weight: 800;
  cursor: pointer;
}

.accordian-content {
  display: flex;
  padding: 10px;
  width: 500px;
  justify-content: start;
  cursor: pointer;
}
```