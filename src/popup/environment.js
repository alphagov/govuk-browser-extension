var Popup = Popup || {}

// Given a location, host and origin, generate URLs for all GOV.UK environments.
//
// Returns a hash with envs, including one with `class: "current"` to show
// the current environment.
Popup.environment = function (location, host, origin) {
  function isPartOfGOVUK () {
    return host.match(/www.gov.uk/) ||
        host.match(/publishing.service.gov.uk/) ||
        host.match(/dev.gov.uk/)
  }

  function isGOVUKAccount () {
    return host.match(/www.account/) || host.match(/login.service.dev/)
  }

  if (!isPartOfGOVUK()) {
    return {
      allEnvironments: {
        name: 'GOV.UK',
        url: 'https://www.gov.uk'
      }
    }
  }

  var ENVIRONMENTS = [
    {
      name: 'Production',
      protocol: 'https',
      serviceDomain: 'publishing.service.gov.uk',
      host: 'https://www.gov.uk',
      origin: origin
    },
    {
      name: 'Staging',
      protocol: 'https',
      serviceDomain: 'staging.publishing.service.gov.uk',
      host: 'https://www.staging.publishing.service.gov.uk',
      origin: origin
    },
    {
      name: 'Integration',
      protocol: 'https',
      serviceDomain: 'integration.publishing.service.gov.uk',
      host: 'https://www.integration.publishing.service.gov.uk',
      origin: origin
    },
    {
      name: 'Development',
      protocol: 'http',
      serviceDomain: 'dev.gov.uk',
      host: 'http://www.dev.gov.uk',
      origin: origin
    }
  ]

  var application = isGOVUKAccount() ? host.split('.')[1] : host.split('.')[0]
  var inFrontend = application.match(/www/) && !isGOVUKAccount()
  var environments = ENVIRONMENTS

  var currentEnvironment

  var allEnvironments = environments.map(function (env) {
    if (inFrontend) {
      var replacement = env.host
    } else if (isGOVUKAccount()) {
      replacement = env.protocol + '://www.' + application + '.' + env.serviceDomain
    } else {
      replacement = env.protocol + '://' + application + '.' + env.serviceDomain
    }

    env.url = location.replace(origin, replacement)
    if (env.name === 'Development' && isGOVUKAccount()) {
      // The GOV.UK Account is a special snowflake app with a special snowflake dev environment URL
      env.url = 'http://www.login.service.dev.gov.uk/'
    }

    if (location === env.url) {
      env.class = 'current'
      currentEnvironment = env
    } else {
      env.class = ''
    }

    return env
  }).filter(function (env) {
    //  GOV.UK Account does not have an Integration environment – remove this option from the list of environments
    if (env.name === 'Integration' && isGOVUKAccount()) return false
    return env
  })

  return {
    allEnvironments: allEnvironments,
    currentEnvironment: currentEnvironment
  }
}
