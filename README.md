# Sak Watches — Simple React PWA

This repository contains a minimal Vite + React app configured as a Progressive Web App (PWA) and a GitHub Actions workflow to publish the built site to GitHub Pages.

Quick commands:

```bash
npm install
npm run dev      # run locally
npm run build    # build for production
npm run preview  # preview the production build
npm run type-check # run TypeScript type checks
```

Deployment:
- Push to `main` on GitHub. The workflow in `.github/workflows/gh-pages.yml` builds the app and publishes `./dist` to the `gh-pages` branch.
- Enable GitHub Pages for the repository (Settings → Pages) and select the `gh-pages` branch if not auto-configured.

Files of interest:
- [package.json](package.json)
- [vite.config.js](vite.config.js)
- [index.html](index.html)
- [src/App.jsx](src/App.jsx)
- [manifest.webmanifest](manifest.webmanifest)
- [.github/workflows/gh-pages.yml](.github/workflows/gh-pages.yml)
# sak-watches
watch collection portfolio
