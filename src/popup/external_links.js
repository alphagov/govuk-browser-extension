var Popup = Popup || {};

// With the content item we can generate a bunch of external links.
Popup.generateExternalLinks = function(contentItem, env) {

  // Not all publishing_app/rendering_app name corresponds to the name of the
  // alphagov repo.
  function appNameToRepo(appName) {
    var APP_NAMES_TO_REPOS = {
      smartanswers: 'smart-answers',
      designprinciples: 'design-principles'
    }

    return APP_NAMES_TO_REPOS[appName] || appName;
  }

  var links = [generateEditLink(contentItem, env)];

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
    url: 'https://github.com/alphagov/' + appNameToRepo(contentItem.rendering_app)
  })

  links.push({
    name: 'Publishing app: ' + contentItem.publishing_app + ' <img src="popup/github.png" width="16" />',
    url: 'https://github.com/alphagov/' + appNameToRepo(contentItem.publishing_app)
  })

  links.push({
    name: 'Content schema: ' + contentItem.schema_name + ' <img src="popup/github.png" width="16" />',
    url: 'https://github.com/alphagov/govuk-content-schemas/tree/master/dist/formats/' + contentItem.schema_name
  })

  links.push({
    name: 'Publishing API debug (dev only)',
    url: 'http://publishing-api.dev.gov.uk/debug/' + contentItem.content_id
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
      url: env.protocol + '://whitehall.' + env.serviceDomain + '/',
    }
  } else if (contentItem.document_type == 'manual') {
    return {
      name: 'Edit in Specialist Publisher',
      url: env.protocol + '://specialist-publisher.' + env.serviceDomain + '/manuals/' + contentItem.content_id,
    }
  } else if (contentItem.publishing_app == 'specialist-publisher') {
    // TODO: link directly to the specialist document edit page
    return {
      name: 'Go to Specialist Publisher',
      url: env.protocol + '://specialist-publisher.' + env.serviceDomain + '/',
    }
  }
}
