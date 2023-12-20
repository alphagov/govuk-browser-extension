'use strict'
describe('Toggling design mode', function () {
  var designModeBannerId = 'govuk-chrome-toolkit-design-mode-banner'
  var designModeBannerElement
  var designModeComponent

  beforeEach(function () {
    // Mock addListener function to call toggleDesignMode trigger when initialized
    window.chrome = {
      runtime: {
        onMessage: {
          addListener: function (callback) {
            callback({ trigger: 'toggleDesignMode' })
          }
        },
        sendMessage: function () {}
      }
    }
    designModeComponent = new DesignModeComponent()
    designModeBannerElement = document.querySelector(`#${designModeBannerId}`)
  })

  it('shows design mode banner', function () {
    expect(designModeBannerElement.textContent).toMatch(/You are in design mode./)
  })

  it('removes the banner when toggled off', function () {
    designModeComponent.toggleDesignMode()
    expect(designModeBannerElement).not.toBeVisible()
  })

  it('design mode is on when toggled on', function () {
    expect(window.document.designMode).toEqual('on')
  })

  it('design mode is off when toggled off', function () {
    designModeComponent.toggleDesignMode()
    expect(window.document.designMode).toEqual('off')
  })
})
