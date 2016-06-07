describe("Popup.environment", function() {
  function createEnvironmentForUrl(location) {
    return Popup.environment(stubLocation(location)).allEnvironments;
  }

  it("returns the correct environment links when the user is on production", function() {
    var envs = createEnvironmentForUrl(
      "https://www.gov.uk/browse/disabilities?foo=bar"
    )

    var urls = pluck(envs, 'url');

    expect(urls).toEqual([
      'https://www.gov.uk/browse/disabilities?foo=bar',
      'http://www.dev.gov.uk/browse/disabilities?foo=bar',
      'https://www-origin.staging.publishing.service.gov.uk/browse/disabilities?foo=bar',
      'https://www-origin.integration.publishing.service.gov.uk/browse/disabilities?foo=bar',
      'https://www-origin.publishing.service.gov.uk/browse/disabilities?foo=bar',
    ])
  })

  it("returns the correct variants for production origin", function() {
    var envs = createEnvironmentForUrl(
      "https://www-origin.production.publishing.service.gov.uk/browse/disabilities?foo=bar"
    )

    var urls = pluck(envs, 'url');

    expect(urls).toEqual([
      'https://www.gov.uk/browse/disabilities?foo=bar',
      'http://www.dev.gov.uk/browse/disabilities?foo=bar',
      'https://www-origin.staging.publishing.service.gov.uk/browse/disabilities?foo=bar',
      'https://www-origin.integration.publishing.service.gov.uk/browse/disabilities?foo=bar',
      'https://www-origin.publishing.service.gov.uk/browse/disabilities?foo=bar',
    ])
  })

  it("returns the correct variants for development", function() {
    var envs = createEnvironmentForUrl(
      "http://www.dev.gov.uk/browse/disabilities?foo=bar"
    )

    var urls = pluck(envs, 'url');

    expect(urls).toEqual([
      'https://www.gov.uk/browse/disabilities?foo=bar',
      'http://www.dev.gov.uk/browse/disabilities?foo=bar',
      'https://www-origin.staging.publishing.service.gov.uk/browse/disabilities?foo=bar',
      'https://www-origin.integration.publishing.service.gov.uk/browse/disabilities?foo=bar',
      'https://www-origin.publishing.service.gov.uk/browse/disabilities?foo=bar',
    ])
  })

  it("shows production, dev, staging and integration on publisher-apps", function() {
    var envs = createEnvironmentForUrl(
      "https://signon.publishing.service.gov.uk/"
    )

    var environmentNames = pluck(envs, 'name')

    expect(environmentNames).toEqual([
      'Production', 'Development', 'Staging', 'Integration'
    ])
  })

  it("correctly identifies the current environment", function() {
    var forProd = createEnvironmentForUrl(
      "https://www.gov.uk/browse/disabilities?foo=bar"
    );

    expect(forProd[0].class).toEqual("current")
  })

  it("returns nothing if not on GOV.UK", function() {
    var links = createEnvironmentForUrl(
      "http://webarchive.nationalarchives.gov.uk/*/https://www.gov.uk/jobsearch"
    );

    expect(links).toEqual({ name: 'GOV.UK', url: 'https://www.gov.uk' })
  })
})
