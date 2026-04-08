describe('Popup.findAssetParentPage', function () {
  beforeEach(function () {
    spyOn(XMLHttpRequest.prototype, 'open').and.returnValue(null)
    spyOn(XMLHttpRequest.prototype, 'send').and.returnValue(null)
  })

  it('generates a link to the parent page that "owns" the asset', function () {
    spyOn(XMLHttpRequest.prototype, 'getAllResponseHeaders').and.returnValue(
      'link: <foo>; rel="up"'
    )

    var links = Popup.findAssetParentPage(
      'https://assets.publishing.service.gov.uk/media/689c79c787bf475940723f11/foo.pdf'
    )

    expect(links).toContain({
      name: 'Find parent page for this asset',
      url: 'foo'
    })
  })

  it('does not generate a link if no parent page is found', function () {
    var links = Popup.findAssetParentPage(
      'https://assets.publishing.service.gov.uk/media/689c79c787bf475940723f11/foo.pdf'
    )
    spyOn(XMLHttpRequest.prototype, 'getAllResponseHeaders').and.returnValue('')

    expect(links).toEqual([])
  })

  it('does not attempt to make an XmlHttpRequest for non-asset URLs', function () {
    Popup.findAssetParentPage(
      'https://www.gov.uk/foo'
    )

    expect(XMLHttpRequest.prototype.open).not.toHaveBeenCalled()
    expect(XMLHttpRequest.prototype.send).not.toHaveBeenCalled()
  })
})
