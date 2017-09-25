'use strict';

function HighlightComponent() {
  this.state = false;
  this.components = extractComponentsFromPage();

  function extractComponentsFromPage() {
    return $('[class*="app-c"], [class*="pub-c"], [class*="govuk"]')
      .toArray()
      .reduce(function(array, element) {
        var blockRegex = /(app-c-|pub-c-|govuk-c-|govuk-)([^ _\n]*(?=[ \n]|$))/;
        var match = $(element).attr('class').match(blockRegex);

        if (match) {
          array.push({
            element: element,
            prefix: match[1],
            name: match[2]
          });
        }

        return array
      }, []);
  }

  this.components.forEach(setupComponent.bind(this));

  function setupComponent(component) {
    var $element = $(component.element);
    $element.attr('data-component-name', component.name);
    $element.attr('data-app-name', component.prefix);

    $element.on('click', function() {
      if (this.state) {
        window.open( Helpers.documentationUrl(component) );
      }
    }.bind(this));
  }

  chrome.runtime.onMessage.addListener(function (request) {
    if (request.trigger == 'toggleState') {
      this.toggleState();
    }
  }.bind(this));
}

HighlightComponent.prototype.toggleState = function () {
  this.state = !this.state;

  for (var i = 0; i < this.components.length; i++) {
    $(this.components[i].element).toggleClass('highlight-component', this.state);
  }

  this.sendState();
}

HighlightComponent.prototype.sendState = function() {
  chrome.runtime.sendMessage({
    action: "highlightState",
    highlightState: this.state
  });
};

var Helpers = {
  documentationUrl: function (component) {
    if (component.prefix.startsWith('app-c')) {
      return "https://" + this.appHostname() + ".herokuapp.com/component-guide/" + component.name
    } else {
      return "https://govuk-static.herokuapp.com/component-guide/" + component.name.replace('-', '_');
    }
  },

  substitutions: {
    'collections': 'govuk-collections'
  },

  appHostname: function() {
    var $rendering_element = $('meta[name="govuk:rendering-application"]');
    var rendering_app = $rendering_element[0] && $rendering_element[0]['content'];
    return this.substitutions[rendering_app] || rendering_app;
  }

}
