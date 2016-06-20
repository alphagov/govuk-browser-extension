describe("Popup.generateExternalLinks", function () {
  var PROD_ENV = { protocol: 'https', serviceDomain: 'publishing.service.gov.uk' }

  it("generates a link to the rendering app GitHub", function () {
    var contentItem = {
      rendering_app: 'collections'
    }

    var links = Popup.generateExternalLinks(contentItem, PROD_ENV)

    expect(links).toContain({
      name: 'Rendering app: collections <img src="popup/github.png" width="16" />',
      url: 'https://github.com/alphagov/collections'
    })
  })

  it("generates a link to the publishing app GitHub", function () {
    var contentItem = {
      publishing_app: 'collections-publisher'
    }

    var links = Popup.generateExternalLinks(contentItem, PROD_ENV)

    expect(links).toContain({
      name: 'Publishing app: collections-publisher <img src="popup/github.png" width="16" />',
      url: 'https://github.com/alphagov/collections-publisher'
    })
  })

  it("generates a link to the content schema", function () {
    var contentItem = {
      schema_name: 'topic'
    }

    var links = Popup.generateExternalLinks(contentItem, PROD_ENV)

    expect(links).toContain({
      name: 'Content schema: topic <img src="popup/github.png" width="16" />',
      url: 'https://github.com/alphagov/govuk-content-schemas/tree/master/dist/formats/topic'
    })
  })


  it("generates edit links for topics", function () {
    var contentItem = {
      content_id: '4d8568c4-67f2-48da-a578-5ac6f35b69b4',
      document_type: 'topic'
    }

    var links = Popup.generateExternalLinks(contentItem, PROD_ENV)

    expect(links).toContain({
      name: 'Edit in collections-publisher',
      url: 'https://collections-publisher.publishing.service.gov.uk/topics/4d8568c4-67f2-48da-a578-5ac6f35b69b4'
    })
  })

  it("generates edit links for mainstream browse pages", function () {
    var contentItem = {
      content_id: '4d8568c4-67f2-48da-a578-5ac6f35b69b4',
      document_type: 'mainstream_browse_page'
    }

    var links = Popup.generateExternalLinks(contentItem, PROD_ENV)

    expect(links).toContain({
      name: 'Edit in collections-publisher',
      url: 'https://collections-publisher.publishing.service.gov.uk/mainstream-browse-pages/4d8568c4-67f2-48da-a578-5ac6f35b69b4'
    })
  })

  it("generates edit links for mainstream items", function () {
    var contentItem = {
      content_id: '4d8568c4-67f2-48da-a578-5ac6f35b69b4',
      publishing_app: 'publisher',
      base_path: '/certifying-a-document'
    }

    var links = Popup.generateExternalLinks(contentItem, PROD_ENV)

    expect(links).toContain({
      name: 'Look up in Mainstream Publisher',
      url: 'https://publisher.publishing.service.gov.uk/?list=published&string_filter=certifying-a-document&user_filter=all'
    })
  })

  it("generates edit links for Whitehall items", function () {
    var contentItem = {
      publishing_app: 'whitehall'
    }

    var links = Popup.generateExternalLinks(contentItem, PROD_ENV)

    expect(links).toContain({
      name: 'Go to Whitehall Publisher',
      url: 'https://whitehall-admin.publishing.service.gov.uk/'
    })
  })

  it("generates edit links for Specalist Publisher items", function () {
    var contentItem = {
      publishing_app: 'specialist-publisher'
    }

    var links = Popup.generateExternalLinks(contentItem, PROD_ENV)

    expect(links).toContain({
      name: 'Go to Specialist Publisher',
      url: 'https://specialist-publisher.publishing.service.gov.uk/'
    })
  })

  it("includes a link to content-tagger", function () {
    var contentItem = {
      content_id: '4d8568c4-67f2-48da-a578-5ac6f35b69b4'
    }

    var links = Popup.generateExternalLinks(contentItem, PROD_ENV)

    expect(links).toContain({
      name: 'Look up in content-tagger',
      url: 'https://content-tagger.publishing.service.gov.uk/content/4d8568c4-67f2-48da-a578-5ac6f35b69b4'
    })
  })

  it("includes a link to beta publishing-api debug tools", function () {
    var contentItem = {
      content_id: '4d8568c4-67f2-48da-a578-5ac6f35b69b4'
    }

    var links = Popup.generateExternalLinks(contentItem, PROD_ENV)

    expect(links).toContain({
      name: 'Publishing API debug (SSH tunnel required)',
      url: 'https://publishing-api.publishing.service.gov.uk/debug/4d8568c4-67f2-48da-a578-5ac6f35b69b4'
    })
  })
})
