(function initializeAbHeaders() {
  var abTestBuckets = {};

  function addAbHeaders(details) {
    Object.keys(abTestBuckets).map(function (abTestName) {
      details.requestHeaders.push({
        name: "GOVUK-ABTest-" + abTestName,
        value: abTestBuckets[abTestName]
      });
    });

    return {requestHeaders: details.requestHeaders};
  }

  chrome.webRequest.onBeforeSendHeaders.addListener(
    addAbHeaders,
    {urls: ["*://*.gov.uk/*"]},
    ["requestHeaders", "blocking"]
  );

  chrome.runtime.onMessage.addListener(function (request, sender) {
    if (request.action == "set-ab-bucket") {
      abTestBuckets[request.abTestName] = request.abTestBucket;
    }
  });
}());
