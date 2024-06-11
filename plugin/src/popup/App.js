import React, { useState } from "react";

function App() {
  console.log("app.js");
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [recording, setIsRecording] = useState(false);

  const addTodo = () => {
    setTodos([...todos, inputValue]);
    setInputValue("");
  };
  const handleRecordClick = () => {
    // Check if chrome API is available
    console.log("handle recording click");
    setIsRecording(!recording);
    console.log({ recording });
    if (window.chrome && window.chrome.runtime) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "toggleRecording",
          isRecording: recording,
        });
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
