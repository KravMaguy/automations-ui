import React, { useState } from "react";

function App() {
  const [automations, setAutomations] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const addAutomation = () => {
    setAutomations([...automations, { name: inputValue, status: "Url" }]);
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

  const handlePopupClick = () => {
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
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
            <th>Start Url</th>
          </tr>
        </thead>
        <tbody>
          {automations.map((automation, index) => (
            <tr key={index}>
              <td>{automation.name}</td>
              <td>{automation.status}</td>
              <td>
                {automation.url ? (
                  <button
                    onClick={() => handleRecordClick(index)}
                    disabled={automation.status === "Recording"}
                  >
                    Record
                  </button>
                ) : (
                  ""
                )}
              </td>
              <td>
                {automation.url ? (
                  automation.url
                ) : (
                  <button onClick={() => setShowPopup(true)}>+</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showPopup && (
        <div
          className='popup'
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <input type='text' placeholder='Automation Url' />
          <button onClick={handlePopupClose}>Close</button>
        </div>
      )}
    </div>
  );
}

export default App;
