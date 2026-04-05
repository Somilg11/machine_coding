## form based ui using react

### problem includes 3 tabs : Profile | Interest | Settings , with specific requirements like age, email

### to incorporate drop-down button, radio button, checkbox and implementations
- validation for mandatory field
- data presistence across tabs
- A `Submit` button that submit the form only on the last tab

### solution files
```
// App.js

import TabForm from "./components/TabForm";
import "./styles.css";

export default function App() {
  return (
    <div className="App">
      <TabForm />
    </div>
  );
}
```

```
// styles.css

.App {
  font-family: sans-serif;
  text-align: center;
}

.heading-container {
  display: flex;
  cursor: pointer;
}

.heading {
  padding: 5px;
  border: 1px solid black;
}

.tab-body {
  display: flex;
  border: 1px solid black;
  height: 200px;
  padding: 5px;
}

.errors {
  color: red;
  display: block;
  font-size: small;
}
```

```
// TabsForm.js

import { useState } from "react";
import Interest from "./Interest";
import Profile from "./Profile";
import Settings from "./Settings";

export default TabForm = () => {
  const [data, setData] = useState({
    name: "abc",
    age: 22,
    email: "abc@gmail.com",
    interest: ["coding", "gym"],
    theme: "dark",
  });
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    {
      name: "Profile",
      component: Profile,
      validate: () => {
        const err = {};
        if (!data.name || data.name.length < 2) {
          err.name = "Name is not valid";
        }
        if (!data.age || data.age < 18) {
          err.name = "Age is not valid";
        }
        if (!data.email || data.email.length < 2) {
          err.name = "Email is not valid";
        }

        setErrors(err);
        return err.name || err.age || err.email ? false : true;
      },
    },
    {
      name: "Interest",
      component: Interest,
      validate: () => {
        const err = {};
        if (data.interest.length < 1) {
          err.interest = "select atleast one interest";
        }
        setErrors(err);
        return err.interest ? false : true;
      },
    },
    {
      name: "Settings",
      component: Settings,
      validate: () => {
        return true;
      },
    },
  ];

  const ActiveTabComponent = tabs[activeTab].component;
  const handleNextClick = () => {
    if (tabs[activeTab].validate()) setActiveTab((prev) => prev + 1);
  };
  const handlePrevClick = () => {
    if (tabs[activeTab].validate()) setActiveTab((prev) => prev - 1);
  };
  const handleSubmitClick = () => {
    console.log(data);
  };
  return (
    <div>
      <div className="heading-container">
        {tabs.map((t, index) => (
          <div
            key={index}
            className="heading"
            onClick={() => tabs[activeTab].validate() && setActiveTab(index)}
          >
            {t.name}
          </div>
        ))}
      </div>

      <div className="tab-body">
        <ActiveTabComponent data={data} setData={setData} errors={errors} />
      </div>

      <div>
        {activeTab > 0 && <button onClick={handlePrevClick}>prev</button>}
        {activeTab < tabs.length - 1 && (
          <button onClick={handleNextClick}>next</button>
        )}
        {activeTab === tabs.length - 1 && (
          <button onClick={handleSubmitClick}>Submit</button>
        )}
      </div>
    </div>
  );
};

```

```
// Profile.js

export default Profie = ({ data, setData, errors }) => {
  const { name, email, age } = data;
  const handleDataChange = (e, item) => {
    setData((prevState) => ({
      ...prevState,
      [item]: e.target.value,
    }));
  };
  return (
    <div>
      <div>
        <label>Name: </label>
        <input
          type="text"
          value={name}
          onChange={(e) => handleDataChange(e, "name")}
        />
        {errors.name && <span className="errors">{errors.name}</span>}
      </div>
      <div>
        <label>Age: </label>
        <input
          type="number"
          value={age}
          onChange={(e) => handleDataChange(e, "age")}
        />
        {errors.age && <span className="errors">{errors.age}</span>}
      </div>
      <div>
        <label>Email: </label>
        <input
          type="text"
          value={email}
          onChange={(e) => handleDataChange(e, "email")}
        />
        {errors.email && <span className="errors">{errors.email}</span>}
      </div>
    </div>
  );
};

```

```
// Interest.js

export default Interest = ({ data, setData, errors }) => {
  const { interest } = data;
  const handleDataChange = (e, name) => {
    setData((prevState) => ({
      ...prevState,
      interest: e.target.checked
        ? [...prevState.interest, e.target.name]
        : prevState.interest.filter((i) => i !== e.target.name),
    }));
  };
  return (
    <div>
      <div>
        <label>
          <input
            type="checkbox"
            name="coding"
            checked={interest.includes("coding")}
            onChange={handleDataChange}
          />
          coding
        </label>
        <label>
          <input
            type="checkbox"
            name="music"
            checked={interest.includes("music")}
            onChange={handleDataChange}
          />
          music
        </label>
        <label>
          <input
            type="checkbox"
            name="gym"
            checked={interest.includes("gym")}
            onChange={handleDataChange}
          />
          gym
        </label>
      </div>
      {errors.interest && <span className="errors">{errors.interest}</span>}
    </div>
  );
};

```

```
// Settings.js

export default Settings = ({ data, setData }) => {
  const { theme } = data;
  const handleDataChange = (e) => {
    setData((prevState) => ({
      ...prevState,
      theme: e.target.name,
    }));
  };
  return (
    <div>
      <div>
        <label>
          <input
            type="radio"
            name="dark"
            checked={theme === "dark"}
            onChange={handleDataChange}
          />
          Theme Dark
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            name="light"
            checked={theme === "light"}
            onChange={handleDataChange}
          />
          Theme Light
        </label>
      </div>
    </div>
  );
};

```

