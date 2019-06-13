"use strict";
describe("Toggling design mode", function () {
  var $bannerEl;
  var designModeComponent;

  beforeEach(function () {
    // Mock addListener function to call toggleDesignMode trigger when initialized
    window.chrome = {
      runtime: {
        onMessage: {
          addListener: function(callback) {
            callback({ trigger: 'toggleDesignMode' })
          }
        },
        sendMessage: function(){}
      }
    };
    designModeComponent = new DesignModeComponent;
    $bannerEl = $("#govuk-chrome-toolkit-design-mode-banner");
  });

  it("shows design mode banner", function () {
    expect($bannerEl.text()).toMatch(/You are in design mode./);
  });

  it("removes the banner when toggled off", function () {
    designModeComponent.toggleDesignMode();
    expect($bannerEl.parent()).toHaveLength(0);
  });

  it("design mode is on when toggled on", function () {
    expect(window.document.designMode).toEqual("on");
  });

  it("design mode is off when toggled off", function () {
    designModeComponent.toggleDesignMode();
    expect(window.document.designMode).toEqual("off");
  });
});
