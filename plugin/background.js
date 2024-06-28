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
    console.log("stoppin reco");
    chrome.storage.local.set({ isRecording: false });
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    console.log("tabs updated complete");
    // When a tab is updated, restore the recording state from storage
    // chrome.storage.local.get(["isRecording"], function (result) {
    //   if (result.isRecording) {
    //     console.log(1);
    //     chrome.tabs.sendMessage(tabId, { action: "restoreRecording" });
    //   }
    // });
  }
});

//stop recording if user closes the tab of the page being recorded
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  chrome.storage.local.get(["automations"], function (result) {
    const automations = result.automations || [];
    const automationIndex = automations.findIndex(
      (a) => a.status === "Recording" && a.tabId === tabId
    );
    if (automationIndex !== -1) {
      automations[automationIndex].status = null;
      chrome.storage.local.set({ automations });
      console.log(7);
      console.log("tab being removed is actively being recorded");
      // chrome.tabs.sendMessage(tabId, { action: "stopRecording" });
      chrome.storage.local.set({ isRecording: false });
    }
  });
});
