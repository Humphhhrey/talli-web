**Findings**
- No actionable P0/P1/P2 issues remain for the requested composition: the shared-table artwork is a full-viewport landing-page background, not a contained image panel, and the expense card remains live UI over it.

**Open Questions**
- None for this placement change.

**Implementation Checklist**
1. Preserve the full-viewport landing-page background as CSS background media when adding future hero states.
2. Keep the expense card positioned as a separate semantic layer over that background.

**Follow-up Polish**
- [P3] The reference uses a different meal photo and photographic avatars; the replacement background and live-initial avatars are intentional production-safe substitutions.
- [P3] The reference does not show the yellow CTA, which is intentionally retained as the live conversion action.

## Comparison evidence

- Source visual truth: `/var/folders/g4/dmdvr7cx41xb63gdxtrpch180000gp/T/codex-clipboard-5f3bb740-ae66-4f9c-bb20-bca92aceadd8.png`
- Source pixels: 1400 × 836, including its surrounding presentation frame.
- Implementation route: `http://localhost:8789/`
- Implementation screenshot: browser-rendered in the 2026-09-02 full-hero QA turn (not persisted to disk by browser sandbox).
- Implementation viewport: 1536 × 1024 CSS pixels, device scale factor 1, default light state.
- Density normalization: visual content was compared without the source's black presentation surround; the full-hero layout, not the presentation frame, was the comparison target.
- State: root landing page, no interaction.
- Full-view and focused-region comparison: source and implementation were captured together after the final crop adjustment. The full hero, navigation, background placement, expense card, and headline region were reviewed.
- Fonts and typography: intentional live text differs from the concept's exact typeface but retains its display hierarchy and readable contrast.
- Spacing and layout rhythm: verified the artwork runs behind the entire landing-page viewport, including the navigation, rather than within a rounded panel; the card floats over it.
- Colors and visual tokens: verified forest, cream, and yellow remain consistent with the reference direction.
- Image quality and asset fidelity: verified the background is a high-quality raster asset and the card is no longer baked into it.
- Copy and content: live CTA and expense detail remain readable; no console errors were recorded.
- Comparison history: the prior rounded background container was removed. A navigation-layer adjustment, background crop adjustment, wider desktop gutters, and a left-to-right cream gradient mask were then applied; the final browser capture confirms the intended full-hero composition without a hard image boundary.
- Motion check: verified the staged card sequence at 1536 × 1024: members arrive first, Dinner and Transport appear in order while their amounts count up, then the settlement status and confirmation arrive. The completed state shows ₱2,480 and ₱1,320; reduced-motion users retain the final static state.
- Full-screen background iteration: moved the masked background layer from `.hero::before` to the landing-page canvas. Post-fix browser evidence at 1536 × 1024 confirms it reaches all viewport edges behind navigation and content; the 390 × 844 mobile capture confirms the same treatment without horizontal overflow.

final result: passed
