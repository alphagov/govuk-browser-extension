describe("Popup.extractPath", function () {
  it("returns nothing for publishing applications", function () {
    var path = Popup.extractPath("https://publisher.publishing.service.gov.uk/foo/bar", "/foo/bar")

    expect(path).toBeUndefined();
  })

  it("returns the path for draft URLs", function () {
    var path = Popup.extractPath("https://draft-origin.staging.publishing.service.gov.uk/browse/disabilities", "/browse/disabilities")

    expect(path).toEqual("/browse/disabilities");
  })

  it("returns the path for frontend applications", function () {
    var path = Popup.extractPath("https://www.gov.uk/browse/disabilities", "/browse/disabilities")

    expect(path).toBe("/browse/disabilities")
  })

  it("returns the path for origin frontend applications", function () {
    var path = Popup.extractPath("https://www-origin.gov.uk/browse/disabilities", "/browse/disabilities")

    expect(path).toBe("/browse/disabilities")
  })

  it("returns the path for content-store pages", function () {
    var path = Popup.extractPath("https://www.gov.uk/api/content/browse/disabilities", "/api/content/browse/disabilities")

    expect(path).toBe("/browse/disabilities")
  })

  it("returns the path for URLs with double slashes", function () {
    var path = Popup.extractPath("https://www.gov.uk/api/content//browse/disabilities", "/api/content//browse/disabilities")

    expect(path).toBe("/browse/disabilities")
  })

  it("returns the path for info pages", function () {
    var path = Popup.extractPath("https://www.gov.uk/info/browse/disabilities", "/info/browse/disabilities")

    expect(path).toBe("/browse/disabilities")
  })

  it("returns the path for search pages", function () {
    var path = Popup.extractPath("https://www.gov.uk/api/search.json?filter_link=/browse/disabilities", "/api/search.json")

    expect(path).toBe("/browse/disabilities")
  })

  it("returns the path for cache-busted search pages", function () {
    var path = Popup.extractPath("https://www.gov.uk/api/search.json?filter_link=/browse/disabilities&c=some_cache_buster", "/api/search.json")

    expect(path).toBe("/browse/disabilities")
  })

  it("returns the path for national archives pages", function () {
    var path = Popup.extractPath("http://webarchive.nationalarchives.gov.uk/*/https://www.gov.uk/some/page", "/*/https://www.gov.uk/some/page")

    expect(path).toBe("/some/page")
  })

  it("returns the path for the smart answers visualisation", function () {
    var path = Popup.extractPath("https://www.gov.uk/maternity-paternity-calculator/y/visualise", "/maternity-paternity-calculator/y/visualise")

    expect(path).toBe("/maternity-paternity-calculator")
  })
})
