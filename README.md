# Sub Intel

A browsable library of everything we know about a subdivision — access, the
coordinate system it's on, what the jurisdiction requires, the documents to
reference, and an interactive map of the benchmarks and TBMs on it.

Filed **city → county or municipality → subdivision**, so anything that belongs
to the county is recorded once and inherited by every sub under it.

## The site

**https://rmymcy.github.io/subintel/**

Add `#/demo` to the end and it opens on a worked example — a made-up Houston
with two jurisdictions, two subdivisions and four control points — so the link
can be handed to someone cold. It never overwrites an existing library.

### Turning the site on (one time)

Pages isn't enabled on this repo yet. In **Settings → Pages**, set *Source* to
**Deploy from a branch**, branch **main**, folder **/ (root)**, and Save. The
site is live at the URL above a minute later, and every push to `main` after
that redeploys it.

### Installing it on a phone

The site is a proper web app — open it and use **Install** (Android/Chrome shows
a button in the header) or **Share → Add to Home Screen** (iOS). It gets an icon,
opens without browser chrome, and starts instantly.

The app itself works with no signal; **map tiles don't** — they're fetched live
and deliberately not cached, because caching the areas a crew works would cost
tens of megabytes on the phone. Offline you get the whole library, the
requirements, the documents and every coordinate; the map is grey behind the
pins. The header shows an `offline` pill so it's obvious why.

## Truck Lab

**https://rmymcy.github.io/subintel/truck.html** — a separate, rough model for
deciding where tools live in the truck.

Every tool has a trips-per-day, every spot in a 2021 Tacoma Access Cab has a
retrieval cost in seconds, and the score is minutes a day spent fetching things.
It optimizes placement, respects what physically fits (48" lath will not go in a
rail box), separates working supply from a week of bundle stock, and prints a
layout sheet so every truck is set up the same. Numbers are estimates — time a
few with a stopwatch and they stop being guesses.

## The files

| | |
|---|---|
| `index.html` | the entire application — no build, no server, no account, no CDN |
| `sw.js` | service worker; caches the app shell (~250KB once), never map tiles |
| `manifest.webmanifest` | what makes it installable |
| `sub_intel.html` | a redirect, so the old path keeps working |
| `truck.html` | Truck Lab — the tool-placement model, standalone |

`index.html` is still self-contained: drop it on a share drive or email it and it
runs on its own, with Leaflet and its stylesheet inlined. Data lives in the
browser under `subIntelDB`, with JSON export/import to move or merge libraries.

See [SUB_INTEL.md](SUB_INTEL.md) for what's in it and why.
