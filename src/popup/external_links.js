var Popup = Popup || {}

// With the content item we can generate a bunch of external links.
Popup.generateExternalLinks = function (contentItem, env) {
  // Not all publishing_apps name corresponds to the name of the
  // alphagov repo.
  function publishingAppNameToRepo (appName) {
    var APP_NAMES_TO_REPOS = {
      smartanswers: 'smart-answers'
    }

    return APP_NAMES_TO_REPOS[appName] || appName
  }

  // Not all rendering_apps name corresponds to the name of the
  // alphagov repo.
  function renderingAppNameToRepo (appName) {
    var APP_NAMES_TO_REPOS = {
      smartanswers: 'smart-answers',
      'whitehall-frontend': 'whitehall'
    }

    return APP_NAMES_TO_REPOS[appName] || appName
  }

  var links = []

  generateEditLink(contentItem, env).forEach(element => {
    links.push(element)
  })

  var schemaName = contentItem.schema_name || ''
  if (schemaName.indexOf('placeholder') !== -1) {
    schemaName = 'placeholder'
  }

  links.push({
    name: 'Add tags in content-tagger',
    url: env.protocol + '://content-tagger.' + env.serviceDomain + '/content/' + contentItem.content_id
  })

  links.push({
    name: 'Rendering app: ' + contentItem.rendering_app,
    url: 'https://docs.publishing.service.gov.uk/apps/' + renderingAppNameToRepo(contentItem.rendering_app) + '.html'
  })

  links.push({
    name: 'Publishing app: ' + contentItem.publishing_app,
    url: 'https://docs.publishing.service.gov.uk/apps/' + publishingAppNameToRepo(contentItem.publishing_app) + '.html'
  })

  links.push({
    name: 'Content schema: ' + schemaName,
    url: 'https://docs.publishing.service.gov.uk/content-schemas/' + schemaName + '.html'
  })

  links.push({
    name: 'Document type: ' + contentItem.document_type,
    url: 'https://docs.publishing.service.gov.uk/document-types/' + contentItem.document_type + '.html'
  })

  return links.filter(function (item) { return item !== undefined })
}

function generateEditLink (contentItem, env) {
  if (contentItem.document_type === 'topic') {
    return [{
      name: 'Edit in collections-publisher',
      url: env.protocol + '://collections-publisher.' + env.serviceDomain + '/specialist-sector-pages/' + contentItem.content_id
    }]
  } else if (contentItem.document_type === 'step_by_step_nav') {
    return [{
      name: 'Look up in collections-publisher',
      url: env.protocol + '://collections-publisher.' + env.serviceDomain + '/step-by-step-pages'
    }]
  } else if (contentItem.document_type === 'mainstream_browse_page') {
    return [{
      name: 'Edit in collections-publisher',
      url: env.protocol + '://collections-publisher.' + env.serviceDomain + '/mainstream-browse-pages/' + contentItem.content_id
    }]
  } else if (contentItem.document_type === 'taxon') {
    return [{
      name: 'Edit in content-tagger',
      url: env.protocol + '://content-tagger.' + env.serviceDomain + '/taxons/' + contentItem.content_id
    }]
  } else if (contentItem.publishing_app === 'publisher') {
    return [{
      name: 'Look up in Mainstream Publisher',
      url: env.protocol + '://publisher.' + env.serviceDomain + '/?list=published&string_filter=' + contentItem.base_path.substring(1) + '&user_filter=all'
    }]
  } else if (contentItem.publishing_app === 'content-publisher') {
    return [{
      name: 'Edit in Content Publisher',
      url: env.protocol + '://content-publisher.' + env.serviceDomain + '/documents/' + contentItem.content_id + ':' + contentItem.locale
    }]
  } else if (contentItem.publishing_app === 'whitehall') {
    return [{
      name: 'Edit in Whitehall Publisher',
      url: env.protocol + '://whitehall-admin.' + env.serviceDomain + '/government/admin/by-content-id/' + contentItem.content_id
    }]
  } else if (contentItem.document_type === 'manual') {
    return [{
      name: 'Edit in Manuals Publisher',
      url: env.protocol + '://manuals-publisher.' + env.serviceDomain + '/manuals/' + contentItem.content_id
    }]
  } else if (contentItem.publishing_app === 'specialist-publisher') {
    return [{
      name: 'Edit in Specialist Publisher',
      url: env.protocol + '://specialist-publisher.' + env.serviceDomain + '/' + contentItem.document_type.replace(/_/g, '-') + 's/' + contentItem.content_id
    }]
  } else if (contentItem.publishing_app === 'smartanswers') {
    return [
      {
        name: 'View flow page in Github',
        url: 'https://github.com/alphagov/smart-answers/tree/main/app/flows' + contentItem.base_path.replace(/-/g, '_') + '_flow.rb'
      },
      {
        name: 'View flow details folder in Github',
        url: 'https://github.com/alphagov/smart-answers/tree/main/app/flows' + contentItem.base_path.replace(/-/g, '_') + '_flow'
      }
    ]
  } else {
    return []
  }
}
