# Orbuff — Store asset production specification

Reviewed for the September 2026 App Store / Google Play submission workflow.

This is the production brief for final store graphics. Use **actual Orbuff gameplay/UI from the release candidate**. Do not show features that are disabled in the submitted build, especially real-money Diamond purchasing.

## Core creative direction

Store visuals should communicate these pillars quickly:

1. **Jump higher** — the endless vertical-jump core loop.
2. **Collect & evolve Orbuffs** — Orbdex, starter/evolution identity and collection depth.
3. **Boss battles** — colorful fantasy bosses and Rainbow Blast combat.
4. **Race rivals** — Quick/Friend Race with opponent ghost/competitive HUD.
5. **Protect & manage** — OrbVault/Nursery as supporting progression, not the lead image.

Keep the first three screenshots focused on actual gameplay. Avoid cluttered menu-only screenshots as the first impression.

## App icon

### Apple
- Production master: **1024 × 1024 px** square artwork in the native asset catalog / Icon Composer workflow.
- No store-ranking badges, pricing claims or misleading third-party branding.
- Keep the central Orbuff silhouette readable at small sizes.

### Google Play
- **512 × 512 px**
- **32-bit PNG with alpha**
- Maximum **1024 KB**
- Do not bake store badges, ranking claims or price/promotional text into the icon.

### Recommended Orbuff icon composition
- One recognizable flagship Orbuff face/shape.
- Simple sky/energy background.
- No tiny text.
- Strong silhouette that still reads at notification/search size.

## Google Play feature graphic

Required dimensions:
- **1024 × 500 px**
- JPEG or 24-bit PNG
- No alpha

Recommended composition:
- Flagship Orbuff centered or just off-center.
- Vertical sky progression / energy trail.
- One boss or rival silhouette as secondary context.
- Minimal or no text; if text is used, keep it short and centered safely.
- Do not advertise paid Diamonds while IAP is disabled.

## Google Play screenshots

Publication minimum:
- At least **2 screenshots** across supported device types.
- JPEG or 24-bit PNG, no alpha.
- Minimum dimension 320 px; maximum dimension 3840 px, with the long edge no more than 2× the short edge.

For a game, prepare at least **3 high-resolution gameplay screenshots** for recommendation eligibility:
- Portrait: **1080 × 1920 px** (9:16) or larger equivalent.
- Landscape: **1920 × 1080 px** (16:9) or larger equivalent.

Orbuff is primarily portrait-oriented, so the working capture set is **1080 × 1920 portrait**.

### Google screenshot order
1. Endless jump gameplay — clear player, platforms, height HUD.
2. Boss battle — colorful boss, Rainbow Blast, readable action.
3. Race mode — player/rival HUD and ghost competitor.
4. Orbdex — collection/evolution view.
5. OrbVault/Nursery — progression/protection utility.
6. Mystery Box — odds visible, but only if the submitted build exposes it exactly as shown.

## Apple iPhone screenshots

App Store Connect accepts 1–10 screenshots per device family.

Prepare the primary iPhone set at a currently accepted **6.9-inch** portrait size. Preferred working export:
- **1320 × 2868 px** portrait

Also accepted for the 6.9-inch group are current device-native sizes including 1260 × 2736 and 1290 × 2796. Use one accepted size consistently for the localized set.

If a 6.9-inch screenshot set is not supplied, App Store Connect may require/use another supported display size. Always confirm the upload validator at submission time.

### Apple iPhone screenshot order
1. Core vertical gameplay.
2. Boss fight.
3. Race mode.
4. Orbdex / evolution.
5. OrbVault / Nursery.
6. Boss Rush or another strong repeatable feature.

## Apple iPad screenshots

If the production iOS target remains available on iPad, a 13-inch iPad screenshot set is required.

Prepare one accepted 13-inch portrait size:
- **2064 × 2752 px**, or
- **2048 × 2732 px**

Before submission, decide explicitly whether iPad is a supported launch device. If it is not intended for launch, change the native target support before archiving rather than simply omitting screenshots.

## App preview / trailer

Optional for initial release. Do not block launch on a trailer.

If produced later:
- Use real gameplay footage.
- Start with movement/gameplay, not a logo animation.
- Show Boss, Race and collection within the first part of the video.
- Avoid showing unfinished IAP or development/debug UI.

## Localization plan

Initial asset recommendation:
- Use screenshots with minimal baked-in marketing text so the same captures can support several languages.
- If marketing captions are added, produce localized variants for each store language rather than mixing Norwegian and English.
- Verify that every visible in-game menu in a screenshot matches the store listing language.

## Capture rules

Every final screenshot must:
- come from the same reviewed release candidate/version;
- have no debug overlays, file names, browser chrome or developer console;
- show correct Orbuff branding, not Puffling/Sky-Puff legacy names;
- avoid personal/test account identifiers;
- avoid impossible currency balances or developer cheats that could mislead users;
- avoid displaying paid-purchase controls unless paid IAP is actually enabled in that submitted binary;
- show real UI, not mockups presented as gameplay.

## Final asset folder layout

When assets are produced, use:

```text
store-assets/
  icon/
    orbuff-icon-master-1024.png
    google-play-icon-512.png
  google-play/
    feature-graphic-1024x500.png
    phone-01-gameplay-1080x1920.png
    phone-02-boss-1080x1920.png
    phone-03-race-1080x1920.png
    phone-04-orbdex-1080x1920.png
  apple/
    iphone-6.9-01-gameplay.png
    iphone-6.9-02-boss.png
    iphone-6.9-03-race.png
    iphone-6.9-04-orbdex.png
    ipad-13-01-gameplay.png
    ...
```

Do not commit screenshots containing private tester information.
