var Popup = Popup || {};

// Given a location, generate links to different content presentations
Popup.generateContentLinks = function(location, currentEnvironment, renderingApplication) {
  var path = Popup.extractPath(location, renderingApplication);

  // If no path can be found (which means we're probably in a publishing app)
  if (!path) {
    return [];
  }

  // This is 'https://www.gov.uk' or 'https://www-origin.integration.publishing.service.gov.uk/', etc.
  var originHost = location.origin;

  if (originHost == 'http://webarchive.nationalarchives.gov.uk' || originHost.match(/draft-origin/) || originHost.match(/support/)) {
    originHost = "https://www.gov.uk"
  }

  var links = []

  // If we're on the homepage there's not much to show.
  links.push({ name: "On GOV.UK", url: originHost + path })

  if (path != '/') {
    links.push({ name: "Content item (JSON)", url: originHost + "/api/content" + path })
    links.push({ name: "Search data (JSON)", url: originHost + "/api/search.json?filter_link=" + path })
    links.push({ name: "Info page", url: originHost + "/info" + path })
    links.push({ name: "Draft (may not always work)", url: currentEnvironment.protocol + '://draft-origin.' + currentEnvironment.serviceDomain + path })
    links.push({ name: "User feedback", url: currentEnvironment.protocol + '://support.' + currentEnvironment.serviceDomain + '/anonymous_feedback?path=' + path })
  }

  links.push({ name: "National Archives", url: "http://webarchive.nationalarchives.gov.uk/*/https://www.gov.uk" + path })

  var currentUrl = originHost + path;

  if (renderingApplication == "smartanswers") {
    if (currentUrl.match(/\/y\/?.*$/)) {
      links.push({ name: "SmartAnswers: Display GovSpeak", url: currentUrl + ".txt"})
    }

    links.push({ name: "SmartAnswers: Visualise", url: currentUrl.replace(/\/y.*$/, "") + "/visualise" })
  }

  return links.map(function (link) {
    link.class = link.url == location.href ? "current" : ""
    return link;
  })
}
