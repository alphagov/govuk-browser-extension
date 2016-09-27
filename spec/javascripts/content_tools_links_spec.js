describe("PopupView.generateContentToolsLinks", function () {
  describe("on a SmartAnswers question or outcome", function () {
    var contentToolsLinks = Popup.generateContentToolsLinks("smartanswers", { url: "https://www.gov.uk/smart-answer/y/question-1" });
    var contentToolsURLs = contentToolsLinks.map(function (link) { return link.url; });

    it("generates a GovSpeak link", function () {
      expect(contentToolsURLs).toContain("https://www.gov.uk/smart-answer/y/question-1.txt");
    });

    it("generates a visualise link", function () {
      expect(contentToolsURLs).toContain("https://www.gov.uk/smart-answer/visualise");
    });
  });

  describe("on a SmartAnswers landing page", function () {
    var contentToolsLinks = Popup.generateContentToolsLinks("smartanswers", { url: "https://www.gov.uk/smart-answer" });
    var contentToolsURLs = contentToolsLinks.map(function (link) { return link.url; });

    it("does not generate a GovSpeak link", function () {
      expect(contentToolsURLs).not.toContain("https://www.gov.uk/smart-answer.txt");
    });

    it("generates a visualise link", function () {
      expect(contentToolsURLs).toContain("https://www.gov.uk/smart-answer/visualise");
    });
  });

  it("does not add content tools links on non-SmartAnswers pages", function () {
    var contentToolsLinks = Popup.generateContentToolsLinks("something-else", { url: "https://wwww.gov.uk/not-a-smartanswer" });

    expect(contentToolsLinks).toEqual([])
  });
});
