console.log("popup js.....asdfasdfasdfdssasgdfgfegdfgsdf");
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
    console.log("Recording toggled:", isRecording);
  });
});
