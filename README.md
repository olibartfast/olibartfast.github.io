# olibartfast.github.io

Personal site and blog — static HTML, hand-written CSS, and TypeScript for behaviour.
No generator, no templates: the pages are the source.

Live at **<https://olibartfast.ninja>** (see `CNAME`). GitHub Pages serves the
repository as-is from `master`; pushing to `master` deploys. Pages still runs
the site through Jekyll, but every page here is plain HTML without front matter,
so it passes through untouched — the theme named in `_config.yml` is never
applied.

Layout originally based on [Segey Panfilov's personal site](https://github.com/se-panfilov/se-panfilov.github.io).

## Structure

| Path | What it is |
| --- | --- |
| `index.html` | Landing page |
| `blog/index.html` | Post index — cards are hand-maintained |
| `blog/*.html` | The posts themselves |
| `css/site.css` | Landing page + blog index |
| `css/main.css` | Article pages |
| `src/main.ts` | Site behaviour (source of truth) |
| `js/main.js` | Compiled output — committed, because Pages serves the repo as-is |

## Build

```bash
npm install
npm run build      # tsc: src/*.ts -> js/*.js
npm run watch      # recompile on save
npm run typecheck  # no emit, used by CI
npm run serve      # http://localhost:8080
```

Edit `src/main.ts`, never `js/main.js` — the latter is generated and will be
overwritten. Commit both.

## Design

Cyberpunk terminal palette: near-black ground, cyan primary, magenta secondary.
Every colour, font and spacing step is a custom property on `:root` in
`css/site.css`. Article pages never load that file, so `css/main.css` declares
its own copy of the same handful of tokens at the top — **the two sets are
duplicated and must be changed together**, or the blog will drift from the
landing page.

Article pages carry a second styling layer at the bottom of `css/main.css`,
scoped under `.blog-scrollable-content`. That scoping is deliberate: each post
has its own inline `<style>` block left over from the original theme, still
using a grey/bootstrap-blue palette. The scoped selectors outrank them, so posts
pick up the current design without touching ten files. **If you add a rule that
mysteriously does nothing on a post page, check that post's inline block first.**

Motion is opt-out. `src/main.ts` injects an `FX:ON` / `FX:OFF` control into the
nav (or the article back-button row) that writes `data-fx` on `<html>` and
persists the choice; `prefers-reduced-motion` turns effects off by default.
Scanlines, the nav beam and the title glitch all key off that attribute, so
anything animated you add should too.

## Adding a post

1. Copy an existing file in `blog/` — they share one skeleton: `body.blog-page`,
   `.blog-view-wrapper` > back button + `.blog-scrollable-content`, then Prism
   script tags and `<script type="module" src="../js/main.js"></script>`.
2. Pull in only the Prism language components the post actually uses.
3. Add a card to `blog/index.html`, and to the three-card teaser in
   `index.html` if it should show on the landing page.

## Leftovers

`vendor/`, `scss/`, `css/freelancer.css`, `css/freelancer.min.css` and `mail/`
are unused remnants of the Start Bootstrap "Freelancer" theme this site started
from. Nothing links to them and they are safe to delete.
