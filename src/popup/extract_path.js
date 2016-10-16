var Popup = Popup || {};

// Extract the relevant path from a location, such as `/foo` from URLs like
// `www.gov.uk/foo` and `www.gov.uk/api/content/foo`.
Popup.extractPath = function(location, renderingApplication) {
  var extractedPath;

  if (location.href.match(/api\/content/)) {
    extractedPath = location.pathname.replace('api/content/', '');
  }
  else if (location.href.match(/anonymous_feedback/)) {
    extractedPath = location.href.split('path=')[1];
  }
  else if (location.href.match(/nationalarchives.gov.uk/)) {
    extractedPath = location.pathname.split('https://www.gov.uk')[1];
  }
  else if (location.href.match(/api\/search.json/)) {
    extractedPath = location.href.split('filter_link=')[1];
  }
  else if (location.href.match(/info/)) {
    extractedPath = location.pathname.replace('info/', '');
  }
  else if (location.href.match(/api.*\.json/)) {
    extractedPath = location.pathname.replace('api/', '').replace('.json', '');
  }
  else if (location.href.match(/www/) || location.href.match(/draft-origin/)) {
    extractedPath = location.pathname;
  }

  if (extractedPath) {
    return extractedPath.replace('//', '/');
  }
}
