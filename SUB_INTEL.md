# Sub Intel — purpose & how it works

`index.html` · one self-contained file · storage key `subIntelDB`
Ships with the library inside it: 20 counties, 51 jurisdictions, 10 builders,
104 subdivisions and 44 sourced rules.
https://rmymcy.github.io/subintel/

---

## What it's for

Sage knows *what* the job is. It doesn't know the things that actually cost a
crew an hour at the entrance of a subdivision, and it doesn't know what the
county will reject three weeks later. Sub Intel is where that institutional
knowledge lives so it isn't stuck in one person's head or a text thread.

v1 was a flat card wall: gate code, super, a note. v2 is a **library**, because
most of what costs you time isn't specific to the sub — it belongs to the
county or the city, and every sub under it inherits it.

```
City / metro          Houston
  └ Jurisdiction      Harris County · City of Katy · a MUD · an ETJ
      └ Subdivision   Cane Island — Section 14
```

A jurisdiction carries the **coordinate system**, the **requirements** and the
**documents** that apply to everything filed under it. A subdivision carries
its own gate code, super, access warning, requirements, documents, and the
**control points** — the benchmarks we recovered and the TBMs we set — each
with its own documents, plotted on a map.

## Two ways in

**Jobs** is what opens, and it is what a crew uses. A flat list, no folders:
**Near me** sorts every site by how far the truck is from it, **Active** is the
43 subdivisions worked since August (they carry 69% of all jobs), **Recent** is
what this phone opened, **All** is everything. A metro chip row narrows any of
them — Orlando, Polk/I-4, Tampa, Sarasota–Bradenton, Daytona, Jacksonville,
SW Florida, Space Coast. The mode and metro are remembered per device.

Near me is the one that matters: the truck is parked at the subdivision, so one
tap puts it at the top of the list with no typing and no idea how the county
filed it. Location is asked once and never leaves the phone.

**Library** is the filing system — counties, jurisdictions, builders and the
rules. The office lives there. A crew never has to.

## The screens

**Landing** — one card per city, with a count of jurisdictions, subs and
control points underneath it.

**City** — the counties and municipalities filed under it. Each card shows the
coordinate system and the requirement icons that apply jurisdiction-wide.

**Jurisdiction** — its coordinate system, its requirements, its documents, then
the subdivision cards. A sub with nothing recorded renders **dashed and faded**,
so the gaps are as visible as the content.

**Subdivision** — the whole point. It reads top to bottom in the order you need
it in the truck:

| Section | What's in it |
|---|---|
| Header | gate code (large, monospace, **click to copy**), access warning in amber, the contact with a `tel:` link, the builders, requirement icons |
| Coordinate system | the zone and the control notes. Inherited values show in *italic* and name their source on hover |
| Requirements | the sub's own plus everything inherited, tagged with the jurisdiction it came from, ranked *good to know* → *required* → *critical* |
| Documents | links, each with a kind icon — spec, plat, benchmark datasheet, permit, plan set |
| Control | the map, then the list |
| Notes | benchmark notes and general notes |

## Rules, and where they come from

A subdivision does not have "requirements" so much as inherit them. Rules resolve
broadest to narrowest and a narrower scope wins on conflict:

```
everywhere  →  county  →  municipality  →  builder  →  subdivision
```

**Everywhere** is the company baseline and state law — FAC 5J-17 monumentation,
Fla. Stat. 177 plat monuments, 472.029 right of entry, the 811 locate exemption.
**Builder** is the scope people forget: a builder's rules follow their sites
across every county they work in.

Every rule carries what kind it is (tolerance, monument, inspection, PPE, hours,
benchmark, submittal, access), what work it applies to, where it came from, and
how sure we are:

- **confirmed** — it is written down in a code, a policy, or a permit record, and
  the source is linked. You can hold an inspector to it.
- **observed** — learned in the field, not yet sourced. Worth knowing and worth
  arguing with. Orange County's 0.2 ft grade tolerance is the example: enforced
  strictly, not in any published county document.

The sub page shows the whole resolved stack grouped by where each rule came
from, so it is obvious whether something is state law or one inspector's habit.
An inherited rule is edited where it lives, not on the sub.

**Every section folds.** Click a scope heading to shut that group, or a panel
header to shut the panel. With nine state-and-company rules sitting on top, the
site-specific ones get pushed off a phone screen — shut "Everywhere" once and it
stays shut on all 104 subdivisions and across reloads. The choice is keyed by
what the section is rather than which sub you were on, and it lives in the
browser as a preference, not in the library.

## Requirement icons

Five, deliberately — the ones that change what a crew does when they pull up:

| | | carries |
|---|---|---|
| 🔒 | **Security gate** | `guard shack — crew names the day before` |
| 🦺 | **Full PPE** | `hard hat, vest, glasses, boots` |
| 🕖 | **Hour limits** | `7am–6pm weekdays, no Sunday work` |
| 🌊 | **Flood zone** | `Zone AE along the west boundary` |
| 📵 | **Poor signal** | `no service past the back half` |

Each one **carries its own detail**, so "hour limits" says *which* hours rather
than leaving you to go find out. Tick the flag in the editor and a field opens
next to it; the text shows on the chip everywhere the flag does.

Set them on a sub, or on a jurisdiction to push them onto every sub under it.
Inherited flags render **dashed and dimmer** than the sub's own, and name their
source on hover. A sub that sets a flag its jurisdiction also sets overrides the
jurisdiction's detail with its own.

## The map

Leaflet over OpenStreetMap tiles, centered on the sub.

- **Blue circles** — benchmarks: published, recovered, somebody else's.
- **Orange diamonds** — TBMs we set.
- **Green dot** — the sub's own entrance/site point.
- **Faded pins** — control from *other* subs within **3 miles**, so you can see
  what you already have next door. Toggle with the `nearby subs` chip.

Click a pin for its elevation and datum, PID, who set it and when, the monument,
the description of how to find it, **its documents**, a copy-coordinates button
and a navigate link. `📌 drop a point on the map` puts you in pick mode — the
next click on the map opens a new control point with the coordinates filled in.

The control list under the map is the same data as a table; clicking a row flies
the map to that pin and opens it. If Leaflet can't load (no internet), the map
area says so and the list still has every coordinate.

## Search

One box over everything — subs, gate codes, supers, phone numbers, benchmarks,
TBM designations, requirements, document titles, jurisdiction names. Results
group by kind. Two conveniences carried over from v1: every word has to match
(so `lennar 7am` narrows), and matching also runs against a punctuation-stripped
copy of the text, so `5551234` finds `555-1234` and `tbm1` finds `TBM-1`.
Clicking a control-point result opens its sub and flies the map to the pin.

`/` focuses the box, Escape clears it.

## Data model

```js
DB = {
  version: 3,
  cities: [ { id, name, state, notes } ],
  jurs:   [ { id, cityId, name, kind,          // county | city | etj | mud | other
              crs:{ system, note },
              flags:{ ppe:'hard hat and vest', hours:'7am–6pm' },
              reqs:[{id,title,sev,detail}],
              docs:[{id,title,kind,url}], notes } ],
  subs:   [ { id, jurId, name, lat, lon,
              gate, contactName, contactPhone, builders:[], access,
              flags:{}, crs:{}, benchmark, notes,
              reqs:[], docs:[],
              points:[ { id, type:'BM'|'TBM', name, lat, lon,
                         elev, elevDatum, desig, setBy, setOn, mon, desc,
                         docs:[{id,title,kind,url}] } ],
              updatedAt } ]
}
```

One contact per sub, many builders: a site has a list of builders working it and
one person who actually answers the phone.

Units, horizontal and vertical datum, geoid model and combined scale factor are
the same on every job the team runs, so they aren't fields — what gets recorded
is the zone and what the job is held on. Per-point vertical datum still lives on
the control point, where it varies.

Consequences of that shape, on purpose:

- **An old library converts itself on open.** Array-form flags become
  `{key: detail}`, a comma-separated builder string becomes a list, the
  superintendent becomes the contact, and flags no longer in the catalog are
  dropped. It's written back in the new shape once, not re-converted every load.
- **Records are keyed by id, not by name.** v1 keyed intel by the sub's name,
  which is why renaming orphaned it. Renaming anything is safe now.
- **Inheritance is computed, never copied.** A sub with a blank `crs.vDatum`
  shows its jurisdiction's, live. Edit the county once and every sub under it
  is correct. Fill the field on the sub to override it.
- **Documents are links, never uploads.** The share drive stays the one copy of
  the file, the browser store stays small, and an export is a small JSON.
  A network path works: `file:///V:/Standards/spec.pdf`.

## The seeded library

The library is compiled into the file, so opening the link is the whole install
— there is nothing to import and no empty state to explain. It seeds only into
an empty store, so it never overwrites anything somebody typed, and `⇅ → restore
the seeded library` puts it back if the store is wiped.

Jurisdictions are assigned by point-in-polygon against **FGDL city limits
derived from 2021 Florida parcel tax-code boundaries** — 411 municipalities,
built from who actually pays city taxes, which is a better proxy for "who has
jurisdiction" than a Census cartographic line. The layer is Albers metres, so
coordinates are reprojected before testing; the projection was checked against
six known city-hall points before anything was trusted to it. Georgia's five
subs fall back to Census TIGER 2019, which the Florida layer does not cover.

Of 104 subdivisions, **50 sit inside a city and 45 are unincorporated**. No
point landed in two cities, and every hit agrees with the county already
recorded.

The mailing address, which is what the seed had been guessing from, was wrong or
misleading on more than a third of what it covered. Wellen Park is North Port,
not Venice. Hamilton Bluff is Lake Hamilton, not Haines City. Two municipalities
had to be added because subs landed in cities we had no record for.

**Boundaries go stale and Florida annexes constantly.** Edgewater at Cross
Prairie is the proof and the vindication: Census 2019 put it outside St. Cloud,
the 2021 tax boundary puts it inside, and the city issued permit B26-00002282 and
inspected the site in September 2026. Three sources, two of them agreeing against
the oldest. Every sub carries the basis for its own assignment so this is
auditable rather than asserted.

**8 remain disputed** — a mailing address claims a city, the 2021 boundary says
otherwise. They are flagged rather than resolved, and the landing page lists them
as a work queue sorted by how much work rides on them. One permit lookup each
settles it, and settles whether the city's rules reach the sub.

Two records still cannot be placed at all: one with no coordinates, one geocoded
to Nashville. They sit under "Needs filing" instead of being dropped.

**This only stays publishable while the data stays non-sensitive.** There are no
gate codes or superintendent numbers in the seed. The day those go in, a file
served from a public URL is the wrong place for them and the library has to move
behind a login.

## Sharing it

Open the site and the library is empty; the landing page offers
**load example data** — a made-up Houston with Harris County, the City of Katy,
two subdivisions and four control points, enough to see every part of the tool
working. Erase it from `⇅ → erase the whole library` when the real library starts.

Two links skip that button and seed the example on arrival, for handing the tool
to someone cold:

```
https://rmymcy.github.io/subintel/#/demo
https://rmymcy.github.io/subintel/?demo
```

Neither is destructive — if that browser already has a library, they just open it.

## Installing it

`manifest.webmanifest` and `sw.js` make the site an installable web app: an icon
on the home screen, no browser chrome, instant start. Android/Chrome surfaces an
**Install** button in the header when it's available; iOS is Share → Add to Home
Screen.

The service worker caches the **app shell only** — the one HTML document and the
icons, about 250KB, once. It does **not** cache map tiles. That's deliberate:
the areas a crew actually works would run to tens of megabytes on the phone.
So offline you keep the entire library, requirements, documents and coordinates,
and the map goes grey behind correctly-placed pins. An `offline` pill appears in
the header so nobody wonders why.

Every push to `main` redeploys the site, and the running app notices — it fetches
the document from the network first and says *new version ready — reload* when
one lands.

## Import, export, merging

`⇅` exports the whole library as JSON and imports one back. **Import merges** —
cities, jurisdictions, subs, requirements, documents and control points are
matched by name and updated in place; anything new is added; nothing is deleted.
Two people can keep parallel copies and combine them.

## How it relates to Dispatch

It reads the dispatch library (`dispatchDB9`) **read-only**, for two things:
name autocomplete when adding a sub, and that sub's coordinates. Nothing is
written back, and the two lists are not live-synced.

## Migrating from v1

A v1/v2 `subIntelDB` is read on first run and every sub and every field of intel
comes across into a city called **Unfiled** under **Unassigned jurisdiction**.
Nothing is dropped; file them into real cities as you go.

## Everything else

- Escape closes a modal, cancels map-pick mode, then clears search.
- Deleting a city or a jurisdiction deletes everything under it, behind a confirm.
- `◐` toggles light/dark; it follows the OS until you touch it.
- Header keeps 52px of left padding to clear the APFLO hub's menu button.
- The only external requests are the Inter font (it falls back to the system
  stack) and map tiles. Leaflet and its stylesheet are inlined — there is no CDN
  dependency, which is why the file works behind a strict content security
  policy and off a share drive.
