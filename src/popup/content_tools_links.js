var Popup = Popup || {};

// Contains links to content tools like SmartAnswers etc.
Popup.generateContentToolsLinks = function(contentStoreURL, env) {
  var links = [];
  var baseURL = contentStoreURL.replace(/\/y\/?.*/, '');
  var contentItem = {}
  $.ajaxSetup({ async: false });
  $.getJSON(baseURL, function(contentStoreData) {
    contentItem = contentStoreData;
    if (contentItem.rendering_app == "smartanswers") {
      links.push(
        { name: "SmartAnswers: Display GovSpeak", url: env.url + ".txt"},
        { name: "SmartAnswers: Display Visualise", url: env.host + contentItem.base_path + "/visualise"}
      );
    }
  });
  return { contentItem: contentItem, links: links };
}
