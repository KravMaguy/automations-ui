const formInputActions = [];

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "toggleRecording") {
    isRecording = request.isRecording;
    console.log({ isRecording });
  }
});

function handleInputChange(event) {
  const input = event.target;
  console.log(
    `Input changed: ${input.name || input.id || "unnamed"} = ${input.value}`
  );
  formInputActions.push([
    `${input.name || input.id || "unnamed"}`,
    `${input.value}`,
  ]);
  // if (formInputActions.length > 15) {
  //   console.log("greater than 15");
  //   // chrome.runtime.sendMessage({ action: "download", data: jsonData });
  //   chrome.runtime.sendMessage({ action: "upload", data: formInputActions });
  // }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "toggleRecording") {
    isRecording = request.isRecording;
    // Update recording state based on message
    console.log("Content script recording state:", isRecording);
  }
});

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
