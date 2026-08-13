# History Museum — clickable prototype

The companion app itself, running as real code. It is embedded in the phone
frame on `case-museum.html` ("See it move") and opened full-screen by the two
"Open live prototype" buttons and the project card on the index.

Source project: `~/Claude/history-museum`. This copy drops that project's review
harness (topbar, spec panel, flow map) and adds:

- `index.html` — centres the app and scales it to fit whatever box it is given
  (the case-study frame, or a full browser window).
- `css/embed.css` — the small page layer around the app. Loaded **after**
  `app.css` so it can override the app's own device rounding.
- `js/main.js` — harness imports removed, plus a `?screen=` deep link.

## Deep links

`?screen=<id>` opens a single screen with the boot sequence skipped — used for
the case-study screenshots, and handy for sharing one screen.

```
prototypes/museum/index.html?screen=map
prototypes/museum/index.html?screen=access&appearance=light
```

Also accepted: `appearance` (light/dark/auto), `fontStep` (0–4), `artefact`,
`stop`, `level`. Screen ids live in `js/data.js` (`SCREEN_INFO`).

## Local viewing

It is ES modules, so it needs an HTTP origin — opening `index.html` from the
Finder will not work. From the portfolio root:

```bash
python3 -m http.server 8734
```

Then <http://localhost:8734/prototypes/museum/index.html>. On any normal static
host (Netlify, Vercel, GitHub Pages) it just works.
