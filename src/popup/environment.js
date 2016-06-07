var Popup = Popup || {};

// Given a location, generate URLs for all GOV.UK environments.
//
// Returns a hash with envs, including one with `class: "current"` to show
// the current environment.
Popup.environment = function(location) {

  function isPartOfGOVUK() {
    return location.host.match(/www.gov.uk/) ||
        location.host.match(/publishing.service.gov.uk/) ||
        location.host.match(/dev.gov.uk/);
  }

  if (!isPartOfGOVUK()) {
    return {
      allEnvironments: {
        name: "GOV.UK",
        url: "https://www.gov.uk"
      }
    }
  }

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
      name: "Staging",
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

  var currentEnvironment;

  if (inFrontend) {
    environments.push(ORIGIN);
  }

  var allEnvironments = environments.map(function (env) {
    if (inFrontend) {
      var replacement = env.host;
    } else {
      var replacement = env.protocol + "://" + application + "." + env.serviceDomain;
    }

    env.url = location.href.replace(location.origin, replacement);

    if (location.href == env.url) {
      env.class = "current";
      currentEnvironment = env;
    } else {
      env.class = "";
    }

    return env;
  })

  return {
    allEnvironments: allEnvironments,
    currentEnvironment: currentEnvironment
  }
}
