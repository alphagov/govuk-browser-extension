// This script runs in the background in Chrome. It will make the small
// GOV.UK logo visible in the URL bar whenever we're on a gov.uk page.
function showIconForGovukPages(tabId, changeInfo, tab) {
  if (tab.url.match(/gov\.uk/) || tab.url.match(/alphagov\.co\.uk/)) {
    chrome.pageAction.show(tabId);
  }
}

chrome.tabs.onCreated.addListener(showIconForGovukPages);
chrome.tabs.onUpdated.addListener(showIconForGovukPages);
