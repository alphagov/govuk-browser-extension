import chromeWebstoreUpload from 'chrome-webstore-upload';
import { existsSync } from 'node:fs';

const store = chromeWebstoreUpload({
    extensionId: process.env.CHROME_EXTENSION_ID,
    clientId: process.env.CHROME_CLIENT_ID,
    clientSecret: process.env.CHROME_CLIENT_SECRET,
    refreshToken: process.env.CHROME_REFRESH_TOKEN,
});

const response = await store.get();

const publishedVersion =  response.crxVersion;

const currentVersion = process.env.CURRENT_VERSION

if (publishedVersion === currentVersion) {
    console.log(`Currently published version is ${publishedVersion} - nothing to do`)
    process.exit(1)
}

if (!existsSync(`build/govuk-browser-extension-chrome-${currentVersion}.zip`)) {
    console.log(`The latest version is ${currentVersion}, but a build has not been uploaded`)
    process.exit(1)
}


