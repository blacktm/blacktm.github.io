task default: [:build, :serve]

task :build do
  system "bundle exec jekyll build --trace"
  FileUtils.cp "_site/assets/css/app.css", "assets/css/app.css"
end

task :serve do
  system "bundle exec jekyll serve --trace --baseurl \"\" --drafts"
end
