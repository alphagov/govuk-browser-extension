describe("PopupView.generateContentLinks", function () {
  it("returns the correct URIs", function () {
    var links = Popup.generateContentLinks(
      stubLocation("https://www.gov.uk/browse/disabilities?foo=bar")
    )

    var urls = pluck(links, 'url')

    expect(urls).toEqual([
      'https://www.gov.uk/browse/disabilities',
      'https://www.gov.uk/api/content/browse/disabilities',
      'https://www.gov.uk/api/search.json?filter_link=/browse/disabilities',
      'https://www.gov.uk/info/browse/disabilities',
      'https://www.gov.uk/api/browse/disabilities.json',
      'http://webarchive.nationalarchives.gov.uk/*/https://www.gov.uk/browse/disabilities'
    ])
  })

  it("does not generate URIs for the root page", function () {
    var links = Popup.generateContentLinks(
      stubLocation("https://www.gov.uk/")
    )

    expect(links).toEqual([])
  })

  it("does not generate URIs for publishing apps (non-www pages)", function () {
    var links = Popup.generateContentLinks(
      stubLocation("https://search-admin.publishing.service.gov.uk/queries")
    )

    expect(links).toEqual([])
  })
})
