// Listen for when a tab is created
console.log("background.js//runningjkhljhljkh");
console.log("servide worker");
console.log("updated...");
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
