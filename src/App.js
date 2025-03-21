import './App.css';
import React, { useState } from 'react';

function App() {
  let [count, setCount] = useState(0);
  const clickOnMe = () => {
    setCount(count+1);
  }
  
  return (
    <div className="App">
      <h1>My app React</h1>
      <button onClick={clickOnMe}>Click me</button>
      <span data-testid="count">{count}</span>
    </div>
  );
}

export default App;
