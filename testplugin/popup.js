document.getElementById("showValues").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: displayFormValues,
    });
  });
});

function displayFormValues() {
  const formElements = document.querySelectorAll(
    "form input, form select, form textarea"
  );
  const values = Array.from(formElements).map(
    (el) => `${el.name || el.id}: ${el.value}`
  );
  alert("Form Values:\n" + values.join("\n"));
}
