---
name: mermaid-flow-player-narrated-walkthrough
description: >-
  Builds a narrated, step-by-step walkthrough of a Mermaid sequence diagram
  with <mermaid-flow-player> — captions from message labels, chapter markers,
  optional browser text-to-speech, karaoke auto-advance, and scroll-driven
  stepping. Use this skill when presenting a sequence diagram
  message-by-message with commentary, adding spoken narration, or syncing
  diagram steps to page scroll. Do not use for the plain caption line on
  flowcharts — use mermaid-flow-player-narration. Do not use for the basic
  embed — use mermaid-flow-player-embed.
---

# Mermaid Flow Player Narrated Walkthrough

## Critical rules

- Requires the element script on the page — set it up per mermaid-flow-player-embed.
- Captions come straight from the Mermaid message labels — no extra authoring. A `Note over`/`Note of` line becomes the commentary for its preceding message; otherwise the message label is used.
- Every step (auto-play and manual Next/Previous) emits a bubbling `mfp:step` event (`detail.text`, `detail.index`) — hook it for custom audio, analytics, or scroll-sync.

## Attributes

| Attribute      | Result                                                   |
| -------------- | -------------------------------------------------------- |
| `controls`     | Transport buttons for stepping through messages          |
| `captions`     | Shows the caption line for the current step              |
| `chapters`     | Chapter list for jumping between steps                   |
| `speak`        | Browser reads each step aloud (Web Speech API)           |
| `karaoke`      | Auto-advances when each step's narration ends            |
| `scroll-steps` | Page scroll position drives the current step             |

## Workflow

1. Ensure the CDN script tag is on the page.
2. Write the sequence diagram with `Note over` lines where richer commentary is wanted:

   ```html
   <mermaid-flow-player controls captions chapters>
   sequenceDiagram
     participant Req as Requester
     participant W as Worker
     participant WF as Workflow
     participant AL as AuditLog
     Req->>W: POST /access-requests
     Note over Req,W: A worker receives the request and validates the caller.
     W->>WF: create instance
     WF->>Req: signed approval link
     Req->>W: GET /decision then Approve
     WF->>AL: append hash-chained entry
   </mermaid-flow-player>
   ```

3. Add `speak`, `karaoke`, or `scroll-steps` if voice or scroll-driving is wanted.
4. Validate as below.

## Validation

- Step forward; expect the caption to show the Note text for the first message and the message label for un-noted steps.
- With `speak`, expect the browser to read each caption aloud (requires a user gesture first in most browsers).
- Listen for `mfp:step` in the console; expect one event per step with `detail.text`.
