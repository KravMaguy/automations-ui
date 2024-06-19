import React, { useState } from "react";

function App() {
  const [automations, setAutomations] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const addAutomation = () => {
    setAutomations([...automations, { name: inputValue, status: null }]);
    setInputValue("");
  };

  const handleRecordClick = (index) => {
    const automationToRecord = automations[index];
    console.log({ automations });
    const updatedAutomations = automations.map((automation, i) =>
      i === index ? { ...automation, status: "Recording" } : automation
    );

    setAutomations(updatedAutomations);

    chrome.tabs.create({ url: "https://www.google.com" }, (newTab) => {
      const listener = (tabId, changeInfo, tab) => {
        if (tabId === newTab.id && changeInfo.status === "complete") {
          chrome.tabs.onUpdated.removeListener(listener);

          chrome.tabs.sendMessage(
            newTab.id,
            {
              action: "startRecording",
              automationName: automationToRecord.name,
            },
            (response) => {
              if (chrome.runtime.lastError) {
                console.error(
                  "Error starting recording:",
                  chrome.runtime.lastError
                );
                alert(
                  `Failed to start recording: ${chrome.runtime.lastError.message}`
                );
                setAutomations((prevState) => {
                  console.log("Automations before update:", prevState);

                  const newState = prevState.map((automation, i) =>
                    i === index ? { ...automation, status: null } : automation
                  );
                  console.log("Automations after update:", newState);
                  return newState;
                });
              } else if (response && response.status === "ok") {
                console.log("Recording started successfully in the new tab");
              } else {
                console.error("Unexpected response:", response);
                alert("Unexpected response from content script");
                setAutomations((prevState) =>
                  prevState.map((automation, i) =>
                    i === index ? { ...automation, status: null } : automation
                  )
                );
              }
            }
          );
        }
      };

      chrome.tabs.onUpdated.addListener(listener);
    });
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
                <button
                  onClick={() => handleRecordClick(index)}
                  disabled={automation.status === "Recording"}
                >
                  Record
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
