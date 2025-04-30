'use strict'

function ContentBlocksComponent () {
  this.contentBlocksHighlighted = false
  this.contentBlocks = Array.from(document.querySelectorAll('.content-embed'))

  chrome.runtime.onMessage.addListener(function (request) {
    if (request.trigger === 'toggleContentBlocks') {
      this.toggleHighlight()
    }
  }.bind(this))
}

ContentBlocksComponent.prototype.toggleHighlight = function () {
  for (var i = 0; i < this.contentBlocks.length; i++) {
    this.contentBlocks[i].classList.toggle('highlight-content-block', !this.contentBlocksHighlighted)
    this.contentBlocks[i].setAttribute('data-content-block-page-identifier', `content_block_${i}`)
  }

  if (this.contentBlocksHighlighted) {
    this.hideContentBlocksBanner()
  } else {
    this.showContentBlocksBanner()
  }

  this.contentBlocksHighlighted = !this.contentBlocksHighlighted

  this.sendState()
}

ContentBlocksComponent.prototype.hideContentBlocksBanner = function () {
  var wrapper = document.querySelector('.govuk-chrome-content-blocks-banner')

  wrapper.remove()
}

ContentBlocksComponent.prototype.showContentBlocksBanner = function () {
  var wrapper = document.createElement('div')
  wrapper.classList.add('govuk-chrome-content-blocks-banner')

  var title = `<h2 class="govuk-chrome-content-blocks-banner__heading govuk-heading-m">
      Content Blocks
    </h2>`

  wrapper.insertAdjacentHTML('beforeend', title)

  if (this.contentBlocks.length) {
    var instances = Map.groupBy(this.contentBlocks, function (contentBlock) {
      var documentType = contentBlock.dataset.documentType.replace('content_block', '').replaceAll('_', ' ')
      return `${documentType} - ${contentBlock.innerText}`
    })

    instances.forEach(function (blocks, category) {
      var blockTitle = `<h3 class="govuk-chrome-content-blocks-banner__subhead govuk-heading-s">
            ${category}
        </h3>`
      wrapper.insertAdjacentHTML('beforeend', blockTitle)
      var output = ''

      blocks.forEach(function (contentBlock, index) {
        output += `
                <a class="govuk-button govuk-chrome-content-blocks-banner__button" 
                   data-content-block-target="${contentBlock.dataset.contentBlockPageIdentifier}"
                >
                    Jump to instance ${index + 1}
                </a>`
      })

      wrapper.insertAdjacentHTML('beforeend', output)
    })

    wrapper.querySelectorAll('.govuk-chrome-content-blocks-banner__button').forEach(function (element) {
      element.addEventListener('click', function (e) {
        e.preventDefault()
        var id = e.target.dataset.contentBlockTarget
        var element = document.querySelector(`[data-content-block-page-identifier=${id}]`)
        element.scrollIntoView()
      })
    })
  } else {
    wrapper.insertAdjacentHTML('beforeend', '<p>No content blocks in use on this page</p>')
  }

  document.body.prepend(wrapper)
}

ContentBlocksComponent.prototype.sendState = function () {
  chrome.runtime.sendMessage({
    action: 'contentBlockState',
    highlightState: this.contentBlocksHighlighted
  })
}
