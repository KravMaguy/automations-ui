import React, { useState, useEffect } from "react";

function App() {
  const [automations, setAutomations] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    // Load the automations from storage
    chrome.storage.local.get("automations", (data) => {
      if (data.automations) {
        setAutomations(data.automations);
      }
    });

    // Listen for updates to the automations in storage
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === "local" && changes.automations) {
        setAutomations(changes.automations.newValue);
      }
    });
  }, []);

  const addAutomation = () => {
    const newAutomations = [...automations, { name: inputValue, status: null }];
    setAutomations(newAutomations);
    setInputValue("");
    chrome.storage.local.set({ automations: newAutomations });
  };

  const handleRecordClick = (index) => {
    const automationToRecord = automations[index];

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
              } else if (response && response.status === "ok") {
                const updatedAutomations = automations.map((automation, i) =>
                  i === index
                    ? { ...automation, status: "Recording" }
                    : automation
                );
                setAutomations(updatedAutomations);
                chrome.storage.local.set({ automations: updatedAutomations });
                console.log("Recording started successfully in the new tab");
              } else {
                console.error("Unexpected response:", response);
                alert("Unexpected response from content script");
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
