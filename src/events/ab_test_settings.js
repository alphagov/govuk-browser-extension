// This script is executed in the background.
//
// - It sets the appropriate request headers like `GOVUK-ABTest-NewNavigation`
// so that applications in integration, staging and development will respond
// with the correct A/B variant. It gets the current variant from the meta tags.
// - Responds to messages to change the current A/B variant. It updates the
// headers it will send and set a cookie like Fastly would.
(function initializeAbHeaders() {
  var abTestBuckets = {};

  function areAbTestsInitialized() {
    return Object.getOwnPropertyNames(abTestBuckets).length > 0;
  }

  function initializeBuckets(initialBuckets, sendResponse) {
    if (!areAbTestsInitialized()) {
      Object.keys(initialBuckets).map(function (testName) {
        abTestBuckets[testName] = initialBuckets[testName];
      });
    }

    sendResponse(abTestBuckets);
  }

  function updateCookie(name, bucket, url) {
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

        chrome.cookies.set(updatedCookie);
      }
    });
  }

  function addAbHeaders(details) {
    Object.keys(abTestBuckets).map(function (abTestName) {
      details.requestHeaders.push({
        name: "GOVUK-ABTest-" + abTestName,
        value: abTestBuckets[abTestName]
      });
    });

    return {requestHeaders: details.requestHeaders};
  }

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "set-ab-bucket") {
      abTestBuckets[request.abTestName] = request.abTestBucket;
      updateCookie(request.abTestName, request.abTestBucket, request.url);
    } else if (request.action === "initialize-ab-buckets") {
      initializeBuckets(request.abTestBuckets, sendResponse);
    }
  });

  chrome.webRequest.onBeforeSendHeaders.addListener(
    addAbHeaders,
    {urls: ["*://*.gov.uk/*"]},
    ["requestHeaders", "blocking"]
  );
}());
