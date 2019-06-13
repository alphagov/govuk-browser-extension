"use strict";

function DesignModeComponent() {
  this.state = false;
  chrome.runtime.onMessage.addListener(function (request) {
    if (request.trigger == "toggleDesignMode") {
      this.toggleDesignMode();
    }
  }.bind(this));
}

DesignModeComponent.prototype.toggleDesignMode = function () {
  this.state = !this.state;

  window.document.designMode = this.state ? "on" : "off";
  this.toggleDesignModeBanner();
  this.sendState();
}

DesignModeComponent.prototype.toggleDesignModeBanner = function() {
  var id = "govuk-chrome-toolkit-design-mode-banner";
  if (this.state) {
    $('body').prepend("\
      <div class=\"govuk-panel design-mode-component__banner\" id=\""+ id + "\">\
        <div class=\"govuk-panel__body\">\
          You are in design mode.\
        </div>\
      </div>\
    ");
  } else {
    $("#"+id).remove();
  }
}

DesignModeComponent.prototype.sendState = function() {
  chrome.runtime.sendMessage({
    action: "designModeState",
    designModeState: this.state
  });
};
