require 'json'

task :build do
  puts "Building package"
  manifest = JSON.parse(File.read("src/manifest.json"))
  version = manifest['version']
  sh "zip -r build/govuk-toolkit-chrome-#{version}.zip src"
end
