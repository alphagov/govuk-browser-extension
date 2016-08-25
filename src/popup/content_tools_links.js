var Popup = Popup || {};

// Contains links to content tools like SmartAnswers etc.
Popup.generateContentToolsLinks = function(renderingApplication, env) {
  var links = [];

  if (renderingApplication == "smartanswers") {
    links.push(
      { name: "SmartAnswers: Display GovSpeak", url: env.url + ".txt"}
    );
  }

  return links;
}
