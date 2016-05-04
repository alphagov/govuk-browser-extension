var Popup = {};

// This is the view object. It takes a location and the name of the rendering
// app and creates an object with all URLs and other view data to render the
// pop.
Popup.createView = function(location, renderingAppName) {
  return {
    renderingAppName: renderingAppName,
    environments: Popup.generateEnvironmentLinks(location),
    contentLinks: Popup.generateContentLinks(location)
  };
}

// Given a location, generate URLs for all GOV.UK environments.
//
// Returns a hash with envs, including one with `class: "current"` to show
// the current environment.
Popup.generateEnvironmentLinks = function(location) {
  var ENVIRONMENTS = [
    {
      name: "Production",
      protocol: "https",
      serviceDomain: "publishing.service.gov.uk",
      host: "https://www.gov.uk"
    },
    {
      name: "Development",
      protocol: "http",
      serviceDomain: "dev.gov.uk",
      host: "http://www.dev.gov.uk"
    },
    {
      name: "Staging (origin)",
      protocol: "https",
      serviceDomain: "staging.publishing.service.gov.uk",
      host: "https://www-origin.staging.publishing.service.gov.uk"
    },
    {
      name: "Integration",
      protocol: "https",
      serviceDomain: "integration.publishing.service.gov.uk",
      host: "https://www-origin.integration.publishing.service.gov.uk"
    }
  ]

  var ORIGIN = {
    name: "Prod (origin)",
    protocol: "https",
    serviceDomain: "publishing.service.gov.uk",
    host: "https://www-origin.publishing.service.gov.uk"
  };

  var application = location.host.split('.')[0],
  inFrontend = application.match(/www/),
  environments = ENVIRONMENTS;

  if (inFrontend) {
    environments.push(ORIGIN);
  }

  return environments.map(function (env) {
    if (inFrontend) {
      var replacement = env.host;
    } else {
      var replacement = env.protocol + "://" + application + "." + env.serviceDomain;
    }

    env.url = location.href.replace(location.origin, replacement);
    env.class = location.href == env.url ? "current" : "";
    return env;
  })
}

// Extract the relevant path from a location, such as `/foo` from URLs like
// `www.gov.uk/foo` and `www.gov.uk/api/content/foo`.
Popup.extractPath = function(location) {
  var extractedPath;

  if (location.href.match(/api\/content/)) {
    extractedPath = location.pathname.replace('api/content/', '');
  } else if (location.href.match(/api\/incoming-links/)) {
    extractedPath = location.pathname.replace('api/incoming-links/', '');
  } else if (location.href.match(/search.json/)) {
    extractedPath = location.href.split('filter_link=')[1];
  } else if (location.href.match(/info/)) {
    extractedPath = location.pathname.replace('info/', '');
  } else if (location.href.match(/api.*\.json/)) {
    extractedPath = location.pathname.replace('api/', '').replace('.json', '');
  } else if (location.href.match(/www/)) {
    extractedPath = location.pathname;
  }

  if (extractedPath) {
    return extractedPath.replace('//', '/');
  }
}

// Given a location, generate links to different content presentations.
Popup.generateContentLinks = function(location) {
  var path = Popup.extractPath(location);

  if (!path) {
    return [];
  }

  var links = [
    { name: "On GOV.UK", url: location.origin + path },
    { name: "Content item (JSON)", url: location.origin + "/api/content" + path },
    { name: "Incoming links (JSON)", url: location.origin + "/api/incoming-links" + path + '?types[]=mainstream_browse_pages&types[]=topics&types[]=organisations&types[]=alpha_taxons'},
    { name: "View search data", url: location.origin + "/api/search.json?filter_link=" + path },
    { name: "Info page (not always available)", url: location.origin + "/info" + path },
    { name: "Content API (JSON, deprecated)", url: location.origin + "/api" + path + ".json" },
  ]

  return links.map(function (link) {
    link.class = link.url == location.href ? "current" : ""
    return link;
  })
}
