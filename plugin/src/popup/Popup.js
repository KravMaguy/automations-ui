import React, { useState } from "react";

function Popup() {
  const [isRecording, setIsRecording] = useState(false);

  const handleRecordClick = () => {
    const newRecordingState = !isRecording;
    setIsRecording(newRecordingState);
    chrome.runtime.sendMessage({
      action: "toggleRecording",
      isRecording: newRecordingState,
    });
  };

  // const openDashboard = () => {
  //   chrome.tabs.create({ url: chrome.runtime.getURL("public/dashboard.html") });
  // };
  const openDashboard = () => {
    const url = chrome.runtime.getURL("public/dashboard.html");

    chrome.tabs.query({}, function (tabs) {
      const tab = tabs.find((tab) => tab.url === url);
      if (tab) {
        chrome.tabs.update(tab.id, { active: true });
        chrome.windows.update(tab.windowId, { focused: true });
      } else {
        chrome.tabs.create({ url: url });
      }
    });
  };

  return (
    <div>
      <button onClick={handleRecordClick}>
        {isRecording ? "Stop" : "Record"}
      </button>
      <button onClick={openDashboard}>Open Dashboard</button>
    </div>
  );
}

export default Popup;
