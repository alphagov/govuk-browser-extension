import fetch from 'node-fetch';
import { existsSync } from 'node:fs';

const response = await fetch(`https://addons.mozilla.org/api/v5/addons/search/?guid=${process.env.FIREFOX_EXTENSION_ID}`);
const body = await response.json();

const publishedVersion = body.results[0].current_version.version
const currentVersion = process.env.CURRENT_VERSION

if (publishedVersion === currentVersion) {
    console.log(`Currently published version is ${publishedVersion} - nothing to do`)
    process.exit(1)
}

if (!existsSync(`build/govuk-browser-extension-firefox-${currentVersion}.zip`)) {
    console.log(`The latest version is ${currentVersion}, but a build has not been uploaded`)
    process.exit(1)
}

