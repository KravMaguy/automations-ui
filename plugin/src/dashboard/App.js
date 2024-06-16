import React, { useState } from "react";

function App() {
  const [automations, setAutomations] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const addAutomation = () => {
    setAutomations([...automations, { name: inputValue, status: null }]);
    setInputValue("");
  };

  const handleRecordClick = (index) => {
    const updatedAutomations = automations.map((automation, i) =>
      i === index
        ? {
            ...automation,
            status: automation.status === "Recording" ? "Play" : "Recording",
          }
        : automation
    );
    setAutomations(updatedAutomations);
  };

  return (
    <div>
      <h1>Automations</h1>
      <input
        type='text'
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={addAutomation}>Add Automation</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {automations.map((automation, index) => (
            <tr key={index}>
              <td>{automation.name}</td>
              <td>{automation.status}</td>
              <td>
                <button onClick={() => handleRecordClick(index)}>
                  {automation.status === "Recording" ? "Stop" : "Record"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
