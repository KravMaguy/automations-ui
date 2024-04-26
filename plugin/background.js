let recording = false;
let actions = [];

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "startRecording") {
    recording = true;
    actions = []; // Clear previous actions
  } else if (request.action === "stopRecording") {
    recording = false;
    chrome.storage.local.set({ actions: actions }, function () {
      console.log("Actions saved");
    });
  } else if (request.action === "reproduceActions") {
    chrome.storage.local.get("actions", function (data) {
      chrome.tabs.create({ url: "about:blank" }, function (tab) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["reproducer.js"],
        });
      });
    });
  }
});
