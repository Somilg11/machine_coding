## Nested Checkbox [Type - Hard]

### Task is to develop nestd checkbox structure
- Followup 1 : Generate a recursively nested structure based on configuration
- Followup 2 : If all child checkboxes are checked , parent checkbox should automatically be checked
- Followup 3 : If parent checkbox is selected, all child checkboex should also be checked

```
import { useState } from "react";
import "./styles.css";

const checkboxData = [
  {
    id: 1,
    name: "fruits",
    children: [
      {
        id: 11,
        name: "citrus",
        children: [
          {
            id: 111,
            name: "orange",
          },
          {
            id: 112,
            name: "lemon",
          },
        ],
      },
      {
        id: 21,
        name: "berry",
        children: [
          {
            id: 211,
            name: "strawberry",
          },
          {
            id: 212,
            name: "blueberry",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "vegetables",
  },
];

const CheckBoxes = ({ data, checked, setChecked }) => {
  const handleChange = (isChecked, node) => {
    setChecked((prev) => {
      const newState = { ...prev, [node.id]: isChecked };
      const updateChildren = (node) => {
        node.children?.forEach((child) => {
          newState[child.id] = isChecked;
          child.children && updateChildren(child);
        });
      };
      updateChildren(node);

      const verifyCheck = (node) => {
        if (!node.children) return newState[node.id] || false;
        const allChildrenChecked = node.children.every((child) =>
          verifyCheck(child)
        );
        newState[node.id] = allChildrenChecked;
        return allChildrenChecked;
      };
      checkboxData.forEach((node) => verifyCheck(node));

      return newState;
    });
  };
  return (
    <div>
      {data.map((node) => (
        <div className="parent-node" key={node.id}>
          <input
            type="checkbox"
            checked={checked[node.id] || false}
            onChange={(e) => handleChange(e.target.checked, node)}
          />
          <span>{node.name}</span>
          {node.children && (
            <CheckBoxes
              data={node.children}
              checked={checked}
              setChecked={setChecked}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default function App() {
  const [checked, setChecked] = useState({});
  return (
    <div className="App">
      <h1>Nested Checkbox</h1>
      <div>
        <CheckBoxes
          data={checkboxData}
          checked={checked}
          setChecked={setChecked}
        />
      </div>
    </div>
  );
}
```