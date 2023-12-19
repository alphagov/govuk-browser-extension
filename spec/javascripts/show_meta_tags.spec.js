'use strict';
describe("Toggling meta tags", function () {
  var showMetaTagsBannerId = "govuk-chrome-toolkit-banner";
  var showMetaTagsBannerElement;
  var showMetaTagsComponent;

  beforeEach(function () {
    window.chrome = {
      runtime: {
        onMessage: {
          addListener: function () {},
        },
        sendMessage: function () {},
      },
    };

    loadFixtures("meta-tags.html")

    showMetaTagsComponent = new ShowMetaTagsComponent;
    showMetaTagsComponent.toggleMetaTags();

    showMetaTagsBannerElement = document.querySelector(`#${showMetaTagsBannerId}`);
  });

  it("shows meta tags with name and content", function () {
    expect(showMetaTagsBannerElement.textContent).toMatch(/foo/);
  });

  it("doesn't show meta tags that use property instead of name", function () {
    // No particular reason for this, it just doesn't
    expect(showMetaTagsBannerElement.textContent).not.toMatch(/og:image/);
  });

  it("removes the banner when toggled off", function () {
    showMetaTagsComponent.toggleMetaTags();

    expect(showMetaTagsBannerElement).not.toBeVisible();
  });
});
