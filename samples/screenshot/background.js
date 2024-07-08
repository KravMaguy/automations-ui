chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "takeScreenshot") {
    chrome.tabs.captureVisibleTab(null, {}, (image) => {
      sendResponse({ screenshotUrl: image });
    });
    return true; // Keeps the message channel open for the response.
  }
});
