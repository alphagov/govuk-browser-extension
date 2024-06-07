var Popup = Popup || {}

// Extract the relevant path from a location, such as `/foo` from URLs like
// `www.gov.uk/foo` and `www.gov.uk/api/content/foo`.
Popup.extractPath = function (location, pathname, renderingApplication) {
  var extractedPath

  if (location.includes('api/content')) {
    extractedPath = pathname.replace('api/content/', '')
  } else if (location.includes('anonymous_feedback')) {
    extractedPath = extractQueryParameter(location, 'path')
  } else if (location.includes('content-data')) {
    extractedPath = pathname.replace('metrics/', '')
  } else if (location.includes('nationalarchives.gov.uk')) {
    extractedPath = pathname.split('https://www.gov.uk')[1]
  } else if (location.includes('api/search.json')) {
    extractedPath = extractQueryParameter(location, 'filter_link')
  } else if (location.includes('info')) {
    extractedPath = pathname.replace('info/', '')
  } else if (/api.*\.json/.test(location)) {
    extractedPath = pathname.replace('api/', '').replace('.json', '')
  } else if (location.includes('visualise')) {
    extractedPath = pathname.replace('/y/visualise', '')
  } else if (/www|draft-origin/.test(location)) {
    extractedPath = pathname
  }

  if (extractedPath) {
    return extractedPath.replace('//', '/')
  }

  function extractQueryParameter (location, parameterName) {
    return location.split(parameterName + '=')[1].split('&')[0]
  }
}
