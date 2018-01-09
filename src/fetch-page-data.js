// This script is called by the popup, but runs inside the main thread, so it
// has access to the current page. It sends a message back to the popup with
// the information needed to render it.

chrome.runtime.sendMessage({
  action: "populatePopup",
  currentLocation: window.location.href,
  currentHost: window.location.host,
  currentOrigin: window.location.origin,
  currentPathname: window.location.pathname,
  renderingApplication: getMetatag('govuk:rendering-application'),
  abTestBuckets: getAbTestBuckets(),
  highlightState: window.highlightComponent.state
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
    var testName = testNameAndBucket[1];
    var currentBucket = testNameAndBucket[2];
    var allowedBuckets =
      (metaTag.dataset.allowedVariants || "A,B").split(",");

    buckets[testName] = {
      currentBucket: currentBucket,
      allowedBuckets: allowedBuckets
    }
  });

  return buckets;
}

undefined;
