import React, { useState, useEffect } from "react";

function Popup() {
  const [isRecording, setIsRecording] = useState(false);
  const [isAutomationPage, setIsAutomationPage] = useState(false);

  useEffect(() => {
    chrome.storage.local.get("isRecording", (data) => {
      setIsRecording(data.isRecording || false);
    });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0].url;
      // Update this condition to match your automation page URL pattern
      const automationPagePattern = "chrome-extension://";
      setIsAutomationPage(url.includes(automationPagePattern));
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
      {isRecording && !isAutomationPage && (
        <button onClick={handleStopRecording}>Stop Recording</button>
      )}
      <button onClick={openDashboard}>Open Dashboard</button>
    </div>
  );
}

export default Popup;
