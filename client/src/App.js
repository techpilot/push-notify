import React, { useState } from "react";
import "./App.css";
import { sendNotification } from "./subscription";
function App() {
  const [valueState, setValueState] = useState("This is the initial value");

  const send = () => {
    sendNotification(valueState);
  };

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={send}>Click Here</button>
      </header>
    </div>
  );
}

export default App;
