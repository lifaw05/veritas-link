---
name: Geo-Fencer
description: Checks IP constraints for CFTC compliance.
---

# Geo-Fencer

Ensures users in restricted jurisdictions (e.g., Nevada, Washington for some exchanges, or US vs Non-US) see appropriate UI.

## Instructions

1.  **Input**: User IP (simulated/detected).
2.  **Logic**:
    -   Map IP to Region (US-State).
    -   Check against `RESTRICTED_STATES` list.
    -   `RESTRICTED_STATES = ['NV', 'WA', ...]` (Example list).
3.  **Output**: Boolean `canTrade`.

## Implementation

```typescript
// utils/geo.ts
export const RESTRICTED_STATES = ['NV', 'WA'];

export function checkCompliance(userRegion: string): boolean {
    return !RESTRICTED_STATES.includes(userRegion);
}
```
