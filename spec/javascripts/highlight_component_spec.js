'use strict';
describe("Toggling component highlighting", function () {

  var $breadcrumbsEl;
  var highlightComponent;

  beforeEach(function () {
    loadFixtures("govuk-breadcrumbs.html")

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

    $breadcrumbsEl = $("#jasmine-fixtures .govuk-breadcrumbs");
  });

  it("highlights govuk components", function () {
    expect($breadcrumbsEl).toHaveClass("highlight-component");
  });

  it("exposes the component name as data attribute", function () {
    expect($breadcrumbsEl.data("component-name")).toEqual("breadcrumbs");
  });

  it("exposes the app name as data attribute", function () {
    expect($breadcrumbsEl.data("app-name")).toEqual("govuk-");
  });

  it("adds the ability to click through to the component's documentation", function () {
    spyOn(window, "open").and.callThrough()
    var clickEvent = spyOnEvent($breadcrumbsEl, "click");

    $breadcrumbsEl.click();

    expect(clickEvent).toHaveBeenTriggered();
    expect(window.open).toHaveBeenCalledWith(
      "https://govuk-static.herokuapp.com/component-guide/breadcrumbs"
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
        "govuk-breadcrumbs.html",
        "pub-c-button.html",
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
            prefix: "govuk-",
            element: $html.find(".govuk-breadcrumbs")[0],
          },
          {
            name: "button",
            prefix: "pub-c-",
            element: $html.find(".pub-c-button")[0],
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
      loadFixtures("pub-c-button.html");

      var highlightComponent = new HighlightComponent;

      var $buttonEl = $("#jasmine-fixtures .pub-c-button");
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

  it("creates the correct URL for 'pub' components", function () {
    expect(
      Helpers.documentationUrl({
        prefix: "pub-c",
        name: "title"
      })
    ).toEqual(
      "https://govuk-static.herokuapp.com/component-guide/title"
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
      "https://rendering_app.herokuapp.com/component-guide/label"
    )
  });

  it("creates the correct URL for (deprecated) 'govuk' components", function () {
    expect(
      Helpers.documentationUrl({
        prefix: "govuk",
        name: "beta-label"
      })
    ).toEqual(
      "https://govuk-static.herokuapp.com/component-guide/beta_label"
    )
  });

  // Currently there are no components that are using the newer govuk-c prefix
  // but we have assumed that it will follow the same component-name and
  // component_url mismatch (dashes & underscores) that exists in govuk-static
  it("creates the correct URL for 'govuk' components", function () {
    expect(
      Helpers.documentationUrl({
        prefix: "govuk-c",
        name: "component-name"
      })
    ).toEqual(
      "https://govuk-static.herokuapp.com/component-guide/component_name"
    )
  });
});
