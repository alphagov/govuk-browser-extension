'use strict'
/* global HighlightComponent loadFixtures spyOnEvent setFixtures Helpers */

describe('Toggling component highlighting', function () {
  var breadcrumbsElement
  var highlightComponent

  beforeEach(function () {
    loadFixtures('gem-c-breadcrumbs.html')

    // Mock addListener function to call toggleComponents trigger when initialized
    window.chrome = {
      runtime: {
        onMessage: {
          addListener: function (callback) {
            /* eslint-disable-next-line */
            callback({ trigger: 'toggleComponents' })
          }
        },
        sendMessage: function () {}
      }
    }

    highlightComponent = new HighlightComponent()

    breadcrumbsElement = document.querySelector('#jasmine-fixtures .gem-c-breadcrumbs')
  })

  it('highlights govuk components', function () {
    expect(breadcrumbsElement).toHaveClass('highlight-component')
  })

  it('exposes the component name as data attribute', function () {
    expect(breadcrumbsElement.dataset.componentName).toEqual('breadcrumbs')
  })

  it('exposes the app name as data attribute', function () {
    expect(breadcrumbsElement.dataset.appName).toEqual('gem-c-')
  })

  it("adds the ability to click through to the component's documentation", function () {
    spyOn(window, 'open').and.callThrough()
    var clickEvent = spyOnEvent(breadcrumbsElement, 'click')

    breadcrumbsElement.click()

    expect(clickEvent).toHaveBeenTriggered()
    expect(window.open).toHaveBeenCalledWith(
      'https://govuk-publishing-components.herokuapp.com/component-guide/breadcrumbs'
    )
  })

  it('removes the highlight when toggled off', function () {
    highlightComponent.toggleComponents()

    expect(breadcrumbsElement).not.toHaveClass('highlight-component')
  })

  it('removes the click functionality when toggled off', function () {
    spyOn(window, 'open').and.callThrough()
    highlightComponent.toggleComponents()

    var clickEvent = spyOnEvent(breadcrumbsElement, 'click')

    breadcrumbsElement.click()

    expect(clickEvent).toHaveBeenTriggered()
    expect(window.open).not.toHaveBeenCalled()
  })
})

describe('highlightComponent', function () {
  beforeEach(function () {
    window.chrome = {
      runtime: {
        onMessage: {
          addListener: function (callback) { }
        },
        sendMessage: function () {}
      }
    }
  })

  describe('components', function () {
    var html

    beforeEach(function () {
      loadFixtures(
        'app-c-back-to-top.html',
        'gem-c-breadcrumbs.html',
        'gem-c-button.html',
        'gem-c-label.html'
      )

      html = document.querySelector('#jasmine-fixtures')
    })

    it('builds an array of components', function () {
      var highlightComponent = new HighlightComponent()

      expect(highlightComponent.components).toEqual(
        [
          {
            name: 'back-to-top',
            prefix: 'app-c-',
            element: html.querySelector('.app-c-back-to-top')
          },
          {
            name: 'breadcrumbs',
            prefix: 'gem-c-',
            element: html.querySelector('.gem-c-breadcrumbs')
          },
          {
            name: 'button',
            prefix: 'gem-c-',
            element: html.querySelector('.gem-c-button')
          },
          {
            name: 'label',
            prefix: 'gem-c-',
            element: html.querySelector('.gem-c-label')
          }
        ]
      )
    })
  })

  describe('toggleComponents', function () {
    it('toggles the internal state', function () {
      var highlightComponent = new HighlightComponent()

      expect(highlightComponent.isComponentsHighlighted).toEqual(false)

      highlightComponent.toggleComponents()
      expect(highlightComponent.isComponentsHighlighted).toEqual(true)

      highlightComponent.toggleComponents()
      expect(highlightComponent.isComponentsHighlighted).toEqual(false)
    })

    it('toggles the highlight-component class', function () {
      loadFixtures('gem-c-button.html')

      var highlightComponent = new HighlightComponent()

      var buttonElement = document.querySelector('#jasmine-fixtures .gem-c-button')
      expect(buttonElement).not.toHaveClass('highlight-component')

      highlightComponent.toggleComponents()
      expect(buttonElement).toHaveClass('highlight-component')

      highlightComponent.toggleComponents()
      expect(buttonElement).not.toHaveClass('highlight-component')
    })
  })
})

describe('Helpers.documentationUrl', function () {
  it("creates the correct URL for 'app' components with substitution", function () {
    setFixtures('<head><meta name="govuk:rendering-app" content="collections"></head>')
    Helpers.substitutions = {
      collections: 'another_host'
    }
    expect(
      Helpers.documentationUrl({
        prefix: 'app-c',
        name: 'back-to-top'
      })
    ).toEqual(
      'https://another_host.herokuapp.com/component-guide/back-to-top'
    )
  })

  it("creates the correct URL for 'app' components without substitution", function () {
    setFixtures('<head><meta name="govuk:rendering-app" content="rendering_app"></head>')
    Helpers.substitutions = {
      collections: 'another_host'
    }
    expect(
      Helpers.documentationUrl({
        prefix: 'app-c',
        name: 'back-to-top'
      })
    ).toEqual(
      'https://rendering_app.herokuapp.com/component-guide/back-to-top'
    )
  })

  it("creates the correct URL for 'gem' components", function () {
    setFixtures('<head><meta name="govuk:rendering-app" content="rendering_app"></head>')
    Helpers.substitutions = {
      collections: 'another_host'
    }
    expect(
      Helpers.documentationUrl({
        prefix: 'gem-c',
        name: 'label'
      })
    ).toEqual(
      'https://govuk-publishing-components.herokuapp.com/component-guide/label'
    )
  })
})
