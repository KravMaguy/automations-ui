let isRecording = false;
let formInputActions = [];

chrome.storage.local.get(["formInputActions", "isRecording"], (result) => {
  formInputActions = result.formInputActions || [];
  isRecording = result.isRecording || false;
  console.log("Restored formInputActions:", formInputActions);
  console.log("Restored isRecording:", isRecording);
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "startRecording") {
    isRecording = true;
    chrome.storage.local.set({ isRecording });
    chrome.runtime.sendMessage({ action: "startRecording" });
    console.log("Recording started");
    sendResponse({ status: "ok" });
  } else if (request.action === "stopRecording") {
    isRecording = false;
    chrome.storage.local.set({ isRecording }, () => {
      chrome.runtime.sendMessage({ action: "stopRecording" });
      chrome.runtime.sendMessage({
        action: "saveRecording",
        data: formInputActions,
      });
      console.log("Recording stopped");
      sendResponse({ status: "ok" });
    });
    return true; // Indicate that the response will be sent asynchronously
  } else if (request.action === "restoreRecording") {
    isRecording = true;
    chrome.storage.local.get("formInputActions", (result) => {
      formInputActions = result.formInputActions || [];
      console.log(
        "Restored formInputActions after restoreRecording:",
        formInputActions
      );
      sendResponse({ status: "ok" });
    });
    return true; // Indicate that the response will be sent asynchronously
  }
});

function handleInputChange(event) {
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
