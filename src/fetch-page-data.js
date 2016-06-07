// This script is called by the popup, but runs inside the main thread, so it
// has access to the current page. It sends a message back to the popup with
// the information needed to render it.

chrome.runtime.sendMessage({
  action: "populatePopup",
  currentLocation: window.location
});
