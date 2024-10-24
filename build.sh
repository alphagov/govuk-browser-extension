#!/usr/bin/env bash

echo "Building package"
version=$(jq -r '.version' < src/manifest_chrome.json)
echo "Version is $version"
cd src
rm -f manifest.json
cat manifest_chrome.json >> manifest.json
zip --exclude .DS_Store -r ../build/govuk-browser-extension-chrome-$version.zip .
rm -f manifest.json
cat manifest_firefox.json >> manifest.json
zip --exclude .DS_Store -r ../build/govuk-browser-extension-firefox-$version.zip .
