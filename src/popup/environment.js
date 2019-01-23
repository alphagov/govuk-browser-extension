var Popup = Popup || {};

// Given a location, host and origin, generate URLs for all GOV.UK environments.
//
// Returns a hash with envs, including one with `class: "current"` to show
// the current environment.
Popup.environment = function(location, host, origin) {

  function isPartOfGOVUK() {
    return host.match(/www.gov.uk/) ||
        host.match(/publishing.service.gov.uk/) ||
        host.match(/dev.gov.uk/);
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
      name: "Staging",
      protocol: "https",
      serviceDomain: "staging.publishing.service.gov.uk",
      host: "https://www.staging.publishing.service.gov.uk"
    },
    {
      name: "Integration",
      protocol: "https",
      serviceDomain: "integration.publishing.service.gov.uk",
      host: "https://www.integration.publishing.service.gov.uk"
    },
    {
      name: "Development",
      protocol: "http",
      serviceDomain: "dev.gov.uk",
      host: "http://www.dev.gov.uk"
    }
  ]

  var application = host.split('.')[0],
  inFrontend = application.match(/www/),
  environments = ENVIRONMENTS;

  var currentEnvironment;

  var allEnvironments = environments.map(function (env) {
    if (inFrontend) {
      var replacement = env.host;
    } else {
      var replacement = env.protocol + "://" + application + "." + env.serviceDomain;
    }

    env.url = location.replace(origin, replacement);

    if (location == env.url) {
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
