document.addEventListener("DOMContentLoaded", function () {
  console.log("dom content loaded");
  const recordButton = document.getElementById("recordButton");
  let isRecording = false;

  recordButton.addEventListener("click", function () {
    isRecording = !isRecording;
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "toggleRecording",
        isRecording: isRecording,
      });
    });
    if (!isRecording) {
      recordButton.innerHTML = "Start Recording";
    } else {
      recordButton.innerHTML = "Stop Recording";
    }
    console.log("Recording toggled:", isRecording);

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "toggleRecording",
        isRecording: isRecording,
      });
    });
  });
});
