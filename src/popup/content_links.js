var Popup = Popup || {};

// Given a location, generate links to different content presentations
Popup.generateContentLinks = function(location) {
  var path = Popup.extractPath(location);

  // If no path can be found (which means we're probably in a publishing app)
  if (!path) {
    return [];
  }

  // If we're on the homepage there's not much to show.
  if (path == '/') {
    return [];
  }

  // This is 'https://www.gov.uk' or 'https://www-origin.integration.publishing.service.gov.uk/', etc.
  var originHost = location.origin;

  if (originHost == 'http://webarchive.nationalarchives.gov.uk') {
    originHost = "https://www.gov.uk"
  }

  var links = [
    { name: "On GOV.UK", url: originHost + path },
    { name: "Content item (JSON)", url: originHost + "/api/content" + path },
    { name: "Search data (JSON)", url: originHost + "/api/search.json?filter_link=" + path },
    { name: "Info page (not always available)", url: originHost + "/info" + path },
    { name: "Content API (JSON, deprecated)", url: originHost + "/api" + path + ".json" },
    { name: "National Archives", url: "http://webarchive.nationalarchives.gov.uk/*/https://www.gov.uk" + path },
  ]

  return links.map(function (link) {
    link.class = link.url == location.href ? "current" : ""
    return link;
  })
}
