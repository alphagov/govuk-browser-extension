var Popup = Popup || {};

// With the content item we can generate a bunch of external links.
Popup.generateExternalLinks = function(contentItem, env) {

  // Not all publishing_apps name corresponds to the name of the
  // alphagov repo.
  function publishingAppNameToRepo(appName) {
    var APP_NAMES_TO_REPOS = {
      smartanswers: 'smart-answers',
      tariff: 'trade-tariff-backend'
    };

    return APP_NAMES_TO_REPOS[appName] || appName;
  }

  // Not all rendering_apps name corresponds to the name of the
  // alphagov repo.
  function renderingAppNameToRepo(appName) {
    var APP_NAMES_TO_REPOS = {
      smartanswers: 'smart-answers',
      designprinciples: 'design-principles',
      'whitehall-frontend': 'whitehall',
      businesssupportfinder: 'business-support-finder',
      tariff: 'trade-tariff-frontend'
    };

    return APP_NAMES_TO_REPOS[appName] || appName;
  }

  var links = [generateEditLink(contentItem, env)];

  var schemaName = contentItem.schema_name || "";
  if (schemaName.indexOf("placeholder") !== -1) {
    schemaName = "placeholder"
  }

  links.push({
    name: 'Look up in content-tagger',
    url: env.protocol + '://content-tagger.' + env.serviceDomain + '/content/' + contentItem.content_id,
  })

  links.push({
    name: 'Look up in search-admin',
    url: env.protocol + '://search-admin.' + env.serviceDomain + '/results/result?base_path=' + encodeURIComponent(contentItem.base_path),
  })

  links.push({
    name: 'Rendering app: ' + contentItem.rendering_app + ' <img src="popup/github.png" width="16" />',
    url: 'https://github.com/alphagov/' + renderingAppNameToRepo(contentItem.rendering_app)
  })

  links.push({
    name: 'Publishing app: ' + contentItem.publishing_app + ' <img src="popup/github.png" width="16" />',
    url: 'https://github.com/alphagov/' + publishingAppNameToRepo(contentItem.publishing_app)
  })

  links.push({
    name: 'Content schema: ' + schemaName + ' <img src="popup/github.png" width="16" />',
    url: 'https://github.com/alphagov/govuk-content-schemas/tree/master/dist/formats/' + schemaName
  })

  links.push({
    name: 'Publishing API debug (SSH tunnel required)',
    url: env.protocol + '://publishing-api.' + env.serviceDomain + '/debug/' + contentItem.content_id
  })

  return links.filter(function(item) { return item != undefined });
}

function generateEditLink(contentItem, env) {
  if (contentItem.document_type == 'topic') {
    return {
      name: 'Edit in collections-publisher',
      url: env.protocol + '://collections-publisher.' + env.serviceDomain + '/topics/' + contentItem.content_id,
    }
  } else if (contentItem.document_type == 'mainstream_browse_page') {
    return {
      name: 'Edit in collections-publisher',
      url: env.protocol + '://collections-publisher.' + env.serviceDomain + '/mainstream-browse-pages/' + contentItem.content_id,
    }
  } else if (contentItem.publishing_app == 'publisher') {
    return {
      name: 'Look up in Mainstream Publisher',
      url: env.protocol + '://publisher.' + env.serviceDomain + '/?list=published&string_filter=' + contentItem.base_path.substring(1) + '&user_filter=all',
    }
  } else if (contentItem.publishing_app == 'whitehall') {
    return {
      name: 'Go to Whitehall Publisher',
      url: env.protocol + '://whitehall-admin.' + env.serviceDomain + '/',
    }
  } else if (contentItem.document_type == 'manual') {
    return {
      name: 'Edit in Manuals Publisher',
      url: env.protocol + '://manuals-publisher.' + env.serviceDomain + '/manuals/' + contentItem.content_id,
    }
  } else if (contentItem.publishing_app == 'specialist-publisher') {
    // TODO: link directly to the specialist document edit page
    return {
      name: 'Go to Specialist Publisher',
      url: env.protocol + '://specialist-publisher.' + env.serviceDomain + '/',
    }
  }
}
