var Popup = Popup || {};

// Contains links to content tools like SmartAnswers etc.
Popup.generateContentToolsLinks = function(renderingApplication, env) {
  var links = [];

  if (renderingApplication == "smartanswers") {
    if (isNotSmartAnswerLandingPage(env.url)) {
      links.push(
        { name: "SmartAnswers: Display GovSpeak", url: env.url + ".txt"}
      );
    }

    links.push(
      { name: "SmartAnswers: Visualise", url: env.url.replace(/\/y.*$/, "") + "/visualise" }
    );
  }

  return links;
}

function isNotSmartAnswerLandingPage(url) {
  return url.match(/\/y\/?.*$/);
}
