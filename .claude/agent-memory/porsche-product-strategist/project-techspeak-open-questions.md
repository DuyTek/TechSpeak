---
name: project-techspeak-open-questions
description: TechSpeak — open questions requiring stakeholder resolution before or during implementation
metadata:
  type: project
---

Three open questions logged in the PRD that were not resolved at spec time (as of 2026-06-22):

1. **Font loading strategy:** Self-host fonts in /fonts/ (safer offline, larger package) vs. load
   from Google Fonts via link tag (simpler, requires network on first load). PRD assumes Google
   Fonts link tag. Ask stakeholder if offline-first is a requirement.

2. **Term of the day rotation:** v1 hardcodes "yak shaving" as the daily term (static seed).
   Stakeholder should confirm whether day-of-year rotation across the 16 terms is needed before
   v1 ships or if static is acceptable.

3. **Icon art direction:** PRD assumes a programmatic geometric icon (teal square + "TS"
   letterform). Stakeholder should confirm whether custom illustration is required or geometric
   is acceptable.

**How to apply:** If these topics come up in conversation, refer to the open questions rather
than making a unilateral call.

[[project-techspeak]]
