#!/usr/bin/env bash

echo "Building package"
version=$(jq -r '.version' < src/manifest_base.json)
echo "Version is $version"
rm -f manifest.json
cd src
jq -s 'add' common.json manifest_chrome.json > manifest.json
zip --exclude=.DS_Store --exclude=manifest_chrome.json --exclude=manifest_firefox.json -r ../build/govuk-browser-extension-chrome-$version.zip .
rm -f manifest.json
jq -s 'add'  common.json manifest_firefox.json > manifest.json
zip --exclude=.DS_Store --exclude=manifest_chrome.json --exclude=manifest_firefox.json -r ../build/govuk-browser-extension-firefox-$version.zip .
