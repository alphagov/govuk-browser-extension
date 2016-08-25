describe("Popup.extractPath", function () {
  it("returns nothing for publishing applications", function () {
    var path = Popup.extractPath(stubLocation("https://publisher.publishing.service.gov.uk/foo/bar"))

    expect(path).toBeUndefined();
  })

  it("returns the path for draft URLs", function () {
    var path = Popup.extractPath(stubLocation("https://draft-origin.staging.publishing.service.gov.uk/browse/disabilities"))

    expect(path).toEqual("/browse/disabilities");
  })

  it("returns the path for frontend applications", function () {
    var path = Popup.extractPath(stubLocation("https://www.gov.uk/browse/disabilities"))

    expect(path).toBe("/browse/disabilities")
  })

  it("returns the path for origin frontend applications", function () {
    var path = Popup.extractPath(stubLocation("https://www-origin.gov.uk/browse/disabilities"))

    expect(path).toBe("/browse/disabilities")
  })

  it("returns the path for content-store pages", function () {
    var path = Popup.extractPath(stubLocation("https://www.gov.uk/api/content/browse/disabilities"))

    expect(path).toBe("/browse/disabilities")
  })

  it("returns the path for URLs with double slashes", function () {
    var path = Popup.extractPath(stubLocation("https://www.gov.uk/api/content//browse/disabilities"))

    expect(path).toBe("/browse/disabilities")
  })

  it("returns the path for info pages", function () {
    var path = Popup.extractPath(stubLocation("https://www.gov.uk/info/browse/disabilities"))

    expect(path).toBe("/browse/disabilities")
  })

  it("returns the path for content-api pages", function () {
    var path = Popup.extractPath(stubLocation("https://www.gov.uk/api/browse/disabilities.json"))

    expect(path).toBe("/browse/disabilities")
  })

  it("returns the path for content-api pages", function () {
    var path = Popup.extractPath(stubLocation("https://www.gov.uk/api/foo.json"))

    expect(path).toBe("/foo")
  })

  it("returns the path for search pages", function () {
    var path = Popup.extractPath(stubLocation("https://www.gov.uk/api/search.json?filter_link=/browse/disabilities"))

    expect(path).toBe("/browse/disabilities")
  })

  it("returns the path for national archives pages", function () {
    var path = Popup.extractPath(stubLocation("http://webarchive.nationalarchives.gov.uk/*/https://www.gov.uk/some/page"))

    expect(path).toBe("/some/page")
  })

  it("returns the path to the landing page for smart-answer question pages", function () {
    var renderingApplication = "smartanswers"
    var path = Popup.extractPath(stubLocation("https://www.gov.uk/smart-answer/y/question-1"), renderingApplication)

    expect(path).toBe("/smart-answer")
  })

  it("returns the path to the landing page for the text version of smart-answer question pages", function () {
    var renderingApplication = "smartanswers"
    var path = Popup.extractPath(stubLocation("https://www.gov.uk/smart-answer/y/question-1.txt"), renderingApplication)

    expect(path).toBe("/smart-answer")
  })

  it("returns the path to the landing page for the json version of smart-answer question pages", function () {
    var renderingApplication = "smartanswers"
    var path = Popup.extractPath(stubLocation("https://www.gov.uk/smart-answer/y/question-1.json"), renderingApplication)

    expect(path).toBe("/smart-answer")
  })
})
