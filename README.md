# GOV.UK Toolkit for Chrome and Firefox

Allows easy switching between the different GOV.UK environments and content representations. Inspired by the [govuk-bookmarklets](https://github.com/dsingleton/govuk-bookmarklets).

![Screenshot](docs/screenshots.gif)

## Installation

The extension is [downloadable on the Chrome web store](https://chrome.google.com/webstore/detail/govuk-toolkit/dclfaikcemljbaoagjnedmlppnbiljen) and [AMO for Firefox](https://addons.mozilla.org/en-GB/firefox/addon/govuk-browser-extension/).

If you don't want to install from your browser's web store for security reasons, you can install a local non-self updating copy.

### For Chrome:

1. [Download the source from GitHub](https://github.com/alphagov/govuk-browser-extension/archive/main.zip) and unzip.
2. Visit [chrome://extensions](chrome://extensions) in your browser.
3. Ensure that the Developer mode checkbox in the top right-hand corner is checked.
4. Click `Load unpacked extension…` to pop up a file selection dialog.
5. Navigate to `src` in the extension directory, and select it.
6. Visit any page on [GOV.UK](https://www.gov.uk).

Source: [Getting Started: Building a Chrome Extension](https://developer.chrome.com/extensions/getstarted#unpacked).

### For Firefox:

Extensions installed using the following instructions are only active while Firefox
is open and are removed on exit. Permanently-active extensions can be only be
installed from packages signed by Mozilla.

1. [Download the source from GitHub](https://github.com/alphagov/govuk-browser-extension/archive/master.zip) and unzip.
2. Visit [about:debugging](about:debugging) in your browser.
4. Click `Load Temporary Add-on` to pop up a file selection dialog.
5. Navigate to `src` in the extension directory, and select `manifest.json`.
6. Visit any page on [GOV.UK](https://www.gov.uk).

Source: [Temporary installation in Firefox](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Temporary_Installation_in_Firefox).

## Running the tests

You'll need jasmine-browser, which you can set up with:

```
$ npm test
```

You can then run the tests with:

```
$ npm test
```

This will start a server and run the tests in a browser (chrome by default).

If you want the browser to remain open with the test results, you can use

```
$ npx jasmine-browser-runner serve
```

..then navigate to http://localhost:8888/

## Releasing the extension

1. Update the version in `manifest.json`
2. Run `npm run build`
3. Create a Pull Request with the new package committed
4. Upload newly created package in `/build` to the [Chrome web store](https://chrome.google.com/webstore/devconsole/06b3913d-07a7-479e-94aa-05bb5b3cd44d/dclfaikcemljbaoagjnedmlppnbiljen/edit/package).
5. Upload newly created package in `/build` to [Firefox Add-ons](https://addons.mozilla.org/en-US/developers/addon/govuk-browser-extension/versions/submit/). Account details in the [2nd line password store](https://github.com/alphagov/govuk-secrets/tree/master/pass/2ndline/firefox).

### License

MIT License
