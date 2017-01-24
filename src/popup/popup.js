// This script is executed when the popup is opened.
var Popup = Popup || {};

(function() {
  // Execute a script on the main thread (which has access to the currently
  // loaded page). This script will call back to us.
  $(function () {
    chrome.tabs.executeScript(null, {
      file: "fetch-page-data.js"
    });
  })

  // This listener waits for the `populatePopup` message to be sent, from
  // fetch-page-data.js (called above). It will forward the location to our main
  // render function.
  chrome.runtime.onMessage.addListener(function (request, _sender) {
    if (request.action == "populatePopup") {
      initializeBuckets(request.abTestBuckets, function (initializedBuckets) {
        renderPopup(
          request.currentLocation,
          request.renderingApplication,
          initializedBuckets);
      });
    }
  });

  function initializeBuckets(abTestBuckets, handleResponse) {
    chrome.runtime.sendMessage({
      action: 'initialize-ab-buckets',
      abTestBuckets: abTestBuckets
    }, handleResponse);
  }

  // Render the popup.
  function renderPopup(location, renderingApplication, abTestBuckets) {
    // Creates a view object with the data and render a template with it.
    var view = createView(location, renderingApplication, abTestBuckets);
    var template = $('#template').html();
    $('#content').html(Mustache.render(template, view));
    setupClicks();

    var contentStore = view.contentLinks.find(function (el) { return el.name == "Content item (JSON)" })

    if (contentStore) {
      // Request the content item to add some extra links.
      $.getJSON(contentStore.url, function(contentStoreData) {
        view.externalLinks = Popup.generateExternalLinks(contentStoreData, view.currentEnvironment);
        $('#content').html(Mustache.render(template, view));
        setupClicks();
      })
    }

    setupAbToggles(location.href);
  }

  function setupClicks() {
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
    $('a:not(.external)').on('click', function(e) {
      if (userOpensPageInNewWindow(e)) {
        return;
      }

      chrome.tabs.update(null, { url: $(this).attr('href') });

      // This will provide us with a `location` object just like `window.location`.
      var location = document.createElement('a');
      location.href = $(this).attr('href');

      renderPopup(location);
    })
  }

  // Best guess if the user wants a new window opened.
  // https://stackoverflow.com/questions/20087368/how-to-detect-if-user-it-trying-to-open-a-link-in-a-new-tab
  function userOpensPageInNewWindow(e) {
    return e.ctrlKey || e.shiftKey || e.metaKey || (e.button && e.button == 1);
  }

  function setupAbToggles(url) {
    $('.ab-test-bucket').on('click', function(e) {

      chrome.runtime.sendMessage({
        action: 'set-ab-bucket',
        abTestName: $(this).data('testName'),
        abTestBucket: $(this).data('bucket'),
        url: url
      });

      $(this).addClass('ab-bucket-selected');
      $(this).siblings('.ab-test-bucket').removeClass('ab-bucket-selected');
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
