import "./App.css";
import { subscribeUser } from "./subscription";
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={subscribeUser}>Click Here</button>
      </header>
    </div>
  );
}

export default App;
