chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
  chrome.tabs.query({}, (tabs) => {
    for (let tab of tabs) {
      if (!tab.url.startsWith("chrome://")) {
        chrome.scripting.executeScript(
          {
            target: { tabId: tab.id },
            files: ["content.js"],
          },
          () => {
            if (chrome.runtime.lastError) {
              console.error(
                `Error injecting script into tab ${tab.id}:`,
                chrome.runtime.lastError.message
              );
            } else {
              console.log(`Injected content script into tab ${tab.id}`);
            }
          }
        );
      }
    }
  });
});

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

function setRecordingIcon() {
  chrome.action.setIcon({ path: "icons/icon-recording.png" });
}

function setDefaultIcon() {
  chrome.action.setIcon({ path: "icons/icon-default.png" });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("background onMess");
  console.log("req ac: ", request);
  if (request.action === "startRecording") {
    chrome.storage.local.set({ isRecording: true });
    // setRecordingIcon();
  } else if (request.action === "stopRecording") {
    chrome.storage.local.set({ isRecording: false });
    // setDefaultIcon();
  }
});
