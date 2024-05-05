// Listen for when a tab is created
console.log("background.js//runningjkhljhljkh");
console.log("servide worker");
console.log("updated...3");
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
  if (request.action === "upload") {
    console.log("Uploading data...");

    fetch("http://localhost:5000/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request.data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        sendResponse({ status: "success", message: "Data sent successfully" });
      })
      .catch((error) => {
        console.error("Error:", error);
        sendResponse({ status: "error", message: "Failed to send data" });
      });

    return true; // Keep the sendResponse callback valid for asynchronous response
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "download") {
    const jsonData = request.data;
    console.log({ jsonData });
    const blob = new Blob([jsonData], { type: "application/json" });
    console.log({ blob });
    // const url = chrome.runtime.getURL("formInputActions.json");
    // chrome.downloads.download({
    //   url: url,
    //   filename: "formInputActions.json",
    //   saveAs: true,
    // });
  }
});
