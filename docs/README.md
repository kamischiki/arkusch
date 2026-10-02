# Arkusch website

A static site (no build step, no frameworks). Open `index.html` by double-click to preview it.

## Structure

```
index.html          the page
imprint.html        Impressum (name, address, arkusch e-mail)
privacy-app.html    privacy policy of the app (text mirrors the in-app policy)
privacy-site.html   privacy policy of this website
css/
  tokens.css        colours, radii, spacing, type scale, copied from AppTheme.swift
  base.css          reset, typography, focus styles, skip link
  components.css    header, switches, buttons, feature rows, reels, footer
  sections.css      page-level layout (hero, intro, story, legal)
js/
  config.js         store links, contact e-mail, reels  <- edit this
  theme.js          Outdoor (light) / Indoor (dark) switch
  i18n.js           language engine (EN / DE / UK)
  plans.js          Free vs PRO lists (move a feature between plans by changing its tier)
  stores.js         turns buttons into links or "coming soon" based on config.js
  reels.js          renders video clips from config.js
  main.js           wires it all together
i18n/               en.js, de.js, uk.js  <- all visible text lives here
                    legal-en.js, legal-de.js, legal-uk.js  <- text of the two privacy pages
fonts/              Montserrat (self-hosted, SIL OFL) + fonts.css
images/screens/     app screenshots (webp)
images/brand/       leaf logo (dark + light), favicon, link-preview image,
                    creator.jpg (your photo), signature.svg + signature-light.svg
videos/             put your reel .mp4 files here
```

## Everyday edits

- **Text or translations:** edit `i18n/en.js`, `de.js`, `uk.js`. Keys are identical in all three.
- **App Store / Mac links:** set `ios.url` and `mac.url` in `js/config.js`. While a url is empty, the button shows "coming soon".
- **Your photo:** replace `images/brand/creator.jpg` (portrait, 4:5, about 800 x 1000 px). Keep the file name.
- **Free vs PRO:** open `js/plans.js` and change a feature's `tier` between `"free"` and `"pro"` (or reorder the lines). Titles and descriptions are in `i18n/*.js` under `pl.<key>.t` and `.d`. The two feature rows marked PRO in `index.html` carry a `badge`; keep them in sync.
- **Contact e-mail:** `contactEmail` in `js/config.js` (used by "Write me", the footer and the privacy pages; the Impressum shows it as plain text on purpose). Set `imprintUrl` only if you want the footer to point elsewhere than `imprint.html`.
- **Privacy pages:** text lives in `i18n/legal-*.js`. If the app's privacy text changes, update `pa.*` there so both stay identical.
- **Reels:** copy the `.mp4` into `videos/`, add an entry to `reels` in `js/config.js`. The section stays hidden while the list is empty. Tips: 720p, H.264, a few MB each, add a `poster` image.
- **Colours:** `css/tokens.css`. Change a value there and the whole site follows.

## Publish on GitHub Pages

1. Create a repository and upload the contents of this folder (so `index.html` is at the top level).
2. Settings, Pages, "Deploy from a branch", branch `main`, folder `/ (root)`.
3. The site appears at `https://<account>.github.io/<repository>/` a minute later.

All paths are relative, so it works under a sub-path as well as on a custom domain.

## Before going live

- Replace the placeholder `images/brand/creator.jpg` with your photo.
- Check `privacy-site.html` (keys `ps.*`) against your real setup; paste the app's own German and Ukrainian policy texts into the `pa.*` keys so they match the app word for word.
- Have the German and Ukrainian texts proofread by a native speaker.
- Official App Store badge: Apple asks that you use its own badge artwork (Apple's marketing resources page). The current buttons are plain text.
