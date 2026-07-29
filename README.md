My website, [blacktm.com](https://blacktm.com)

Run `rake` to build and view locally at `http://localhost:4000`

Run `rake build` to build without serving — do this before committing (see Styles)

Run `rake update` to update all gem dependencies

## Publishing

Push to `main`. GitHub Pages builds and deploys it; there's no release step.

The one thing to remember: run `rake build` first and commit `assets/css/app.css` along with everything else. It's a build artifact that GitHub Pages can't regenerate on its own.

## Styles

Edit styles in `_css/app.css` (Tailwind CSS v4 source). This file is not served directly — it gets compiled into `assets/css/app.css`, which is what the site uses.

`rake build` compiles the CSS and syncs it into place; commit both files. `rake` does the same before serving, but if you edit styles while the server is watching, only `_site` gets the update — so run `rake build` again before committing.

> GitHub Pages runs Jekyll in safe mode, which disables custom plugins like `jekyll-tailwind`. Committing the pre-built CSS means GitHub Pages can serve the site without needing to run the plugin.
