import React, { useState } from "react";
import { MyForm } from "./Components/MyForm";

function App({ msg, entries }) {
  const [number, setNumber] = useState("");

  return (
    <div id="main-div">
      {msg}
      <h1>{number}</h1>
      <ol>
        {entries.length
          ? entries.map((entry) => (
              <li key={entry}>
                {entry}{" "}
                <button type="button" onClick={() => setNumber(entry)}>
                  Click me
                </button>
              </li>
            ))
          : "No msgs"}
      </ol>
      <MyForm />
    </div>
  );
}

App.defaultProps = {
  entries: [1, 2, 3],
};
export default App;
