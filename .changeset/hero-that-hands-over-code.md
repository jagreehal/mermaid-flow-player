---
'docs': minor
---

Put working code in the hero, and fix the CDN filenames the site was handing out.

- The homepage had no code on it. The primary call to action was a link to
  another page, so nobody could copy anything without a click, and "three ways
  in" presented the entry points as a menu to choose from. The hero now runs the
  player on a diagram you can edit: every keystroke re-renders it, and the panel
  beside it holds a complete HTML file that reproduces exactly what is on
  screen, ready to save and double-click. Mermaid's own parser gates the swap,
  so a diagram it cannot read leaves the last good one playing and names the
  failing line rather than blanking the hero.
- Replaced the four feature bullets and the four-tile link grid with three
  sections, each a working player doing one job: explaining a system, walking an
  audience through a flow, and upgrading a docs site that already has diagrams.
- `auto.global.js` was listed in the installation CDN table and emitted by the
  CDN Builder, and was never a published filename. The script-tag build ships as
  `auto.min.js`, and now also as `auto.global.js` from 1.1. Every page, snippet
  and Agent Skill teaches the classic script; six of them were handing readers
  the ESM build behind `type="module"`, which browsers refuse to load from
  `file://` — exactly how someone tries a snippet first.
- The CDN Builder decided `type="module"` by testing for a `.min.js` suffix, so
  it would have mislabelled `auto.global.js` as a module. It now keys off the
  module format, held by an e2e test.
- The hero read `v0.1` while npm was on 1.0.1, selling a stable release as
  pre-alpha. Installation gained a note on pinning instead, and lost seven live
  demos the showcase already covers.
- The README opened with a 40-word sentence containing a seven-item
  parenthetical, listed `auto-enhance.js` and `auto-play.js` which were never
  published, and carried an Agent Skills badge that rendered "resource not
  found" over a link that 404'd.
