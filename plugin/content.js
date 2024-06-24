const automationStatusActions = {
  isRecording: false,
  formInputActions: [],
};

chrome.storage.local.get(["formInputActions", "isRecording"], (result) => {
  automationStatusActions.formInputActions = result.formInputActions || [];
  automationStatusActions.isRecording = result.isRecording || false;
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  let { isRecording, formInputActions } = automationStatusActions;
  if (request.action === "startRecording") {
    isRecording = true;
    chrome.storage.local.set({ isRecording });
    chrome.runtime.sendMessage({ action: "startRecording" });
    sendResponse({ status: "ok" });
  } else if (request.action === "stopRecording") {
    isRecording = false;
    chrome.storage.local.set({ isRecording }, () => {
      chrome.runtime.sendMessage({ action: "stopRecording" });
      chrome.runtime.sendMessage({
        action: "saveRecording",
        data: formInputActions,
      });
      sendResponse({ status: "ok" });
    });
  } else if (request.action === "restoreRecording") {
    isRecording = true;
    chrome.storage.local.get("formInputActions", (result) => {
      formInputActions = result.formInputActions || [];
      sendResponse({ status: "ok" });
    });
  }
  return true; // response will be sent asynchronously
  //e.g. setter and getter actions on chrome.storagelocal is like interacting with a database
});

function handleInputChange(event) {
  let { isRecording, formInputActions } = automationStatusActions;
  if (!isRecording) return;
  const input = event.target;
  console.log(
    `Input changed: ${input.name || input.id || "unnamed"} = ${input.value}`
  );
  formInputActions.push([
    `${input.name || input.id || "unnamed"}`,
    `${input.value}`,
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

observer.observe(document, {
  childList: true,
  subtree: true,
});

document
  .querySelectorAll("input, textarea, select")
  .forEach(attachEventListenersToInputs);
