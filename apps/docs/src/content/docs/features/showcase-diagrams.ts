export const FLOW = `flowchart LR
A[Hard] -->|Text| B(Round)
B --> C{Decision}
C -->|One| D[Result 1]
C -->|Two| E[Result 2]`;

export const BRANCH = `flowchart TD
Start --> Choice
Choice --> PathA[Path A]
Choice --> PathB[Path B]
PathA --> End
PathB --> End`;

export const THEME = `flowchart LR
A[Start] --> B[Transform]
B --> C{Valid?}
C -->|Yes| D[Accept]
C -->|No| E[Reject]`;

export const TTS_FLOW = `flowchart TD
A[Request] --> B[Auth]
B --> C{OK?}
C -->|yes| D[Process]
C -->|no| E[Reject]
D --> F[Confirm]`;
