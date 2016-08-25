describe("PopupView.generateContentToolsLinks", function () {
  var renderingApplication = "smartanswers";
  var PROD_ENV = {}

  it("returns the URL to the GovSpeak file", function () {
    PROD_ENV.url = "https://www.gov.uk/smart-answer/y/question-1";
    contentToolsLinks = Popup.generateContentToolsLinks(renderingApplication, PROD_ENV)

    expect(contentToolsLinks[0].url).toEqual(PROD_ENV.url + ".txt")
  });

  it("does not add a link to the GovSpeak of landing pages", function () {
    PROD_ENV.url = "https://www.gov.uk/smart-answer";
    contentToolsLinks = Popup.generateContentToolsLinks(renderingApplication, PROD_ENV)

    expect(contentToolsLinks).toEqual([])
  });

  it("does not add a link to GovSpeak for other non-smartanswer pages", function () {
    PROD_ENV.url = "https://wwww.gov.uk/not-a-smartanswer";
    contentToolsLinks = Popup.generateContentToolsLinks("something-else", PROD_ENV)

    expect(contentToolsLinks).toEqual([])
  });
});
