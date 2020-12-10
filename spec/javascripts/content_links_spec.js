describe("PopupView.generateContentLinks", function () {
  var PROD_ENV = { protocol: 'https', serviceDomain: 'publishing.service.gov.uk', origin: 'https://www.gov.uk' }
  var DRAFT_PROD_ENV = { protocol: 'https', serviceDomain: 'publishing.service.gov.uk', origin: 'https://draft-origin.publishing.service.gov.uk' }

  it("returns the correct URIs", function () {
    var links = Popup.generateContentLinks(
      "https://www.gov.uk/browse/disabilities?foo=bar",
      "https://www.gov.uk",
      "/browse/disabilities",
      PROD_ENV
    )

    var urls = pluck(links, 'url')

    expect(urls).toEqual([
      'https://www.gov.uk/browse/disabilities',
      'https://www.gov.uk/api/content/browse/disabilities',
      'https://www.gov.uk/api/search.json?filter_link=/browse/disabilities',
      'https://www.gov.uk/info/browse/disabilities',
      'https://draft-origin.publishing.service.gov.uk/browse/disabilities',
      'https://support.publishing.service.gov.uk/anonymous_feedback?path=/browse/disabilities',
      'https://content-data.publishing.service.gov.uk/metrics/browse/disabilities',
      'http://webarchive.nationalarchives.gov.uk/*/https://www.gov.uk/browse/disabilities',
      'https://content-data-admin.publishing.service.gov.uk/metrics/browse/disabilities',
      'https://search.google.com/structured-data/testing-tool/u/0/#url=https://www.gov.uk/browse/disabilities',
    ])
  })

  it("returns the draft URIs for non-prod environments", function () {
    var links = Popup.generateContentLinks(
      "https://www.gov.uk/browse/disabilities?foo=bar",
      "https://www.gov.uk",
      "/browse/disabilities",
      { protocol: 'https', serviceDomain: 'staging.publishing.service.gov.uk'}
    )

    var urls = pluck(links, 'url')

    expect(urls).toContain(
      'https://draft-origin.staging.publishing.service.gov.uk/browse/disabilities'
    )
  })

  it("does not generate URIs for publishing apps (non-www pages)", function () {
    var links = Popup.generateContentLinks(
      "https://search-admin.publishing.service.gov.uk/queries",
      "https://search-admin.publishing.service.gov.uk",
      "/queries",
      PROD_ENV
    )

    expect(links).toEqual([])
  })

  it("only generates URLs for publishing-apps when it's the support application", function () {
    var links = Popup.generateContentLinks(
      "https://support.publishing.service.gov.uk/anonymous_feedback?path=/browse/disabilities",
      "https://support.publishing.service.gov.uk",
      "/anonymous_feedback",
      PROD_ENV
    )

    var urls = pluck(links, 'url')

    expect(urls).toEqual([
      'https://www.gov.uk/browse/disabilities',
      'https://www.gov.uk/api/content/browse/disabilities',
      'https://www.gov.uk/api/search.json?filter_link=/browse/disabilities',
      'https://www.gov.uk/info/browse/disabilities',
      'https://draft-origin.publishing.service.gov.uk/browse/disabilities',
      'https://support.publishing.service.gov.uk/anonymous_feedback?path=/browse/disabilities',
      'https://content-data.publishing.service.gov.uk/metrics/browse/disabilities',
      'http://webarchive.nationalarchives.gov.uk/*/https://www.gov.uk/browse/disabilities',
      'https://content-data-admin.publishing.service.gov.uk/metrics/browse/disabilities',
      'https://search.google.com/structured-data/testing-tool/u/0/#url=https://www.gov.uk/browse/disabilities'
    ])
  })

  it("generates a link for smart answers", function () {
    var links = Popup.generateContentLinks(
      "https://www.gov.uk/smart-answer/y/question-1",
      "https://www.gov.uk",
      "/smart-answer/y/question-1",
      PROD_ENV,
      "smartanswers"
    )

    var urls = pluck(links, 'url')

    expect(urls).toContain(
      "https://www.gov.uk/smart-answer/y/question-1.txt",
      "https://www.gov.uk/smart-answer/y/visualise"
    )
  })

  it("does not generate a markdown link for landing pages", function () {
    var links = Popup.generateContentLinks(
      "https://www.gov.uk/smart-answer",
      "https://www.gov.uk",
      "/smart-answer",
      PROD_ENV,
      "smartanswers"
    )

    var urls = pluck(links, 'url')

    expect(urls).not.toContain("https://www.gov.uk/smart-answer.txt")
  })

  it("generates correct link for content API on draft stack", function () {
    var links = Popup.generateContentLinks(
      "https://draft-origin.publishing.service.gov.uk/apply-for-and-manage-a-gov-uk-domain-name",
      "https://draft-origin.publishing.service.gov.uk",
      "/apply-for-and-manage-a-gov-uk-domain-name",
      DRAFT_PROD_ENV,
      "collections"
    )

    expect(links[1]).toEqual({
      name: "Content item (JSON)",
      url:  "https://draft-origin.publishing.service.gov.uk/api/content/apply-for-and-manage-a-gov-uk-domain-name",
      class: ""
    })
  })
})
