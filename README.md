# GOV.UK Toolkit for Chrome and Firefox

Allows easy switching between the different GOV.UK environments and content representations. Inspired by the [govuk-bookmarklets](https://github.com/dsingleton/govuk-bookmarklets).

![Screenshot](docs/screenshots.gif)

## Installation

The extension is [downloadable on the Chrome web store](https://chrome.google.com/webstore/detail/govuk-toolkit/dclfaikcemljbaoagjnedmlppnbiljen) and [AMO for Firefox](https://addons.mozilla.org/en-GB/firefox/addon/govuk-browser-extension-ff/).

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

1. [Download the source from GitHub](https://github.com/alphagov/govuk-browser-extension/archive/main.zip) and unzip.
2. Visit [about:debugging](about:debugging/runtime/this-firefox) in your browser.
3. Click `Load Temporary Add-on` to pop up a file selection dialog.
4. Navigate to `src` in the extension directory, and select `manifest.json`.
5. Visit any page on [GOV.UK](https://www.gov.uk).

Source: [Temporary installation in Firefox](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Temporary_Installation_in_Firefox).

## Running the tests

You'll need jasmine-browser, which you can set up with:

```
$ npm install
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

## Getting permission to release

1. You will need to be a registered Chrome Web Store Developer
2. Once you are registered, ask to be added to the the [govuk google chrome developers google group](https://groups.google.com/a/digital.cabinet-office.gov.uk/g/google-chrome-developers).
3. An existing developer will then need to go into their Chrome web console and run the sync task so that you can release the extension as a member of the group.

## Releasing the extension

1. Install `jq`. For example, on mac, you can do it using brew 'brew install jq'
2. Update the version in `manifest_base.json`
3. Run `npm run build`
4. Create a Pull Request with the new package committed
5. Upload newly created package created for chrome at`/build/govuk-browser-extension-chrome-{version}.zip` to the [Chrome web store](https://chrome.google.com/webstore/devconsole/06b3913d-07a7-479e-94aa-05bb5b3cd44d/dclfaikcemljbaoagjnedmlppnbiljen/edit/package).
6. Upload newly created package created for firefox at `/build/govuk-browser-extension-firefox-{version}.zip` to [Firefox Add-ons](https://addons.mozilla.org/en-US/developers/addon/govuk-browser-extension-ff/versions/submit/). Account details in the [AWS Secrets Manager](https://eu-west-1.console.aws.amazon.com/secretsmanager). See the documentation in [Retrieve a credential from Secrets Manager](https://docs.publishing.service.gov.uk/manual/secrets-manager.html#retrieve-a-credential-from-secrets-manager)

### Note

   Firefox and chrome currently disagree on few things with respect to V3 of manifest.json, so inorder to accommodate for
   both the browser, we would need a separate build for each browser with their manifest.json catering to each of them. To
   do this, we have created two manifest.json for each browser and have updated build script to generate separate
   manifest.json for each of them during the build.

### License

MIT License
