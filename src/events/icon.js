// This script runs in the background in Chrome. It will activate the small
// greyed out GOV.UK logo in the Chrome menu bar whenever we're on a gov.uk page.
chrome.declarativeContent.onPageChanged.removeRules(async () => {
  chrome.declarativeContent.onPageChanged.addRules([{
    conditions: [
      new chrome.declarativeContent.PageStateMatcher({
        pageUrl: { hostSuffix: 'www.gov.uk' },
      }),
    ],
    actions: [
      new chrome.declarativeContent.SetIcon({
        imageData: {
          19: await loadImageData('icons/crown-logo-19-active.png'),
          38: await loadImageData('icons/crown-logo-38-active.png'),
        },
      }),
      chrome.declarativeContent.ShowAction
        ? new chrome.declarativeContent.ShowAction()
        : new chrome.declarativeContent.ShowPageAction(),
    ],
  }]);
});

async function loadImageData(url) {
  const img = await createImageBitmap(await (await fetch(url)).blob());
  const {width: w, height: h} = img;
  const canvas = new OffscreenCanvas(w, h);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, w, h);
  return ctx.getImageData(0, 0, w, h);
}