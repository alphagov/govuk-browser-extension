## GOV.UK Toolkit for Chrome

Allows easy switching between the different GOV.UK environments and content representations. Inspired by the [govuk-bookmarklets](https://github.com/dsingleton/govuk-bookmarklets).

![Screenshot](docs/screenshots.gif)

### Installation

The extension is [downloadable on the Chrome web store](https://chrome.google.com/webstore/detail/govuk-toolkit/dclfaikcemljbaoagjnedmlppnbiljen).

If you don't want to install from the web store for security reasons, you can install a non-self updating copy like this:

1. [Download the source from GitHub](https://github.com/tijmenb/govuk-toolkit-chrome/archive/master.zip) and unzip.
2. Visit [chrome://extensions](chrome://extensions) in your browser.
3. Ensure that the Developer mode checkbox in the top right-hand corner is checked.
4. Click `Load unpacked extension…` to pop up a file-selection dialog.
5. Navigate to `src` in the extension directory, and select it.
6. Visit any page on [gov.uk](https://gov.uk)

Source: [Getting Started: Building a Chrome Extension](https://developer.chrome.com/extensions/getstarted#unpacked).

### Running the tests

Run the Jasmine test suite with:

```
$ bundle exec rake jasmine:ci
```

### Releasing the extension

1. Update the version in `manifest.json`
2. Run `rake build`
3. Upload newly created package in `/build` to the [Chrome web store](https://chrome.google.com/webstore/developer/edit/dclfaikcemljbaoagjnedmlppnbiljen)
4. Create a [new release on GitHub](https://github.com/alphagov/govuk-toolkit-chrome/releases/new)

### License

MIT License