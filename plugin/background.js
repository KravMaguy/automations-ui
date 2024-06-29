chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log(`Tab ${tabId} updated:`, changeInfo);
});

chrome.webNavigation.onCompleted.addListener((details) => {
  console.log(
    "Navigation completed for tab:",
    details.tabId,
    "URL:",
    details.url
  );
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "startRecording") {
    chrome.storage.local.set({ isRecording: true });
  } else if (request.action === "stopRecording") {
    chrome.storage.local.set({ isRecording: false });
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    chrome.storage.local.get(["isRecording"], function (result) {
      if (result.isRecording) {
        chrome.tabs.sendMessage(tabId, { action: "restoreRecording" });
      }
    });
  }
});

// Stop recording if the recorded tab is closed
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  chrome.storage.local.get(["automations"], function (result) {
    const automations = result.automations || [];
    const automationIndex = automations.findIndex(
      (a) => a.status === "Recording" && a.tabIds.includes(tabId)
    );
    if (automationIndex !== -1) {
      automations[automationIndex].status = null;
      chrome.storage.local.set({ automations });
      chrome.storage.local.set({ isRecording: false });
    }
  });
});
