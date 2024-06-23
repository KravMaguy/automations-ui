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
  console.log("background onMess");
  console.log("req ac: ", request);
  if (request.action === "startRecording") {
    chrome.storage.local.set({ isRecording: true });
  } else if (request.action === "stopRecording") {
    chrome.storage.local.set({ isRecording: false });
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    // When a tab is updated, restore the recording state from storage
    chrome.storage.local.get(["isRecording"], function (result) {
      if (result.isRecording) {
        chrome.tabs.sendMessage(tabId, { action: "restoreRecording" });
      }
      console.log("Value currently is " + result.isRecording);
    });
  }
});
