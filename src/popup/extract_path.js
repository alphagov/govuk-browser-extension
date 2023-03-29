var Popup = Popup || {};

// Extract the relevant path from a location, such as `/foo` from URLs like
// `www.gov.uk/foo` and `www.gov.uk/api/content/foo`.
Popup.extractPath = function(location, pathname, renderingApplication) {
  var extractedPath;

  if (location.match(/api\/content/)) {
    extractedPath = pathname.replace('api/content/', '');
  }
  else if (location.match(/anonymous_feedback/)) {
    extractedPath = extractQueryParameter(location, 'path');
  }
  else if (location.match(/content-data/)) {
    extractedPath = pathname.replace('metrics/', '');;
  }
  else if (location.match(/nationalarchives.gov.uk/)) {
    extractedPath = pathname.split('https://www.gov.uk')[1];
  }
  else if (location.match(/api\/search.json/)) {
    extractedPath = extractQueryParameter(location, 'filter_link');
  }
  else if (location.match(/info/)) {
    extractedPath = pathname.replace('info/', '');
  }
  else if (location.match(/api.*\.json/)) {
    extractedPath = pathname.replace('api/', '').replace('.json', '');
  }
  else if (location.match(/visualise/)) {
    extractedPath = pathname.replace('/y/visualise', '');
  }
  else if (location.match(/www/) || location.match(/draft-origin/)) {
    extractedPath = pathname;
  }

  if (extractedPath) {
    return extractedPath.replace('//', '/');
  }

  function extractQueryParameter(location, parameter_name) {
    return location.split(parameter_name + '=')[1].split('&')[0];
  }
}
