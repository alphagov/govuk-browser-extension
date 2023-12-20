'use strict'

function HighlightComponent () {
  this.isComponentsHighlighted = false
  this.components = extractComponentsFromPage()

  // Get an array of components on the page.
  function extractComponentsFromPage () {
    var componentsOnPage = document.querySelectorAll('[class*="app-c"], [class*="gem-c"]')
    var componentsOnPageArray = Array.from(componentsOnPage)
    return componentsOnPageArray.reduce(function (array, element) {
      var componentRegex = /(app-c-|gem-c-)([^ _\n]*(?=[ \n]|$))/
      // Get the value of the components class attribute
      var elementClassName = null
      if (typeof element.className === 'string') {
        elementClassName = element.className
      }
      // Check if it's an app or gem component
      var match = false

      if (elementClassName) {
        match = elementClassName.match(componentRegex)
      }

      if (match) {
        array.push({
          element: element, //
          prefix: match[1], // componentType
          name: match[2] // componentName
        })
      }

      return array
    }, [])
  }

  // This is looping over the components and for each component in the array it will call the setupComponent method and pass in the component to setup.
  this.components.forEach(setupComponent.bind(this))

  // This method, is going to modify the HTML for each component, it'll set the attribute data-component-name and data-app-name,
  function setupComponent (component) {
    component.element.setAttribute('data-component-name', component.name)
    component.element.setAttribute('data-app-name', component.prefix)

    // the method will add a click event (listener), it'll then open a new window with the documentationUrl for that component.
    component.element.addEventListener('click', function () {
      if (this.isComponentsHighlighted) {
        window.open(Helpers.documentationUrl(component))
      }
    }.bind(this))
  }

  chrome.runtime.onMessage.addListener(function (request) {
    if (request.trigger == 'toggleComponents') {
      this.toggleComponents()
    }
  }.bind(this))
}

HighlightComponent.prototype.toggleComponents = function () {
  this.isComponentsHighlighted = !this.isComponentsHighlighted
  for (var i = 0; i < this.components.length; i++) {
    this.components[i].element.classList.toggle('highlight-component', this.isComponentsHighlighted)
  }

  this.sendState()
}

HighlightComponent.prototype.sendState = function () {
  chrome.runtime.sendMessage({
    action: 'highlightState',
    highlightState: this.isComponentsHighlighted
  })
}

var Helpers = {
  documentationUrl: function (component) {
    if (component.prefix.startsWith('app-c')) {
      return 'https://' + this.appHostname() + '.herokuapp.com/component-guide/' + component.name
    } else if (component.prefix.startsWith('gem-c')) {
      return 'https://govuk-publishing-components.herokuapp.com/component-guide/' + component.name.replace(/-/g, '_')
    }
  },

  substitutions: {
    collections: 'govuk-collections'
  },

  appHostname: function () {
    var rendering_element = document.querySelector('meta[name="govuk:rendering-application"]')
    var rendering_app = rendering_element.getAttribute('content')
    return this.substitutions[rendering_app] || rendering_app
  }

}
