var Popup = Popup || {}

Popup.findAssetParentPage = function (currentUrl) {
  var links = []

  var assetUrlPattern = /^https:\/\/assets\.(staging\.|integration\.)?publishing\.service\.gov\.uk\//
  if (!assetUrlPattern.test(currentUrl)) {
    return links
  }

  // Make a synchronous GET request to the current page
  var req = new XMLHttpRequest()
  req.open('GET', currentUrl, false)
  req.send(null)

  // Look for the "link" header with rel="up"
  var headers = req.getAllResponseHeaders()
  var match = headers.match(/link: <(.*)>; rel="up"/)

  // Extract the URL and store that as a link
  if (match && match[1]) {
    links.push({
      name: 'Find parent page for this asset',
      url: match[1]
    })
  }

  return links
}
