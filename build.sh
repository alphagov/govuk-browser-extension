#!/usr/bin/env bash

echo "Building package"
version=$(jq -r '.version' < src/manifest.json)
echo "Version is $version"
cd src
zip --exclude .DS_Store -r ../build/govuk-browser-extension-$version.zip .
