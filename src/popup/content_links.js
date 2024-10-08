var Popup = Popup || {}

// Given a location, generate links to different content presentations
Popup.generateContentLinks = function (location, origin, pathname, currentEnvironment, renderingApplication) {
  var path = Popup.extractPath(location, pathname, renderingApplication)

  // If no path can be found (which means we're probably in a publishing app)
  // Similarly if we're on GOVUK account, not many of the links are relevant
  if (!path || origin.includes('www.account')) {
    return []
  }

  // Origin looks like 'https://www.gov.uk' or 'https://www-origin.integration.publishing.service.gov.uk/' or similar.
  if (origin === 'http://webarchive.nationalarchives.gov.uk' ||
      /draft-origin|content-data|support/.test(origin)) {
    origin = 'https://www.gov.uk'
  }

  var links = []

  // If we're on the homepage there's not much to show.
  links.push({ name: 'On GOV.UK', url: origin + path })
  links.push({ name: 'Content item (JSON)', url: currentEnvironment.origin + '/api/content' + path })
  links.push({ name: 'Search data (JSON)', url: origin + '/api/search.json?filter_link=' + path })
  links.push({ name: 'Draft (may not always work)', url: currentEnvironment.protocol + '://draft-origin.' + currentEnvironment.serviceDomain + path })
  links.push({ name: 'User feedback', url: currentEnvironment.protocol + '://support.' + currentEnvironment.serviceDomain + '/anonymous_feedback?path=' + path })
  links.push({ name: 'National Archives', url: 'http://webarchive.nationalarchives.gov.uk/*/https://www.gov.uk' + path })
  links.push({ name: 'View data about page on Content Data', url: currentEnvironment.protocol + '://content-data.' + currentEnvironment.serviceDomain + '/metrics' + path })
  links.push({ name: 'Check for content problems in Siteimprove', url: 'https://my2.siteimprove.com/QualityAssurance/1054012/Overview/Search?SearchIn=Url&Query=' + path })
  links.push({ name: 'View structured data', url: 'https://search.google.com/structured-data/testing-tool/u/0/#url=https://www.gov.uk' + path })

  var currentUrl = origin + path

  if (renderingApplication === 'smartanswers') {
    links.push({ name: 'SmartAnswers: Visualise', url: currentUrl.replace(/\/y.*$/, '') + '/y/visualise' })
  }

  return links.map(function (link) {
    link.class = link.url === location ? 'current' : ''
    return link
  })
}
