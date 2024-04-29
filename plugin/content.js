// const formInputActions = [];

function handleInputChange(event) {
  const input = event.target;
  console.log(
    `Input changed: ${input.name || input.id || "unnamed"} = ${input.value}`
  );
  // formInputActions.push([
  //   `${input.name || input.id || "unnamed"}`,
  //   `${input.value}`,
  // ]);
  // if (formInputActions.length > 20) {
  //   console.log("reached");
  //   const jsonData = JSON.stringify(formInputActions);
  //   console.log(jsonData);
  // let blob = new Blob([jsonData], { type: "application/json" });
  // chrome.downloads.download({
  //   url: URL.createObjectURL(blob),
  //   filename: "formInputActions.json",
  //   saveAs: true,
  // });
  // }
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
