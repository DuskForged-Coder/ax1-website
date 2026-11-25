# AX1 Website

A standalone, dependency-free landing page for AX1 Mini and the AX1 roadmap.
The site uses local CSS and JavaScript only; it does not need a build step,
analytics, API keys, or external fonts.

## Preview locally

From this directory, run:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Publish with GitHub Pages

Publish this folder as its own repository so AX1 source code, local state, and
configuration files are not included in the public site repository. From this
directory, after GitHub CLI authentication is restored:

```bash
gh auth login
git init -b main
git add index.html styles.css app.js favicon.svg robots.txt sitemap.xml .nojekyll .gitignore README.md .github/workflows/deploy-pages.yml
git commit -m "Create AX1 product website"
gh repo create ax1-website --public --source . --remote origin --push
```

The GitHub Actions workflow deploys the static files to Pages on each push to
`main`. Enable **Settings → Pages → Build and deployment → GitHub Actions** if
GitHub asks for the Pages source. Expected URL:
<https://duskforged-coder.github.io/ax1-website/>.

## Release notes

- The source-install steps describe the current developer workflow. A public,
  signed end-user installer is not available yet.
- AX1 source is not yet published as a public download; the Mini setup steps
  are for contributors who have been given the source checkout.
- The site's AX1 Pro section is explicitly labeled as a roadmap, not a shipping
  feature list.
- Keep the public website repository limited to these static site files. Never
  add `.env`, model weights, signing credentials, entitlement secrets, or app
  source to it.
- The website source is public for Pages deployment; publication does not grant
  a license to reuse AX1 branding or product materials.
- AX1 can be branded as the setup experience, but the installer should disclose
  Ollama when it installs that runtime and identify the third-party models it
  downloads.
