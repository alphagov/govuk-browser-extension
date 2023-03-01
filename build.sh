#!/usr/bin/env bash

echo "Building package"
version=$(jq -r '.version' < src/manifest.json)
echo "Version is $version"
cd src
zip -r ../build/govuk-browser-extension-$version.zip .