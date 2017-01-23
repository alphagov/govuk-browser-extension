// This script is called by the popup, but runs inside the main thread, so it
// has access to the current page. It sends a message back to the popup with
// the information needed to render it.

chrome.runtime.sendMessage({
  action: "populatePopup",
  currentLocation: window.location,
  renderingApplication: getMetatag('govuk:rendering-application'),
  abTestBuckets: getAbTestBuckets()
});

function getMetatag(name) {
  var meta = document.getElementsByTagName('meta')[name]
  return meta && meta.getAttribute('content')
}

function getAbTestBuckets() {
  var abMetaTags = document.getElementsByTagName('meta');

  var abMetaTagPattern = /govuk:ab-test:([\w-]+):current-bucket/;

  return Object.keys(abMetaTags).filter(function (tagName) {
    return tagName.match(abMetaTagPattern);
  }).reduce(function (abTags, tagName) {
    var abTestName = abMetaTagPattern.exec(tagName)[1];
    abTags[abTestName] = abMetaTags[tagName].getAttribute('content');
    return abTags;
  }, {});
}
