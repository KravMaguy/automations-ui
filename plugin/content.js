document.addEventListener("click", function (event) {
  if (!recording) return;
  let element = event.target;
  let action = {
    type: "click",
    tagName: element.tagName,
    id: element.id,
    classNames: element.className,
    xpath: getXPathForElement(element),
  };
  actions.push(action);
});

document.addEventListener("change", function (event) {
  if (!recording) return;
  let element = event.target;
  let action = {
    type: "input",
    tagName: element.tagName,
    id: element.id,
    classNames: element.className,
    xpath: getXPathForElement(element),
    value: element.value,
  };
  actions.push(action);
});

function getXPathForElement(el) {
  var xpath = "";
  while (el && el.nodeType === 1) {
    var key = el.tagName;
    xpath = key + (xpath ? "/" + xpath : "");
    el = el.parentNode;
  }
  return xpath;
}
