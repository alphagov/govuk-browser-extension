describe("PopupView", function() {
  describe("extractPath", function () {
    it("returns nothing for non-frontend URLs", function () {
      var path = Popup.extractPath(stubLocation("https://publisher.publishing.service.gov.uk/foo/bar"))

      expect(path).toBeUndefined();
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

    it("returns the path for incoming-links pages", function () {
      var path = Popup.extractPath(stubLocation("https://www.gov.uk/api/incoming-links/alpha-taxonomy/4-nannies-and-au-pairs?types[]=topics"))

      expect(path).toBe("/alpha-taxonomy/4-nannies-and-au-pairs")
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
  })

  describe("generateEnvironmentLinks", function () {
    it("returns the correct variants for a production URL", function () {
      var envs = Popup.generateEnvironmentLinks(
        stubLocation("https://www.gov.uk/browse/disabilities?foo=bar")
      );

      expect(envs.map(fn('url'))).toEqual([
        'https://www.gov.uk/browse/disabilities?foo=bar',
        'http://www.dev.gov.uk/browse/disabilities?foo=bar',
        'https://www-origin.staging.publishing.service.gov.uk/browse/disabilities?foo=bar',
        'https://www-origin.integration.publishing.service.gov.uk/browse/disabilities?foo=bar',
        'https://www-origin.publishing.service.gov.uk/browse/disabilities?foo=bar',
      ])
    })

    it("returns the correct variants for a origin-prod URL", function () {
      var envs = Popup.generateEnvironmentLinks(
        stubLocation("https://www-origin.production.publishing.service.gov.uk/browse/disabilities?foo=bar")
      );

      expect(envs.map(fn('url'))).toEqual([
        'https://www.gov.uk/browse/disabilities?foo=bar',
        'http://www.dev.gov.uk/browse/disabilities?foo=bar',
        'https://www-origin.staging.publishing.service.gov.uk/browse/disabilities?foo=bar',
        'https://www-origin.integration.publishing.service.gov.uk/browse/disabilities?foo=bar',
        'https://www-origin.publishing.service.gov.uk/browse/disabilities?foo=bar',
      ])
    })

    it("only has a prod-origin URL for frontend pages", function () {
      var envs = Popup.generateEnvironmentLinks(
        stubLocation("https://signon.publishing.service.gov.uk/")
      );

      expect(envs.map(fn('url'))).toEqual([
        'https://signon.publishing.service.gov.uk/',
        'http://signon.dev.gov.uk/',
        'https://signon.staging.publishing.service.gov.uk/',
        'https://signon.integration.publishing.service.gov.uk/',
      ])
    })

    it("returns the correct variants for a development URL", function () {
      var forProd = Popup.generateEnvironmentLinks(
        stubLocation("https://www.gov.uk/browse/disabilities?foo=bar")
      );

      var forDev = Popup.generateEnvironmentLinks(
        stubLocation("http://www.dev.gov.uk/browse/disabilities?foo=bar")
      );

      expect(forProd.map(fn('url'))).toEqual(forDev.map(fn('url')))
    })

    it("correctly identifies the current environment", function () {
      var forProd = Popup.generateEnvironmentLinks(
        stubLocation("https://www.gov.uk/browse/disabilities?foo=bar")
      );

      expect(forProd[0].class).toEqual("current")
    })
  })

  describe("generateContentLinks", function () {
    it("returns the correct URLs", function () {
      var links = Popup.generateContentLinks(
        stubLocation("https://www.gov.uk/browse/disabilities?foo=bar")
      )

      expect(links.map(fn('url'))).toEqual([
        'https://www.gov.uk/browse/disabilities',
        'https://www.gov.uk/api/content/browse/disabilities',
        'https://www.gov.uk/api/incoming-links/browse/disabilities?types[]=mainstream_browse_pages&types[]=topics&types[]=organisations&types[]=alpha_taxons',
        'https://www.gov.uk/api/search.json?filter_link=/browse/disabilities',
        'https://www.gov.uk/info/browse/disabilities',
        'https://www.gov.uk/api/browse/disabilities.json',
        'http://webarchive.nationalarchives.gov.uk/*/https://www.gov.uk/browse/disabilities'
      ])
    })
  })

  function stubLocation(url) {
    var location = document.createElement('a');
    location.href = url;
    return location;
  }

  // Basically, `fn("title")` is `&:title` in ruby.
  function fn(key) {
    return function(object) {
      return object[key];
    }
  }
});
