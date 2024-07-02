import React, { useState, useEffect } from "react";

function App() {
  const [automations, setAutomations] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [urlValue, setUrlValue] = useState("https://www.");
  const [usedNames, setUsedNames] = useState({});

  useEffect(() => {
    // Load the automations from storage
    chrome.storage.local.get("automations", (data) => {
      console.log("onMount");
      if (data.automations) {
        setAutomations(data.automations);
        const names = {};
        data.automations.forEach((automation) => {
          names[automation.name] = true;
        });
        setUsedNames({ names });
      }
    });

    // Listen for updates to the automations in storage
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === "local" && changes.automations) {
        console.log("storage changed");
        setAutomations(changes.automations.newValue);
      }
    });
  }, []);

  useEffect(() => {
    console.log("usedNames", { usedNames });
    console.log("automations UEffect", { automations });
  }, [usedNames, automations]);

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
    if (usedNames?.[inputValue]) {
      return alert(
        "Automation name already exists. Please enter a unique name."
      );
    }

    const newAutomations = [
      ...automations,
      { name: inputValue, url: urlValue, status: null, tabIds: [] },
    ];
    setAutomations(newAutomations);
    setUsedNames({ ...usedNames, [inputValue]: true });
    setInputValue("");
    setUrlValue("https://www.");
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
    chrome.storage.local.get("isRecording", (data) => {
      if (data.isRecording) {
        alert("Another automation is currently being recorded");
      } else {
        const automationToRecord = automations[index];
        chrome.tabs.create({ url: automationToRecord.url }, (newTab) => {
          const listener = (tabId, changeInfo, tab) => {
            if (tabId === newTab.id && changeInfo.status === "complete") {
              chrome.tabs.onUpdated.removeListener(listener);
              chrome.tabs.sendMessage(
                newTab.id,
                {
                  action: "startRecording",
                  automationName: automationToRecord.name,
                  tabId: newTab.id,
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
                    const updatedAutomations = automations.map(
                      (automation, i) =>
                        i === index
                          ? {
                              ...automation,
                              status: "Recording",
                              tabIds: [...automation.tabIds, newTab.id],
                            }
                          : automation
                    );
                    setAutomations(updatedAutomations);
                    chrome.storage.local.set({
                      automations: updatedAutomations,
                    });
                    console.log(
                      `Recording started successfully in the new tab ${newTab.id}`
                    );
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
      }
    });
  };

  const printStateStorage = () => {
    chrome.storage.local.get(null, function (items) {
      console.log(items);
    });
  };

  const handlePlay = (event, idx) => {
    event.preventDefault();
    chrome.storage.local.get(["formInputActions"], function (result) {
      if (result) {
        const relevantActions = [];
        for (let i = 0; i < automations[idx].tabIds.length; i++) {
          for (let j = 0; j < result.formInputActions.length; j++) {
            if (automations[idx].tabIds[i] === result.formInputActions[j][2]) {
              relevantActions.push(result.formInputActions[j]);
            }
          }
        }
        console.log(relevantActions);
        fetch("http://localhost:5000/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(relevantActions),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Success:", data);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      } else console.log("no result");
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
      <button onClick={printStateStorage}>Print State</button>
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
          {automations?.map((automation, index) => (
            <tr key={index}>
              <td>{automation.name}</td>
              <td>{automation.url}</td>
              {/* render a button instead of just play te  */}
              <td>
                {automation.tabIds.length > 0 ? (
                  <button onClick={(e) => handlePlay(e, index)}> Play</button>
                ) : (
                  automation.status
                )}
              </td>
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
