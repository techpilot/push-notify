import "./App.css";
import { subscribeUser, sendNotification } from "./subscription";
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={sendNotification}>Click Here</button>
      </header>
    </div>
  );
}

export default App;
