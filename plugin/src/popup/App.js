import React, { useState } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [recording, setIsRecording] = useState(false);

  const addTodo = () => {
    setTodos([...todos, inputValue]);
    setInputValue("");
  };
  const handleRecordClick = () => {
    setIsRecording(!recording);
    console.log({ recording });
    if (window.chrome && window.chrome.runtime) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs[0].status === "complete") {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: "toggleRecording",
            isRecording: recording,
          });
        }
      });
    }
  };

  return (
    <div>
      <h1>Todo List #12</h1>
      <button onClick={handleRecordClick}>
        {recording ? "Record" : "Stop Record"}
      </button>

      <input
        type='text'
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={addTodo}>Add Todo</button>
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>{todo}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
