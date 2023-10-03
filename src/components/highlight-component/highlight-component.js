'use strict';

function HighlightComponent() {
  this.state = false;
  this.metaTags = false;
  this.components = extractComponentsFromPage();

  // Get an array of componenets on the page. 
  function extractComponentsFromPage() {
    var componentsOnPage = document.querySelectorAll('[class*="app-c"], [class*="gem-c"]')
    var componentsOnPageArray = Array.from(componentsOnPage)
    return componentsOnPageArray.reduce(function(array, element) {
      var componentRegex = /(app-c-|gem-c-)([^ _\n]*(?=[ \n]|$))/;
      // Get the element
      // Get the value of it's class attirbute
      var elementClassName = null
      if (typeof element.className === "string") {
        elementClassName = element.className
      }
      // Check if it's an app or gem component 
      var match = false;
      
      if (elementClassName) {
        match = elementClassName.match(componentRegex);
      }

      if (match) {
        array.push({
          element: element, // 
          prefix: match[1], // componentType 
          name: match[2] // componentName 
        });
      }

      return array
    }, []);
  }

  // This is looping over the components and for each component in the array it will call the setupComponent method and pass in the component to setup.
  this.components.forEach(setupComponent.bind(this)); 

  // This method, is going to modify the HTML for each component, it'll set the attribute data-component-name and data-app-name, 
  // on line 37 the method will add a click event (listener), it'll then open a new window with the documentationUrl for that component.  
  function setupComponent(component) {
    component.element.setAttribute('data-component-name', component.name);
    component.element.setAttribute('data-app-name', component.prefix);

    component.element.addEventListener('click', function() {
      if (this.state) {
        window.open( Helpers.documentationUrl(component) );
      }
    }.bind(this));
  }

  // Feels like MetaTags and Components should be split up. Unless there's a good reason to keep them together. Their functionality is quite different. 
  chrome.runtime.onMessage.addListener(function (request) {
    if (request.trigger == 'toggleComponents') {
      this.toggleComponents();
    } else if (request.trigger == 'toggleMetaTags') {
      this.toggleMetaTags();
    }
  }.bind(this));
}

HighlightComponent.prototype.toggleComponents = function () {
  this.state = !this.state;
  // TODO: Reformat this loop to make it more readable. 
  for (var i = 0; i < this.components.length; i++) {
    this.components[i].element.classList.toggle('highlight-component', this.state);
  }

  this.sendState();
}

HighlightComponent.prototype.toggleMetaTags = function() {
  this.metaTags = !this.metaTags;

  if(this.metaTags) {
    this.showMetaTags();
  } else {
    this.hideMetaTags();
  }

  this.sendState();
};

HighlightComponent.prototype.showMetaTags = function() {
  var container = $('<div id="govuk-chrome-toolkit-banner" style="border:2px solid #000;background:#ffc;text-align:left;padding:1em;"></div>');

  var titleText = $("title").first().text();
  var strongElement = $('<strong></strong>').text("title (" + titleText.length + "): ");
  var textNode = document.createTextNode(titleText);
  $('<p>').append(strongElement).append(textNode).appendTo(container);

  var metaTags = $("meta");
  metaTags.each(function() {
    var metaTag = $(this);

    var name = metaTag.attr("name");
    if(name === undefined) {
      return;
    }

    var content = metaTag.attr("content");
    if(content === undefined) {
      content = "";
    }

    strongElement = $('<strong></strong>').text(name + " (" + content.length + "): ");
    textNode = document.createTextNode(content);

    $('<p>').append(strongElement).append(textNode).appendTo(container);
  });

  $('body').prepend(container);
}

HighlightComponent.prototype.hideMetaTags = function() {
  $('#govuk-chrome-toolkit-banner').remove();
}

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
      return "https://govuk-publishing-components.herokuapp.com/component-guide/" + component.name.replace(/-/g, '_');
    }
  },

  substitutions: {
    'collections': 'govuk-collections'
  },

  appHostname: function() {
    var rendering_element = document.querySelector('meta[name="govuk:rendering-application"]');
    var rendering_app = rendering_element.getAttribute('content');
    return this.substitutions[rendering_app] || rendering_app;
  }

}
