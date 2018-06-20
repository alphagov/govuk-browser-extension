'use strict';
describe("Toggling component highlighting", function () {

  var $breadcrumbsEl;
  var highlightComponent;

  beforeEach(function () {
    loadFixtures("gem-c-breadcrumbs.html")

    // Mock addListener function to call toggleComponents trigger when initialized
    window.chrome = {
      runtime: {
        onMessage: {
          addListener: function(callback) {
            callback({ trigger: 'toggleComponents' })
          }
        },
        sendMessage: function(){}
      }
    };

    highlightComponent = new HighlightComponent;

    $breadcrumbsEl = $("#jasmine-fixtures .gem-c-breadcrumbs");
  });

  it("highlights govuk components", function () {
    expect($breadcrumbsEl).toHaveClass("highlight-component");
  });

  it("exposes the component name as data attribute", function () {
    expect($breadcrumbsEl.data("component-name")).toEqual("breadcrumbs");
  });

  it("exposes the app name as data attribute", function () {
    expect($breadcrumbsEl.data("app-name")).toEqual("gem-c-");
  });

  it("adds the ability to click through to the component's documentation", function () {
    spyOn(window, "open").and.callThrough()
    var clickEvent = spyOnEvent($breadcrumbsEl, "click");

    $breadcrumbsEl.click();

    expect(clickEvent).toHaveBeenTriggered();
    expect(window.open).toHaveBeenCalledWith(
      "https://govuk-publishing-components.herokuapp.com/component-guide/breadcrumbs"
    )
  });

  it("removes the highlight when toggled off", function () {
    highlightComponent.toggleComponents();

    expect($breadcrumbsEl).not.toHaveClass("highlight-component");
  });

  it("removes the click functionality when toggled off", function () {
    spyOn(window, "open").and.callThrough()
    highlightComponent.toggleComponents();

    var clickEvent = spyOnEvent($breadcrumbsEl, "click");

    $breadcrumbsEl.click();

    expect(clickEvent).toHaveBeenTriggered();
    expect(window.open).not.toHaveBeenCalled();
  });
});

describe("highlightComponent", function () {
  beforeEach(function() {
    window.chrome = {
      runtime: {
        onMessage: {
          addListener: function(callback) { }
        },
        sendMessage: function(){}
      }
    };
  })

  describe("components", function () {
    var $html;

    beforeEach(function () {
      loadFixtures(
        "app-c-back-to-top.html",
        "gem-c-breadcrumbs.html",
        "gem-c-button.html",
        "gem-c-label.html"
      )

      $html = $("#jasmine-fixtures");
    });

    it("builds an array of components", function () {
      var highlightComponent = new HighlightComponent;

      expect(highlightComponent.components).toEqual(
        [
          {
            name: "back-to-top",
            prefix: "app-c-",
            element: $html.find(".app-c-back-to-top")[0],
          },
          {
            name: "breadcrumbs",
            prefix: "gem-c-",
            element: $html.find(".gem-c-breadcrumbs")[0],
          },
          {
            name: "button",
            prefix: "gem-c-",
            element: $html.find(".gem-c-button")[0],
          },
          {
            name: "label",
            prefix: "gem-c-",
            element: $html.find(".gem-c-label")[0],
          }
        ]
      )
    });
  });

  describe("toggleComponents", function () {
    it("toggles the internal state", function () {

      var highlightComponent = new HighlightComponent;

      expect(highlightComponent.state).toEqual(false);

      highlightComponent.toggleComponents();
      expect(highlightComponent.state).toEqual(true);

      highlightComponent.toggleComponents();
      expect(highlightComponent.state).toEqual(false);
    });

    it("toggles the highlight-component class", function () {
      loadFixtures("gem-c-button.html");

      var highlightComponent = new HighlightComponent;

      var $buttonEl = $("#jasmine-fixtures .gem-c-button");
      expect($buttonEl).not.toHaveClass("highlight-component");

      highlightComponent.toggleComponents();
      expect($buttonEl).toHaveClass("highlight-component");

      highlightComponent.toggleComponents();
      expect($buttonEl).not.toHaveClass("highlight-component");
    });
  });
});

describe("Helpers.documentationUrl", function () {
  it("creates the correct URL for 'app' components with substitution", function () {
    setFixtures('<head><meta name="govuk:rendering-application" content="collections"></head>');
    Helpers.substitutions =  {
      'collections': 'another_host'
    };
    expect(
      Helpers.documentationUrl({
        prefix: "app-c",
        name: "back-to-top"
      })
    ).toEqual(
      "https://another_host.herokuapp.com/component-guide/back-to-top"
    )
  });

  it("creates the correct URL for 'app' components without substitution", function () {
    setFixtures('<head><meta name="govuk:rendering-application" content="rendering_app"></head>');
    Helpers.substitutions =  {
      'collections': 'another_host'
    };
    expect(
      Helpers.documentationUrl({
        prefix: "app-c",
        name: "back-to-top"
      })
    ).toEqual(
      "https://rendering_app.herokuapp.com/component-guide/back-to-top"
    )
  });

  it("creates the correct URL for 'gem' components", function () {
    setFixtures('<head><meta name="govuk:rendering-application" content="rendering_app"></head>');
    Helpers.substitutions =  {
      'collections': 'another_host'
    };
    expect(
      Helpers.documentationUrl({
        prefix: "gem-c",
        name: "label"
      })
    ).toEqual(
      "https://govuk-publishing-components.herokuapp.com/component-guide/label"
    )
  });
});
