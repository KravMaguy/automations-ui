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

  const openDashboard = () => {
    chrome.tabs.create({ url: chrome.runtime.getURL("public/dashboard.html") });
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
