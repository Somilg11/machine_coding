### Auto Complete Search Bar

```
import { useEffect, useState } from "react";
import "./styles.css";

export default function App() {
  const [results, setResults] = useState([]);
  const [input, setInput] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [cache, setCache] = useState({});

  const fetchData = async () => {
    if (cache[input]) {
      setResults(cache[input]);
      return;
    }
    const data = await fetch("https://dummyjson.com/recipes/search?q=" + input);
    const json = await data.json();
    setResults(json?.recipes);
    // simple state caching
    setCache((prev) => ({ ...prev, [input]: json?.recipes }));
  };

  useEffect(() => {
    // debouncing
    const timer = setTimeout(fetchData, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [input]);

  return (
    <div className="App">
      <h1>Auto-complete Search Bar</h1>
      <div>
        <input
          type="text"
          className="search-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setShowResults(true)}
          onBlur={() => setShowResults(false)}
        />
        {showResults && (
          <div className="results-container">
            {results.map((r) => (
              <span className="result" key={r.id}>
                {r.name}
              </span>
            ))}
          </div>
        )}
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

.search-input {
  width: 500px;
  padding: 5px;
}

.results-container {
  width: 500px;
  margin: auto;
  border: solid 1px black;
  padding: 5px;
  max-height: 500px;
  overflow-y: scroll;
}

.result {
  display: block;
  text-align: left;
  padding: 5px;
}

.result:hover {
  background-color: beige;
  cursor: pointer;
}

```