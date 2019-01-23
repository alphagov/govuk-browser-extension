describe("Popup.environment", function() {
  function createEnvironmentForUrl(location) {
    var a = document.createElement('a');
    a.href = location;
    return Popup.environment(a.href, a.host, a.origin).allEnvironments;
  }

  it("returns the correct environment links when the user is on production", function() {
    var envs = createEnvironmentForUrl(
      "https://www.gov.uk/browse/disabilities?foo=bar"
    )

    var urls = pluck(envs, 'url');

    expect(urls).toEqual([
      'https://www.gov.uk/browse/disabilities?foo=bar',
      'https://www.staging.publishing.service.gov.uk/browse/disabilities?foo=bar',
      'https://www.integration.publishing.service.gov.uk/browse/disabilities?foo=bar',
      'http://www.dev.gov.uk/browse/disabilities?foo=bar',
    ])
  })

  it("returns the correct variants for development", function() {
    var envs = createEnvironmentForUrl(
      "http://www.dev.gov.uk/browse/disabilities?foo=bar"
    )

    var urls = pluck(envs, 'url');

    expect(urls).toEqual([
      'https://www.gov.uk/browse/disabilities?foo=bar',
      'https://www.staging.publishing.service.gov.uk/browse/disabilities?foo=bar',
      'https://www.integration.publishing.service.gov.uk/browse/disabilities?foo=bar',
      'http://www.dev.gov.uk/browse/disabilities?foo=bar',
    ])
  })

  it("shows production, staging, integration and development on publisher-apps", function() {
    var envs = createEnvironmentForUrl(
      "https://signon.publishing.service.gov.uk/"
    )

    var environmentNames = pluck(envs, 'name')

    expect(environmentNames).toEqual([
      'Production', 'Staging', 'Integration', 'Development'
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
