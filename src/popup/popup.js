// This script is executed when the popup is opened.
var Popup = Popup || {};

(function () {
  // Execute a script on the main thread (which has access to the currently
  // loaded page). This script will call back to us.

  document.addEventListener('DOMContentLoaded', async () => {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);

    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      func: () => {
        window.highlightComponent = window.highlightComponent || new HighlightComponent
        window.designModeComponent = window.designModeComponent || new DesignModeComponent
        window.showMetaTagsComponent = window.showMetaTagsComponent || new ShowMetaTagsComponent
      }
    })

    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      files: ['fetch-page-data.js']
    })
  })

  // This listener waits for the `populatePopup` message to be sent, from
  // fetch-page-data.js (called above). It will forward the location to our main
  // render function.
  chrome.runtime.onMessage.addListener(function (request, _sender) {
    if (request.action === 'populatePopup') {
      // When we're asked to populate the popup, we'll first send the current
      // buckets back to the main thread, which "persists" them.
      //var abTestSettings = chrome.extension.getBackgroundPage().abTestSettings
      // var abTestBuckets = abTestSettings.initialize(request.abTestBuckets, request.currentLocation)

      renderPopup(
        request.currentLocation,
        request.currentHost,
        request.currentOrigin,
        request.currentPathname,
        request.renderingApplication,
        request.windowHeight,
        null // abTestBuckets
      )
    }
  })

  chrome.runtime.onMessage.addListener(function (request, _sender) {
    if (request.action === 'highlightState') {
      // When we're asked to populate the popup, we'll first send the current
      // buckets back to the main thread, which "persists" them.
      if (request.highlightState) { document.querySelector('#highlight-components').textContent = 'Stop highlighting components' } else { document.querySelector('#highlight-components').textContent = 'Highlight Components' }
    }
  })

  chrome.runtime.onMessage.addListener(function (request, _sender) {
    if (request.action === 'showMetaTagsState') {
      // When we're asked to populate the popup, we'll first send the current
      // buckets back to the main thread, which "persists" them.
      if (request.metaTagsState) { document.querySelector('#highlight-meta-tags').textContent = 'Hide meta tags' } else { document.querySelector('#highlight-meta-tags').textContent = 'Show meta tags' }
    }
  })

  chrome.runtime.onMessage.addListener(function (request, _sender) {
    if (request.action === 'designModeState') {
      var toggleLink = document.querySelector('#toggle-design-mode')
      if (request.designModeState) { toggleLink.textContent = 'Turn off design mode' } else { toggleLink.textContent = 'Turn on design mode' }
    }
  })

  // Render the popup.
  function renderPopup (location, host, origin, pathname, renderingApplication, windowHeight, abTestBuckets) {
    // Creates a view object with the data and render a template with it.
    var view = createView(location, host, origin, pathname, renderingApplication, abTestBuckets)

    var contentStore = view.contentLinks.find(function (el) { return el.name === 'Content item (JSON)' })

    if (windowHeight < 600) {
      var popupContent = document.querySelector('#content')
      popupContent.style.overflowY = 'scroll'
      popupContent.style.height = windowHeight + 'px'
    }

    if (contentStore) {
      renderViewWithExternalLinks(contentStore.url, view, location)
    } else {
      renderView(view, location)
    }
  }

  async function renderViewWithExternalLinks (contentStoreUrl, view, location) {
    try {
      const response = await fetch(contentStoreUrl)
      const responseJson = await response.json()

      // update the external links array
      view.externalLinks = Popup.generateExternalLinks(responseJson, view.currentEnvironment)
      renderView(view, location)
    } catch (error) {
      renderView(view, location)
    }
  }

  async function renderView (view, currentUrl) {
    var template = document.querySelector('#template').innerHTML
    var popupContent = document.querySelector('#content')
    popupContent.innerHTML = Mustache.render(template, view)
    setupClicks()

    setupAbToggles(currentUrl)

    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);

    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      func: () => {
        window.highlightComponent.sendState()
        window.showMetaTagsComponent.sendState()
        window.designModeComponent.sendState()
      }
    })
  }

  function setupClicks () {
    // Clicking on a link won't open the tab because we're in a separate window.
    // Open external links (to GitHub etc) in a new tab.
    var externalLinks = document.querySelectorAll('a.js-external')

    externalLinks.forEach(function (externalLink) {
      externalLink.addEventListener('click', function (e) {
        e.stopPropagation()
        if (userOpensPageInNewWindow(e)) {
          return
        }
        var externalLinkHref = externalLink.getAttribute('href')
        chrome.tabs.create({ url: externalLinkHref })
      })
    })

    // Clicking normal links should change the current tab. The popup will not
    // update itself automatically, we need to re-render the popup manually.
    var rerenderPopup = document.querySelectorAll('a.js-rerender-popup')

    rerenderPopup.forEach(function (reRender) {
      reRender.addEventListener('click', function (e) {
        if (userOpensPageInNewWindow(e)) {
          return
        }
        e.preventDefault()

        var reRenderHref = reRender.getAttribute('href')
        chrome.tabs.update({ url: reRenderHref })

        // This will provide us with a `location` object just like `window.location`.
        var location = document.createElement('a')
        location.href = reRenderHref

        // TODO: we're not actually re-rendering the popup correctly here, because
        // we don't have access to the DOM here. This is a temporary solution to
        // make most functionality work after the user clicks a button in the popup.
        renderPopup(location.href, location.host, location.origin, location.pathname, {})
      })
    })

    document.querySelector('#highlight-components').addEventListener('click', function (e) {
      e.preventDefault()
      sendChromeTabMessage('toggleComponents')
    })

    document.querySelector('#highlight-meta-tags').addEventListener('click', function (e) {
      e.preventDefault()
      sendChromeTabMessage('toggleMetaTags')
    })

    document.querySelector('#toggle-design-mode').addEventListener('click', function (e) {
      e.preventDefault()
      sendChromeTabMessage('toggleDesignMode')
    })
  }

  // Best guess if the user wants a new window opened.
  // https://stackoverflow.com/questions/20087368/how-to-detect-if-user-it-trying-to-open-a-link-in-a-new-tab
  function userOpensPageInNewWindow (e) {
    return e.ctrlKey || e.shiftKey || e.metaKey || (e.button && e.button === 1)
  }

  function setupAbToggles (url) {
    var abTestBuckets = document.querySelectorAll('.ab-test-bucket')

    abTestBuckets.forEach(function (abTestBucket) {
      abTestBucket.addEventListener('click', function (e) {
        var abTestSettings = chrome.extension.getBackgroundPage().abTestSettings

        abTestSettings.setBucket(
          abTestBucket.dataset.testName,
          abTestBucket.dataset.bucket,
          url,
          function () {
            var testBuckets = document.querySelectorAll('.ab-test-bucket')
            for (var testBucket of testBuckets) {
              testBucket.classList.remove('ab-bucket-selected')
            }
            abTestBucket.classList.add('ab-bucket-selected')
            chrome.tabs.reload(tab.id, { bypassCache: true })
          }
        )
1      })
    })
  }

  // This is the view object. It takes a location, host, origin, the name of the
  // rendering app and a list of A/B test buckets and creates an object with all
  // URLs and other view data to render the popup.
  function createView (location, host, origin, pathname, renderingApplication, abTestBuckets) {
    var environment = Popup.environment(location, host, origin)
    var contentLinks = Popup.generateContentLinks(location, origin, pathname, environment.currentEnvironment, renderingApplication)
    // var abTests = Popup.findActiveAbTests(abTestBuckets)

    return {
      environments: environment.allEnvironments,
      currentEnvironment: environment.currentEnvironment,
      contentLinks: contentLinks,
      // external links will be populated by a call to the content store
      externalLinks: [],
      abTests: [] // abTests
    }
  }

  function sendChromeTabMessage (trigger) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var govukTab = tabs[0]
      chrome.tabs.sendMessage(govukTab.id, { trigger: trigger })
    })
  }
}())
