# Releasing the extension

1. Install `jq`. For example, on mac, you can do it using brew 'brew install jq'
2. Update the version in `manifest_base.json`
3. Run `npm run build`
4. Create a Pull Request with the new package committed
5. Once the Pull Request is merged, the latest version is released via the [Release workflow](https://github.com/alphagov/govuk-browser-extension/blob/main/.github/workflows/release.yml)

## How the secrets are managed

Ths secrets for both platforms are stored in the repo, and managed as follows:

### Firefox

Extension API keys managed via the shared account in the [Firefox developer hub](https://addons.mozilla.org/en-US/developers/)

Account details are in the [AWS Secrets Manager](https://eu-west-1.console.aws.amazon.com/secretsmanager). See the 
documentation in [Retrieve a credential from Secrets Manager](https://docs.publishing.service.gov.uk/manual/secrets-manager.html#retrieve-a-credential-from-secrets-manager)

### Chrome

There is a `chrome-webstore-upload` project in Google Cloud, which is accessible by everyone in the 
google-chrome-developers@digital.cabinet-office.gov.uk group.

If you do not have access to the group, then you can ask to be added to the 
[govuk google chrome developers google group](https://groups.google.com/a/digital.cabinet-office.gov.uk/g/google-chrome-developers).

If you need to regenerate the API keys for any reason, you can [follow the instructions here](https://github.com/fregante/chrome-webstore-upload-keys?tab=readme-ov-file)

## Note

Firefox and chrome currently disagree on few things with respect to V3 of manifest.json, so inorder to accommodate for
both the browser, we would need a separate build for each browser with their manifest.json catering to each of them. To
do this, we have created two manifest.json for each browser and have updated build script to generate separate
manifest.json for each of them during the build.
