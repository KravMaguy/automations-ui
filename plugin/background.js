chrome.runtime.onInstalled.addListener(() => {
  chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.create({ url: chrome.runtime.getURL("public/dashboard.html") });
  });
});

chrome.tabs.onCreated.addListener((tab) => {
  console.log("Tab created:", tab);
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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleRecording") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "toggleRecording",
        isRecording: request.isRecording,
      });
    });
  }
});
