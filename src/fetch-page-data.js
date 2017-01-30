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
  var abMetaTags = document.querySelectorAll('meta[name="govuk:ab-test"]');

  var metaTagPattern = /([\w-]+):([\w-]+)/;
  var buckets = {};

  abMetaTags.forEach(function (metaTag) {
    var testNameAndBucket = metaTagPattern.exec(metaTag.content);
    buckets[testNameAndBucket[1]] = testNameAndBucket[2];
  });

  return buckets;
}
