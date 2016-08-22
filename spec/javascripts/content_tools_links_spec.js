describe("PopupView.generateContentLinks", function () {
  var PROD_ENV = { protocol: 'https', serviceDomain: 'integration.publishing.service.gov.uk' }

  it("returns the correct URIs", function () {
    var fakeSuccess = {
        base_path: "/marriage-abroad",
        content_id: "uyre74734-7434783473-87857454jyreure",
        document_type: "smartanswer_document",
        first_published_at: "2016-02-29T09:24:10.000+00:00",
        format: "placeholder_smart_answer",
        locale: "en",
        phase: "live",
        public_updated_at: "2016-08-19T12:12:28.000+00:00",
        publishing_app: "smartanswers",
        rendering_app: "smartanswers",
        schema_name: "placeholder_smart_answer",
        title: "Getting married abroad",
        updated_at: "2016-08-19T12:12:28.379Z"
      };

    // TODO: need to get this tests working by faking the success json response.
    spyOn($, "getJSON").and.callThrough(function(params) {
      params.success(fakeSuccess);
    });

    var contentItemLinks = Popup.generateContentToolsLinks("https://www-origin.integration.publishing.service.gov.uk/api/content/marriage-abroad/y/american-samoa",
      PROD_ENV
    )

    var urls = pluck(contentItemLinks.links, "url")

    expect(urls).toEqual([
      "https://www-origin.integration.publishing.service.gov.uk/marriage-abroad/y/american-samoa.txt",
      "https://www-origin.integration.publishing.service.gov.uk/marriage-abroad/visualise"
    ])
  })
});
