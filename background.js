// This script runs in the background in Chrome. It will activate the small
// greyed out GOV.UK logo in the Chrome menu bar whenever we're on a gov.uk page.
function showIconForGovukPages(tabId, changeInfo, tab) {
  if (tab.url.match(/www\.gov\.uk/) || tab.url.match(/dev\.gov\.uk/) || tab.url.match(/.*publishing\.service\.gov\.uk/)) {
    chrome.pageAction.show(tabId);
    chrome.pageAction.setIcon({tabId: tabId, path: { '19': 'icons/crown-logo-19-active.png', '38': 'icons/crown-logo-38-active.png' }});
  }
}

chrome.tabs.onCreated.addListener(showIconForGovukPages);
chrome.tabs.onUpdated.addListener(showIconForGovukPages);
