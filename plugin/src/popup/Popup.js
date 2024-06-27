import React, { useState, useEffect } from "react";

function Popup() {
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    chrome.storage.local.get("isRecording", (data) => {
      setIsRecording(data.isRecording || false);
    });
  }, []);

  const handleStopRecording = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      console.log(5);
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "stopRecording" },
        (response) => {
          if (response && response.status === "ok") {
            setIsRecording(false);
            chrome.storage.local.set({ isRecording: false });
            chrome.storage.local.get("automations", (data) => {
              if (data.automations) {
                const updatedAutomations = data.automations.map((automation) =>
                  automation.status === "Recording"
                    ? { ...automation, status: null }
                    : automation
                );
                chrome.storage.local.set({ automations: updatedAutomations });
              }
            });
          }
        }
      );
    });
  };

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
      {isRecording && (
        <button onClick={handleStopRecording}>Stop Recording</button>
      )}
      <button onClick={openDashboard}>Open Dashboard</button>
    </div>
  );
}

export default Popup;
