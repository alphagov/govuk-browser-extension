var Popup = Popup || {};

// Given a location, generate links to different content presentations
Popup.generateContentLinks = function(location, origin, pathname, currentEnvironment, renderingApplication) {
  var path = Popup.extractPath(location, pathname, renderingApplication);

  // If no path can be found (which means we're probably in a publishing app)
  if (!path) {
    return [];
  }

  // This is 'https://www.gov.uk' or 'https://www-origin.integration.publishing.service.gov.uk/', etc.
  if (origin == 'http://webarchive.nationalarchives.gov.uk' || origin.match(/draft-origin/) || origin.match(/support/)) {
    origin = "https://www.gov.uk"
  }

  var links = []

  // If we're on the homepage there's not much to show.
  links.push({ name: "On GOV.UK", url: origin + path })

  if (path != '/') {
    links.push({ name: "Content item (JSON)", url: origin + "/api/content" + path })
    links.push({ name: "Search data (JSON)", url: origin + "/api/search.json?filter_link=" + path })
    links.push({ name: "Info page", url: origin + "/info" + path })
    links.push({ name: "Draft (may not always work)", url: currentEnvironment.protocol + '://draft-origin.' + currentEnvironment.serviceDomain + path })
    links.push({ name: "User feedback", url: currentEnvironment.protocol + '://support.' + currentEnvironment.serviceDomain + '/anonymous_feedback?path=' + path })
  }

  links.push({ name: "National Archives", url: "http://webarchive.nationalarchives.gov.uk/*/https://www.gov.uk" + path })

  var currentUrl = origin + path;

  if (renderingApplication == "smartanswers") {
    if (currentUrl.match(/\/y\/?.*$/)) {
      linkToTemplateOnGithub = "javascript: if (typeof(linkToTemplatesOnGithub) === 'function') { linkToTemplatesOnGithub(); };"

      links.push({ name: "SmartAnswers: Display GovSpeak", url: currentUrl + ".txt"})
      links.push({ name: "SmartAnswers: Link(s) to Github", url: linkToTemplateOnGithub })
    }

    links.push({ name: "SmartAnswers: Visualise", url: currentUrl.replace(/\/y.*$/, "") + "/y/visualise" })
  }

  return links.map(function (link) {
    link.class = link.url == location ? "current" : ""
    return link;
  })
}
