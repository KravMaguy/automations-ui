import React, { useState, useEffect } from "react";

function App() {
  const [automations, setAutomations] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [urlValue, setUrlValue] = useState("");

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
    if (!inputValue || !urlValue) {
      alert("Please enter a name and URL for the automation");
      return;
    }

    try {
      new URL(urlValue);
    } catch (_) {
      alert("Invalid URL. Please enter a valid URL.");
      return;
    }

    const newAutomations = [
      ...automations,
      { name: inputValue, url: urlValue, status: null },
    ];
    setAutomations(newAutomations);
    setInputValue("");
    setUrlValue("");
    chrome.storage.local.set({ automations: newAutomations });
  };

  const removeAutomation = (index) => {
    if (automations[index].status === "Recording") {
      alert(
        "Cannot remove an automation during recording, stop recording to delete the automation"
      );
      return;
    }
    const filteredAnimation = automations.filter((_, i) => i !== index);
    setAutomations(filteredAnimation);
    chrome.storage.local.set({ automations: filteredAnimation });
  };

  const handleRecordClick = (index) => {
    const automationToRecord = automations[index];
    chrome.tabs.create({ url: automationToRecord.url }, (newTab) => {
      const listener = (tabId, changeInfo, tab) => {
        console.log({ tab });
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
        placeholder='Automation Name'
      />
      <input
        type='text'
        value={urlValue}
        onChange={(e) => setUrlValue(e.target.value)}
        placeholder='URL'
      />
      <button onClick={addAutomation}>Add Automation</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>URL</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {automations.map((automation, index) => (
            <tr key={index}>
              <td>{automation.name}</td>
              <td>{automation.url}</td>
              <td>{automation.status}</td>
              <td>
                <button
                  onClick={() => handleRecordClick(index)}
                  disabled={automation.status === "Recording"}
                >
                  Record
                </button>
              </td>
              <td>
                <button
                  onClick={() => removeAutomation(index)}
                  disabled={false}
                >
                  -
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
