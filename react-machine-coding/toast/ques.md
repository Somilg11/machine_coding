### Toast Notification [Type - Medium]

- gone after 5 seconds
- seperate colors for 4 seperate toasts, success/info/warning/error

```
import { useRef, useState } from "react";

export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);
  const timerRef = useRef({});
  const handleClose = (id) => {
    clearTimeout(timerRef.current[id]);
    delete timerRef.current[id];
    setToasts((prevToast) => {
      const filteredArr = prevToast.filter((toast) => {
        return toast.id !== id;
      });
      return filteredArr;
    });
  };
  const handleAdd = (message, type) => {
    //
    const id = new Date().getTime();
    const newToast = [...toasts, { id, message, type }];
    setToasts(newToast);
    timerRef.current[id] = setTimeout(() => handleClose(id), 5000);
  };
  return (
    <div className="container">
      <div className="toast-container">
        {toasts.map(({ id, message, type }) => (
          <div key={id} className={`toast ${type}`}>
            {message} <span onClick={() => handleClose(id)}>X</span>
          </div>
        ))}
      </div>
      <div className="btn-container">
        <button onClick={() => handleAdd("Success", "success")}>success</button>
        <button onClick={() => handleAdd("Information", "info")}>info</button>
        <button onClick={() => handleAdd("Warning", "warning")}>warning</button>
        <button onClick={() => handleAdd("Error", "error")}>error</button>
      </div>
    </div>
  );
};
```


```
import { ToastContainer } from "./component/ToastContainer";
import "./styles.css";

export default function App() {
  return (
    <div className="App">
      <h1>Toast</h1>
      <div>
        <ToastContainer />
      </div>
    </div>
  );
}
```

```
.App {
  font-family: sans-serif;
}

.toast-container {
  position: fixed;
  top: 0.5rem;
  right: 0.5rem;
}

.toast {
  background-color: green;
  width: 12rem;
  color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  position: relative;
  margin: 0.5rem;
  animation: slide 1s 1;
  span {
    position: absolute;
    right: 1rem;
    cursor: pointer;
  }
}

.success {
  background-color: green;
}

.info {
  background-color: rgb(0, 92, 212);
}

.warning {
  background-color: rgb(255, 217, 26);
}

.error {
  background-color: red;
}

@keyframes slide {
  0% {
    transform: translateX(100%);
  }
  ,
  100% {
    transform: translateX(0%);
  }
}
```