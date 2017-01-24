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
        console.log(cookie);
        cookie.value = bucket;

        var updatedCookie = {
          name: cookieName,
          value: bucket,
          url: url,
          path: "/",
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
