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

      var cookieName = "ABTest-" + request.abTestName;

      chrome.cookies.get({name: cookieName, url: request.url}, function (cookie) {
        if (cookie) {
          console.log(cookie);
          cookie.value = request.abTestBucket;

          var updatedCookie = {
            name: cookieName,
            value: request.abTestBucket,
            url: request.url,
            path: "/",
            expirationDate: cookie.expirationDate
          };

          chrome.cookies.set(updatedCookie);
        }
      });
    }
  });
}());
