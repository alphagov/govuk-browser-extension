require 'json'
require 'jasmine'

load 'jasmine/tasks/jasmine.rake'

task :build do
  puts "Building package"
  manifest = JSON.parse(File.read("src/manifest.json"))
  version = manifest['version']
  sh "cd src && zip -r ../build/govuk-browser-extension-#{version}.zip ."
end

task :default => ['jasmine:ci']
