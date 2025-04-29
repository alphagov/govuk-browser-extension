'use strict'

/* global ContentBlocksComponent loadFixtures */

describe('Content blocks component', function () {
  var banner
  var contentBlocksComponent

  beforeEach(function () {
    window.chrome = {
      runtime: {
        onMessage: {
          addListener: function () {}
        },
        sendMessage: function () {}
      }
    }

    loadFixtures('content-blocks.html')

    contentBlocksComponent = new ContentBlocksComponent()
    contentBlocksComponent.toggleHighlight()

    banner = document.querySelector('.govuk-chrome-content-blocks-banner')
  })

  it('highlights content blocks', function () {
    var contentBlocks = document.querySelectorAll('.content-embed')

    contentBlocks.forEach(function (el) {
      expect(el).toHaveClass('highlight-content-block')
    })
  })

  it('shows content blocks in the banner', function () {
    expect(banner).not.toBeNullish()

    var header = banner.querySelector('.govuk-chrome-content-blocks-banner__heading')
    var subheading = banner.querySelector('.govuk-chrome-content-blocks-banner__subhead')
    var buttons = banner.querySelectorAll('.govuk-chrome-content-blocks-banner__button')

    expect(header.innerText).toEqual('Content Blocks')
    expect(subheading.innerText).toEqual('email address - enquiries@companieshouse.gov.uk')
    expect(buttons.length).toEqual(2)
  })

  it('allows content blocks to be linked to', function () {
    var realGetElementById = document.getElementById
    var buttons = banner.querySelectorAll('.govuk-chrome-content-blocks-banner__button')

    var stubs = Array.from(buttons).map(function (button) {
      var stub = document.createElement('span')
      stub.setAttribute('id', button.dataset.contentBlockId)
      return stub
    })

    spyOn(document, 'getElementById').and.callFake(function (id) {
      var stub = stubs.find(function (stub) {
        return stub.getAttribute('id') === id
      })

      if (stub) {
        return stub
      } else {
        return realGetElementById.call(document, id)
      }
    })

    buttons.forEach(function (button) {
      var stub = stubs.find(function (stub) {
        return stub.getAttribute('id') === button.dataset.contentBlockId
      })
      var scrollspy = spyOn(stub, 'scrollIntoView')

      button.dispatchEvent(new Event('click'))

      expect(scrollspy).toHaveBeenCalled()
    })
  })
})
