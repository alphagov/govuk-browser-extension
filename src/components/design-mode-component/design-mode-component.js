'use strict'
/* global DesignModeComponent */

function DesignModeComponent () {
  this.state = false
  chrome.runtime.onMessage.addListener(function (request) {
    if (request.trigger === 'toggleDesignMode') {
      this.toggleDesignMode()
    }
  }.bind(this))
}

DesignModeComponent.prototype.toggleDesignMode = function () {
  this.state = !this.state

  window.document.designMode = this.state ? 'on' : 'off'
  this.toggleDesignModeBanner()
  this.sendState()
}

DesignModeComponent.prototype.toggleDesignModeBanner = function () {
  var designModeBannerId = 'govuk-chrome-toolkit-design-mode-banner'
  if (this.state) {
    var designModeBanner = `
    <div class="govuk-panel design-mode-component__banner" id="${designModeBannerId}">
      <div class="govuk-panel__body">
        You are in design mode.
      </div>
    </div>
  `
    var designModeWrapper = document.createElement('div')
    designModeWrapper.innerHTML = designModeBanner
    document.body.prepend(designModeWrapper)
  } else {
    var designModeBannerElement = document.querySelector(`#${designModeBannerId}`)
    designModeBannerElement.remove()
  }
}

DesignModeComponent.prototype.sendState = function () {
  chrome.runtime.sendMessage({
    action: 'designModeState',
    designModeState: this.state
  })
}
