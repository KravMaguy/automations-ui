document.getElementById("screenshotButton").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "takeScreenshot" }, (response) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError.message);
      return;
    }
    document.getElementById("screenshot").src = response.screenshotUrl;
    document.getElementById("screenshot").style.display = "block";
  });
});
