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
  } else {
    sendResponse({ status: "unknown action" });
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
  if (!isRecording) return;
  if (
    event.target.tagName === "BUTTON" ||
    (event.target.tagName === "INPUT" && event.target.type === "submit")
  ) {
    const buttonClass = event.target.class || "No Class";
    const buttonVal = event.target.value || "No Value";
    const buttonType = event.target.type || "button";
    const buttonName = event.target.name || "Unnamed";
    const buttonInnerText =
      event.target.innerText || event.target.value || "No Text";

    console.log("forminputactions before push", formInputActions);
    // Extract the last Id from the last element of formInputActions
    const lastElement = formInputActions[formInputActions.length - 1];
    const currentTabID = lastElement
      ? lastElement[lastElement.length - 1]
      : undefined;
    if (currentTabID) {
      console.log("there is a tabId");
      formInputActions.push([
        buttonName,
        buttonVal,
        buttonType,
        buttonInnerText,
        currentTabID,
      ]);
      chrome.storage.local.set({ formInputActions }); // Save to storage
    } else {
      console.log("User tried to submit a form without filling any values");
    }
  }
});

observer.observe(document, {
  childList: true,
  subtree: true,
});

document
  .querySelectorAll("input, textarea, select")
  .forEach(attachEventListenersToInputs);
