# Sub Intel — purpose & how it works

`sub_intel.html` · one self-contained file · storage key `subIntelDB`

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
| Header | gate code (large, monospace, **click to copy**), access warning in amber, super with a `tel:` link, requirement icons |
| Coordinate system | system, datums, units, geoid, combined factor, control notes. Values inherited from the jurisdiction show in *italic* and name their source on hover |
| Requirements | the sub's own plus everything inherited, tagged with the jurisdiction it came from, ranked *good to know* → *required* → *critical* |
| Documents | links, each with a kind icon — spec, plat, benchmark datasheet, permit, plan set |
| Control | the map, then the list |
| Notes | benchmark notes and general notes |

## Requirement icons

Sixteen flags — 🔒 gated, 📞 notify first, 🪪 orientation, 📋 permit, 🦺 full
PPE, 🕖 hour limits, 🚧 escort, 💧 district, 🌊 floodplain, 🌳 tree rules,
🚂 railroad, 🛣️ state ROW, 🛰️ RTN quirk, 🐕 loose dogs, 🛻 4WD, 🚤 water
access. Set them on a sub, or on a jurisdiction to push them onto every sub
under it. Inherited flags render **dashed and dimmer** than the sub's own, so
you can always tell which is which.

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
              crs:{ system, units, hDatum, vDatum, geoid, csf, note },
              flags:[], reqs:[{id,title,sev,detail}],
              docs:[{id,title,kind,url}], notes } ],
  subs:   [ { id, jurId, name, lat, lon,
              gate, superName, superPhone, builder, contact, access,
              flags:[], crs:{}, benchmark, notes,
              reqs:[], docs:[],
              points:[ { id, type:'BM'|'TBM', name, lat, lon,
                         elev, elevDatum, desig, setBy, setOn, mon, desc,
                         docs:[{id,title,kind,url}] } ],
              updatedAt } ]
}
```

Consequences of that shape, on purpose:

- **Records are keyed by id, not by name.** v1 keyed intel by the sub's name,
  which is why renaming orphaned it. Renaming anything is safe now.
- **Inheritance is computed, never copied.** A sub with a blank `crs.vDatum`
  shows its jurisdiction's, live. Edit the county once and every sub under it
  is correct. Fill the field on the sub to override it.
- **Documents are links, never uploads.** The share drive stays the one copy of
  the file, the browser store stays small, and an export is a small JSON.
  A network path works: `file:///V:/Standards/spec.pdf`.

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
- The only external requests are the Inter font, Leaflet, and map tiles.
  Everything else is in the file.
