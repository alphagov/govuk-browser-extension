// This script is executed when the popup is opened.
var Popup = Popup || {};

(function() {
  // Execute a script on the main thread (which has access to the currently
  // loaded page). This script will call back to us.
  $(function () {
    chrome.tabs.executeScript(null, {
      file: "fetch-page-data.js"
    });

    chrome.tabs.executeScript(null, {
      code: "window.highlightComponent = window.highlightComponent || new HighlightComponent"
    });
  })

  // This listener waits for the `populatePopup` message to be sent, from
  // fetch-page-data.js (called above). It will forward the location to our main
  // render function.
  chrome.runtime.onMessage.addListener(function (request, _sender) {
    if (request.action == "populatePopup") {
      // When we're asked to populate the popup, we'll first send the current
      // buckets back to the main thread, which "persists" them.
      var abTestSettings = chrome.extension.getBackgroundPage().abTestSettings;
      var abTestBuckets = abTestSettings.initialize(request.abTestBuckets, request.currentLocation.href);

      renderPopup(
        request.currentLocation,
        request.renderingApplication,
        abTestBuckets
      );
    }
  });

  chrome.runtime.onMessage.addListener(function (request, _sender) {
    if (request.action == "highlightState") {
      // When we're asked to populate the popup, we'll first send the current
      // buckets back to the main thread, which "persists" them.
      if (request.highlightState)
        $('#highlight-components').text('Stop highlighting components');
      else
        $('#highlight-components').text('Highlight Components');
    }
  });

  // Render the popup.
  function renderPopup(location, renderingApplication, abTestBuckets) {
    // Creates a view object with the data and render a template with it.
    var view = createView(location, renderingApplication, abTestBuckets);

    var contentStore = view.contentLinks.find(function (el) { return el.name == "Content item (JSON)" })

    if (contentStore) {
      // Request the content item to add some extra links.
      $.getJSON(contentStore.url, function(contentStoreData) {
        view.externalLinks = Popup.generateExternalLinks(contentStoreData, view.currentEnvironment);
        renderView(view, location.href);
      })
    } else {
      renderView(view, location.href);
    }
  }

  function renderView(view, currentUrl) {
    var template = $('#template').html();
    $('#content').html(Mustache.render(template, view));
    setupClicks(currentUrl);

    setupAbToggles(currentUrl);

    chrome.tabs.executeScript(null, {
      code: "window.highlightComponent.sendState()"
    });
  }

  function setupClicks(currentUrl) {
    // Clicking on a link won't open the tab because we're in a separate window.
    // Open external links (to GitHub etc) in a new tab.
    $('a.external').on('click', function(e) {
      if (userOpensPageInNewWindow(e)) {
        return;
      }

      chrome.tabs.create({ url: $(this).attr('href') });
    })

    // Clicking normal links should change the current tab. The popup will not
    // update itself automatically, we need to re-render the popup manually.
    $('a.internal').on('click', function(e) {
      if (userOpensPageInNewWindow(e)) {
        return;
      }

      chrome.tabs.update(null, { url: $(this).attr('href') });

      // This will provide us with a `location` object just like `window.location`.
      var location = document.createElement('a');
      location.href = $(this).attr('href');

      // TODO: we're not actually re-rendering the popup correctly here, because
      // we don't have access to the DOM here. This is a temporary solution to
      // make most functionality work after the user clicks a button in the popup.
      renderPopup(location, "", {});
    })

    $('#highlight-components').on('click', function(e) {
      e.preventDefault();

      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        var govukTab = tabs[0];
        chrome.tabs.sendMessage(govukTab.id, { trigger: 'toggleState' });
      })
    })
  }

  // Best guess if the user wants a new window opened.
  // https://stackoverflow.com/questions/20087368/how-to-detect-if-user-it-trying-to-open-a-link-in-a-new-tab
  function userOpensPageInNewWindow(e) {
    return e.ctrlKey || e.shiftKey || e.metaKey || (e.button && e.button == 1);
  }

  function setupAbToggles(url) {
    $('.ab-test-bucket').on('click', function(e) {
      var $selectedBucket = $(this);

      var abTestSettings = chrome.extension.getBackgroundPage().abTestSettings;
      abTestSettings.setBucket(
        $selectedBucket.data('testName'),
        $selectedBucket.data('bucket'),
        url,
        function () {
          $selectedBucket.addClass('ab-bucket-selected');
          $selectedBucket.siblings('.ab-test-bucket').removeClass('ab-bucket-selected');

          chrome.tabs.reload(null, { bypassCache: true });
        }
      );
    });
  }

  // This is the view object. It takes a location and the name of the rendering
  // app and creates an object with all URLs and other view data to render the
  // pop.
   function createView(location, renderingApplication, abTestBuckets) {
    var environment = Popup.environment(location);
    var contentLinks = Popup.generateContentLinks(location, environment.currentEnvironment, renderingApplication);
    var abTests = Popup.findActiveAbTests(abTestBuckets);

    return {
      environments: environment.allEnvironments,
      currentEnvironment: environment.currentEnvironment,
      contentLinks: contentLinks,
      // external links will be populated by a call to the content store
      externalLinks: [],
      abTests: abTests
    }
  }
}());
