## File Explorer / VS Code Sidebar [Type - Hard]

- nested file folder structure
- expand and collapse folder
- add/remove file/folder


```
import { useState } from "react";
import "./styles.css";
import json from "./data.json";

const List = ({ list, addNodeToList, deleteNodeFromList }) => {
  const [isExpanded, setIsExpanded] = useState({});
  return (
    <div className="container">
      {list.map((node) => (
        <div key={node.id}>
          {node?.isFolder && (
            <span
              onClick={() =>
                setIsExpanded((prev) => ({
                  ...prev,
                  [node.name]: !prev[node.name],
                }))
              }
            >
              {isExpanded?.[node.name] ? "-- " : "+ "}
            </span>
          )}
          <span>{node.name}</span>
          {node?.isFolder && (
            <span className="icon" onClick={() => addNodeToList(node.id)}>
              {" [ @ ]"}
            </span>
          )}
          {node?.isFolder && (
            <span className="icon" onClick={() => deleteNodeFromList(node.id)}>
              {" [ # ]"}
            </span>
          )}
          {isExpanded?.[node.name] && node?.children && (
            <List
              list={node.children}
              addNodeToList={addNodeToList}
              deleteNodeFromList={deleteNodeFromList}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default function App() {
  const [data, setData] = useState(json);

  const addNodeToList = (parentId) => {
    const name = prompt("Enter name");
    const updateTree = (list) => {
      return list.map((node) => {
        if (node.id === parentId) {
          return {
            ...node,
            children: [
              ...node.children,
              {
                id: Date.now().toString(),
                name: name,
                isFolder: true,
                children: [],
              },
            ],
          };
        }
        if (node.children) {
          return { ...node, children: updateTree(node.children) };
        }
        return node;
      });
    };
    setData((prev) => updateTree(prev));
  };

  const deleteNodeFromList = (itemId) => {
    const updateTree = (list) => {
      return list
        .filter((node) => node.id !== itemId)
        .map((node) => {
          if (node.children) {
            return { ...node, children: updateTree(node.children) };
          }
          return node;
        });
    };
    setData((prev) => updateTree(prev));
  };
  return (
    <div className="App">
      <h1>File Explorer</h1>
      <List
        list={data}
        addNodeToList={addNodeToList}
        deleteNodeFromList={deleteNodeFromList}
      />
    </div>
  );
}

```

```
[
  {
    "id": 1,
    "name": "public",
    "isFolder": true,
    "children": [
      {
        "id": 11,
        "name": "index.html",
        "isFolder": false
      }
    ]
  },
  {
    "id": 2,
    "name": "src",
    "isFolder": true,
    "children": [
      {
        "id": 21,
        "name": "component",
        "isFolder": true,
        "children": []
      },
      {
        "id": 22,
        "name": "App.js",
        "isFolder": false
      },
      {
        "id": 23,
        "name": "data.json",
        "isFolder": false
      },
      {
        "id": 24,
        "name": "index.js",
        "isFolder": false
      },
      {
        "id": 25,
        "name": "style.css",
        "isFolder": false
      }
    ]
  },
  {
    "id": 3,
    "name": "package.json",
    "isFolder": false
  }
]

```

```
.App {
  font-family: sans-serif;
  text-align: center;
}

.container {
  text-align: left;
  padding-left: 20px;
  cursor: pointer;
}

```