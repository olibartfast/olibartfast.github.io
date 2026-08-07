# Readme

Personal site and blog — static HTML, hand-written CSS, and TypeScript for behaviour.

Layout originally based on [Segey Panfilov's personal site](https://github.com/se-panfilov/se-panfilov.github.io).

## Structure

| Path | What it is |
| --- | --- |
| `index.html`, `blog/` | The pages themselves (no generator, no templates) |
| `css/site.css` | Landing page + blog index styles |
| `css/main.css` | Article page styles |
| `src/main.ts` | Site behaviour (source of truth) |
| `js/main.js` | Compiled output — committed, because GitHub Pages serves the repo as-is |

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
