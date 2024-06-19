console.log("Contkyoiuyoiu&&&&&");

let isRecording = false;
const formInputActions = [];

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("Content script received message:", request);

  if (request.action === "startRecording") {
    isRecording = true;
    formInputActions.length = 0;
    chrome.runtime.sendMessage({ action: "startRecording" });
    console.log("Recording started");
    sendResponse({ status: "ok" });
  } else if (request.action === "stopRecording") {
    isRecording = false;
    chrome.runtime.sendMessage({ action: "stopRecording" });
    chrome.runtime.sendMessage({
      action: "saveRecording",
      data: formInputActions,
    });
    console.log("Recording stopped");
    sendResponse({ status: "ok" });
  }

  return true; // Indicates that the response is sent asynchronously
});

function handleInputChange(event) {
  console.log("handleInputChange");
  console.log({ isRecording });
  if (!isRecording) return;

  const input = event.target;
  console.log(
    `Input changed: ${input.name || input.id || "unnamed"} = ${input.value}`
  );
  formInputActions.push([
    `${input.name || input.id || "unnamed"}`,
    `${input.value}`,
  ]);
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
