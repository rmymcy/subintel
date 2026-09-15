# Sub Intel

A browsable library of everything we know about a subdivision — access, the
coordinate system it's on, what the jurisdiction requires, the documents to
reference, and an interactive map of the benchmarks and TBMs on it.

Filed **city → county or municipality → subdivision**, so anything that belongs
to the county is recorded once and inherited by every sub under it.

**[`sub_intel.html`](sub_intel.html)** is the whole application — open the file,
no build, no server, no account. Data lives in the browser under `subIntelDB`,
with JSON export/import to move or merge libraries.

Opening it with `#/demo` on the end of the URL seeds a worked example — a
made-up Houston with two jurisdictions, two subdivisions and four control
points — so you can hand the link to someone cold. It never overwrites an
existing library.

See [SUB_INTEL.md](SUB_INTEL.md) for what's in it and why.
