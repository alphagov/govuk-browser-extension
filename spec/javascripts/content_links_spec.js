describe("PopupView.generateContentLinks", function () {
  var PROD_ENV = { protocol: 'https', serviceDomain: 'publishing.service.gov.uk' }

  it("returns the correct URIs", function () {
    var links = Popup.generateContentLinks(
      stubLocation("https://www.gov.uk/browse/disabilities?foo=bar"),
      PROD_ENV
    )

    var urls = pluck(links, 'url')

    expect(urls).toEqual([
      'https://www.gov.uk/browse/disabilities',
      'https://www.gov.uk/api/content/browse/disabilities',
      'https://www.gov.uk/api/search.json?filter_link=/browse/disabilities',
      'https://www.gov.uk/info/browse/disabilities',
      'https://www.gov.uk/api/browse/disabilities.json',
      'https://draft-origin.publishing.service.gov.uk/browse/disabilities',
      'http://webarchive.nationalarchives.gov.uk/*/https://www.gov.uk/browse/disabilities'
    ])
  })

  it("returns the draft URIs for non-prod environments", function () {
    var links = Popup.generateContentLinks(
      stubLocation("https://www.gov.uk/browse/disabilities?foo=bar"),
      { protocol: 'https', serviceDomain: 'staging.publishing.service.gov.uk'}
    )

    var urls = pluck(links, 'url')

    expect(urls).toContain(
      'https://draft-origin.staging.publishing.service.gov.uk/browse/disabilities'
    )
  })

  it("generates a subset of URIs for the root page", function () {
    var links = Popup.generateContentLinks(
      stubLocation("https://www.gov.uk/"),
      PROD_ENV
    )

    var urls = pluck(links, 'url')

    expect(urls).toEqual([
      'https://www.gov.uk/',
      'http://webarchive.nationalarchives.gov.uk/*/https://www.gov.uk/'
    ])
  })

  it("does not generate URIs for publishing apps (non-www pages)", function () {
    var links = Popup.generateContentLinks(
      stubLocation("https://search-admin.publishing.service.gov.uk/queries"),
      PROD_ENV
    )

    expect(links).toEqual([])
  })
})
