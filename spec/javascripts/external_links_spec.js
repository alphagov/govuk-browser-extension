describe("Popup.generateExternalLinks", function () {
  var PROD_ENV = { protocol: 'https', serviceDomain: 'publishing.service.gov.uk' }

  it("generates a link to the rendering app GitHub", function () {
    var contentItem = {
      rendering_app: 'collections'
    }

    var links = Popup.generateExternalLinks(contentItem, PROD_ENV)

    expect(links).toContain({
      name: 'Rendering app: collections',
      url: 'https://docs.publishing.service.gov.uk/apps/collections.html'
    })
  })

  it("generates a Github link when the rendering app does not match the repository name", function () {
    var contentItem = {
      rendering_app: 'smartanswers'
    }

    var links = Popup.generateExternalLinks(contentItem, PROD_ENV)

    expect(links).toContain({
      name: 'Rendering app: smartanswers',
      url: 'https://docs.publishing.service.gov.uk/apps/smart-answers.html'
    })
  })

  it("generates a link to the publishing app in the docs", function () {
    var contentItem = {
      publishing_app: 'collections-publisher'
    }

    var links = Popup.generateExternalLinks(contentItem, PROD_ENV)

    expect(links).toContain({
      name: 'Publishing app: collections-publisher',
      url: 'https://docs.publishing.service.gov.uk/apps/collections-publisher.html'
    })
  })

  it("generates the correct docs link when a publishing app does not match the repository name", function () {
    var contentItem = {
      publishing_app: 'smartanswers'
    }

    var links = Popup.generateExternalLinks(contentItem, PROD_ENV)

    expect(links).toContain({
      name: 'Publishing app: smartanswers',
      url: 'https://docs.publishing.service.gov.uk/apps/smart-answers.html'
    })
  })

  it("generates a link to the content schema", function () {
    var contentItem = {
      schema_name: 'topic'
    }

    var links = Popup.generateExternalLinks(contentItem, PROD_ENV)

    expect(links).toContain({
      name: 'Content schema: topic',
      url: 'https://docs.publishing.service.gov.uk/content-schemas/topic.html'
    })
  })

  it("correctly links to placeholder schemas", function () {
    var contentItem = {
      schema_name: 'placeholder_something_or_other'
    }

    var links = Popup.generateExternalLinks(contentItem, PROD_ENV)

    expect(links).toContain({
      name: 'Content schema: placeholder',
      url: 'https://docs.publishing.service.gov.uk/content-schemas/placeholder.html'
    })
  })

  it("correctly links to document types", function () {
    var contentItem = {
      document_type: 'announcement'
    }

    var links = Popup.generateExternalLinks(contentItem, PROD_ENV)

    expect(links).toContain({
      name: 'Document type: announcement',
      url: 'https://docs.publishing.service.gov.uk/document-types/announcement.html'
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
      url: 'https://collections-publisher.publishing.service.gov.uk/specialist-sector-pages/4d8568c4-67f2-48da-a578-5ac6f35b69b4'
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

  it("generates edit links for step by steps", function () {
    var contentItem = {
      content_id: '4d8568c4-67f2-48da-a578-5ac6f35b69b4',
      document_type: 'step_by_step_nav'
    }

    var links = Popup.generateExternalLinks(contentItem, PROD_ENV)

    expect(links).toContain({
      name: 'Look up in collections-publisher',
      url: 'https://collections-publisher.publishing.service.gov.uk/step-by-step-pages'
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
      content_id: '4d8568c4-67f2-48da-a578-5ac6f35b69b4',
      publishing_app: 'whitehall'
    }

    var links = Popup.generateExternalLinks(contentItem, PROD_ENV)

    expect(links).toContain({
      name: 'Edit in Whitehall Publisher',
      url: 'https://whitehall-admin.publishing.service.gov.uk/government/admin/by-content-id/4d8568c4-67f2-48da-a578-5ac6f35b69b4'
    })
  })

  it("generates edit links for Specalist Publisher items", function () {
    var contentItem = {
      publishing_app: 'specialist-publisher',
      content_id: '4dd888e6-e890-4498-9913-b89e4e5a0059',
      document_type: 'aaib_report',
    }

    var links = Popup.generateExternalLinks(contentItem, PROD_ENV)

    expect(links).toContain({
      name: 'Edit in Specialist Publisher',
      url: 'https://specialist-publisher.publishing.service.gov.uk/aaib-reports/4dd888e6-e890-4498-9913-b89e4e5a0059'
    })
  })

  it("generates edit links for Content Publisher items", function () {
    var contentItem = {
      publishing_app: 'content-publisher',
      content_id: '4d8568c4-67f2-48da-a578-5ac6f35b69b4',
      locale: 'cy',
    }

    var links = Popup.generateExternalLinks(contentItem, PROD_ENV)

    expect(links).toContain({
      name: 'Edit in Content Publisher',
      url: 'https://content-publisher.publishing.service.gov.uk/documents/4d8568c4-67f2-48da-a578-5ac6f35b69b4:cy'
    })
  })

  it("includes a link to content-tagger", function () {
    var contentItem = {
      content_id: '4d8568c4-67f2-48da-a578-5ac6f35b69b4'
    }

    var links = Popup.generateExternalLinks(contentItem, PROD_ENV)

    expect(links).toContain({
      name: 'Add tags in content-tagger',
      url: 'https://content-tagger.publishing.service.gov.uk/content/4d8568c4-67f2-48da-a578-5ac6f35b69b4'
    })
  })

  it("includes an edit link to content-tagger", function () {
    var contentItem = {
      content_id: '4d8568c4-67f2-48da-a578-5ac6f35b69b4',
      document_type: 'taxon'
    }

    var links = Popup.generateExternalLinks(contentItem, PROD_ENV)

    expect(links).toContain({
      name: 'Edit in content-tagger',
      url: 'https://content-tagger.publishing.service.gov.uk/taxons/4d8568c4-67f2-48da-a578-5ac6f35b69b4'
    })
  })
})
