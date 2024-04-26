document.getElementById("startBtn").addEventListener("click", function () {
  chrome.runtime.sendMessage({ action: "startRecording" });
});

document.getElementById("stopBtn").addEventListener("click", function () {
  chrome.runtime.sendMessage({ action: "stopRecording" });
});

document.getElementById("reproduceBtn").addEventListener("click", function () {
  chrome.runtime.sendMessage({ action: "reproduceActions" });
});
