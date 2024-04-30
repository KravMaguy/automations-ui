// Listen for when a tab is created
console.log("background.js//runningjkhljhljkh");
console.log("servide worker");
console.log("updated...2");
chrome.tabs.onCreated.addListener((tab) => {
  console.log("Tab created:", tab);
});

// Listen for when a tab is updated
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log(`Tab ${tabId} updated:`, changeInfo);
});

// Listen for web navigation
chrome.webNavigation.onCompleted.addListener((details) => {
  console.log(
    "Navigation completed for tab:",
    details.tabId,
    "URL:",
    details.url
  );
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "download") {
    const jsonData = request.data;
    console.log({ jsonData });
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = chrome.runtime.getURL("formInputActions.json");
    chrome.downloads.download({
      url: url,
      filename: "formInputActions.json",
      saveAs: true,
    });
  }
});
