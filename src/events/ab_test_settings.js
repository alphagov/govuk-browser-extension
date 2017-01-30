// This script is executed in the background.
//
// - It sets the appropriate request headers like `GOVUK-ABTest-NewNavigation`
// so that applications in integration, staging and development will respond
// with the correct A/B variant. It gets the current variant from the meta tags.
// - Responds to messages to change the current A/B variant. It updates the
// headers it will send and set a cookie like Fastly would.
var abTestSettings = (function() {

  var abBucketStore = chrome.extension.getBackgroundPage().abBucketStore.createStore();

  function initialize(initialBuckets, url) {
    var hostname = extractHostname(url);

    abBucketStore.addAbTests(initialBuckets, hostname);
    return abBucketStore.getAll(hostname);
  }

  function updateCookie(name, bucket, url, callback) {
    var cookieName = "ABTest-" + name;

    chrome.cookies.get({name: cookieName, url: url}, function (cookie) {
      if (cookie) {
        cookie.value = bucket;

        var updatedCookie = {
          name: cookieName,
          value: bucket,
          url: url,
          path: cookie.path,
          expirationDate: cookie.expirationDate
        };

        chrome.cookies.set(updatedCookie, callback);
      } else {
        callback();
      }
    });
  }

  function setBucket(testName, bucketName, url, callback) {
    abBucketStore.setBucket(testName, bucketName, extractHostname(url));
    updateCookie(testName, bucketName, url, callback);
  }

  function addAbHeaders(details) {
    var abTestBuckets = abBucketStore.getAll(extractHostname(details.url));

    Object.keys(abTestBuckets).map(function (abTestName) {
      details.requestHeaders.push({
        name: "GOVUK-ABTest-" + abTestName,
        value: abTestBuckets[abTestName]
      });
    });

    return {requestHeaders: details.requestHeaders};
  }

  function extractHostname(url) {
    return new URL(url).hostname;
  }

  chrome.webRequest.onBeforeSendHeaders.addListener(
    addAbHeaders,
    {urls: ["*://*.gov.uk/*"]},
    ["requestHeaders", "blocking"]
  );

  return {
    initialize: initialize,
    setBucket: setBucket
  };
}());
