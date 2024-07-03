let isRecording = false;
let formInputActions = [];
let currentTabId = null;

chrome.storage.local.get(
  ["formInputActions", "isRecording", "currentTabId"],
  (result) => {
    formInputActions = result.formInputActions || [];
    isRecording = result.isRecording || false;
    currentTabId = result.currentTabId || null;
  }
);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "startRecording") {
    isRecording = true;
    currentTabId = request.tabId;
    chrome.storage.local.set({ isRecording, currentTabId });
    sendResponse({ status: "ok" });
  } else if (request.action === "stopRecording") {
    isRecording = false;
    chrome.storage.local.set({ isRecording, currentTabId: null }, () => {
      chrome.runtime.sendMessage({ action: "stopRecording" });
      chrome.runtime.sendMessage({
        action: "saveRecording",
        data: formInputActions,
      });
      sendResponse({ status: "ok" });
    });
  }
  return true; // response will be sent asynchronously
});

function handleInputChange(event) {
  if (!isRecording) return;
  const input = event.target;
  formInputActions.push([
    `${input.name || input.id || "unnamed"}`,
    `${input.value}`,
    currentTabId,
  ]);
  chrome.storage.local.set({ formInputActions }); // Save to storage
}

function attachEventListenersToInputs(inputElement) {
  inputElement.addEventListener("input", handleInputChange);
}

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.matches("input, textarea, select")) {
          attachEventListenersToInputs(node);
        } else {
          const inputs = node.querySelectorAll("input, textarea, select");
          inputs.forEach(attachEventListenersToInputs);
        }
      }
    });
  });
});

document.addEventListener("click", function (event) {
  if (
    event.target.tagName === "BUTTON" ||
    (event.target.tagName === "INPUT" && event.target.type === "submit")
  ) {
    const buttonType = event.target.type || "button";
    const buttonName = event.target.name || "Unnamed";
    const buttonInnerText =
      event.target.innerText || event.target.value || "No Text";

    console.log("Button clicked:");
    console.log("Type:", buttonType);
    console.log("Name:", buttonName);
    console.log("Text:", buttonInnerText);
  }
});
console.log("content.js 1");
observer.observe(document, {
  childList: true,
  subtree: true,
});

document
  .querySelectorAll("input, textarea, select")
  .forEach(attachEventListenersToInputs);
