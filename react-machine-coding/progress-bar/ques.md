### Progress Bar [Type - Easy]

```
import { useEffect, useState } from "react";
import "./styles.css";

const ProgressBar = ({ progress }) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  useEffect(() => {
    setTimeout(() => setAnimatedProgress(progress), 100);
  }, [progress]);
  return (
    <div className="outer">
      <div
        className="inner"
        style={{
          // width: `${progress}%`,
          transform: `translateX(${animatedProgress - 100}%)`,
          color: animatedProgress > 5 ? "white" : "black",
        }}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemax="100"
        aria-valuemin="0"
      >
        {progress}%
      </div>
    </div>
  );
};
export default function App() {
  const progress = 70;
  return (
    <div className="App">
      <h1>Progress Bar</h1>
      <div>
        <ProgressBar progress={progress} />
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

.outer {
  border: 1px solid black;
  border-radius: 10px;
  overflow: hidden;
}

.inner {
  background-color: green;
  color: white;
  font-weight: 800;
  padding: 2px;
  text-align: right;
  transition: 0.5s ease-in;
}

```