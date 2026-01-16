'use strict'
function ShowMetaTagsComponent () {
  this.isMetaTagsDisplayed = false

  chrome.runtime.onMessage.addListener(function (request) {
    if (request.trigger === 'toggleMetaTags') {
      this.toggleMetaTags()
    }
  }.bind(this))
}

ShowMetaTagsComponent.prototype.toggleMetaTags = function () {
  if (this.isMetaTagsDisplayed) {
    this.hideMetaTags()
  } else {
    this.showMetaTags()
  }

  this.sendState()
}

ShowMetaTagsComponent.prototype.showMetaTags = function () {
  var titleElement = document.querySelector('title')
  var titleText = ''
  if (titleElement) {
    titleText = titleElement.textContent
  }

  var titleTag = document.createElement('p')
  var titleStrong = document.createElement('strong')
  titleStrong.textContent = `title (${titleText.length}): `
  titleTag.appendChild(titleStrong)
  titleTag.appendChild(document.createTextNode(titleText))

  var metaTagContainer = document.createElement('div')
  metaTagContainer.setAttribute('id', 'govuk-chrome-toolkit-banner')
  // insert titleTag into metaTagContainer
  metaTagContainer.appendChild(titleTag)

  var metaTags = document.querySelectorAll('meta')
  metaTags.forEach(function (metaTag) {
    var metaTagName = metaTag.getAttribute('name')
    if (metaTagName === null) {
      return
    }

    var metaTagContent = metaTag.getAttribute('content')
    if (metaTagContent === null) {
      metaTagContent = ''
    }

    var metaTagInfo = document.createElement('p')
    var metaTagStrong = document.createElement('strong')
    metaTagStrong.textContent = `${metaTagName} (${metaTagContent.length}): `
    metaTagInfo.appendChild(metaTagStrong)
    metaTagInfo.appendChild(document.createTextNode(metaTagContent))

    // insert metaTagInfo into metaTagContainer
    metaTagContainer.appendChild(metaTagInfo)
  })

  document.body.prepend(metaTagContainer)

  this.isMetaTagsDisplayed = true
}

ShowMetaTagsComponent.prototype.hideMetaTags = function () {
  var hideMetaTagsBanner = document.querySelector('#govuk-chrome-toolkit-banner')
  hideMetaTagsBanner.remove()

  this.isMetaTagsDisplayed = false
}

ShowMetaTagsComponent.prototype.sendState = function () {
  chrome.runtime.sendMessage({
    action: 'showMetaTagsState',
    metaTagsState: this.isMetaTagsDisplayed
  })
}
