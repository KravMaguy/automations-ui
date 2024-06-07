import React, { useState } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const addTodo = () => {
    setTodos([...todos, inputValue]);
    setInputValue("");
  };
  const handleRecordClick = () => {
    // Check if chrome API is available
    if (window.chrome && window.chrome.runtime) {
      // Send a message to the background script
      window.chrome.runtime.sendMessage({ action: "record" }, (response) => {
        console.log(response);
      });
    }
  };

  return (
    <div>
      <h1>Todo List sfsfsdfsdf</h1>
      <button onClick={handleRecordClick}>Record</button>

      <input
        type='text'
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={addTodo}>Add Todo noq</button>
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>{todo}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
