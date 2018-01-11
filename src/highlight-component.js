'use strict';

function HighlightComponent() {
  this.state = false;
  this.metaTags = false;
  this.components = extractComponentsFromPage();

  function extractComponentsFromPage() {
    return $('[class*="app-c"], [class*="pub-c"], [class*="gem-c"], [class*="govuk"]')
      .toArray()
      .reduce(function(array, element) {
        var blockRegex = /(app-c-|pub-c-|gem-c-|govuk-c-|govuk-)([^ _\n]*(?=[ \n]|$))/;
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
    } else if (request.trigger == 'toggleMetaTags') {
      this.toggleMetaTags();
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

HighlightComponent.prototype.toggleMetaTags = function () {
  this.metaTags = !this.metaTags;

  if(this.metaTags) {
    var msgElm = document.createElement("div");
    var selectElement = document.getElementsByTagName("title")[0];
    var msg = "<p><strong>title (" + selectElement.innerHTML.length + "):</strong> " + selectElement.innerHTML + "</p>";
    var codeSegments = document.getElementsByTagName("meta");

    for (var i=0; i < codeSegments.length;i++) {
      if (codeSegments[i].getAttribute("name") !== null) {
        var strs = codeSegments[i].getAttribute("content");
        msg += "<p><strong>" + codeSegments[i].getAttribute("name") + " (" + strs.length + "):</strong> " + strs + "</p>";
      }
    }

    msgElm.innerHTML = '<div id="govuk-chrome-toolkit-banner" style="border:2px solid #000;background:#ffc;text-align:left;padding:1em;">' + msg + "</div>";
    document.body.insertBefore(msgElm, document.body.firstChild);
  } else {
    $('#govuk-chrome-toolkit-banner').remove();
  }

  this.sendState();
};

HighlightComponent.prototype.sendState = function() {
  chrome.runtime.sendMessage({
    action: "highlightState",
    highlightState: this.state,
    metaTags: this.metaTags
  });
};

var Helpers = {
  documentationUrl: function (component) {
    if (component.prefix.startsWith('app-c')) {
      return "https://" + this.appHostname() + ".herokuapp.com/component-guide/" + component.name
    } else if (component.prefix.startsWith('gem-c')) {
      return "https://" + this.appHostname() + ".herokuapp.com/component-guide/" + component.name.replace(/-/g, '_');
    } else {
      return "https://govuk-static.herokuapp.com/component-guide/" + component.name.replace(/-/g, '_');
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
