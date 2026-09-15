# Orbuff — Content rating audit

Reviewed against Orbuff 5.27.107 source on 2026-09-15.

Purpose: provide a source-backed checklist for the Apple App Store age-rating questionnaire and Google Play / IARC content-rating questionnaire. The stores/rating authorities generate the final rating; this document does not assign one manually.

## Current production-content map

### Violence
- **Cartoon / fantasy violence: Present.** Orbuffs and bosses use stylized fantasy attacks, projectiles and hit effects.
- **Realistic violence: No.** No realistic human injury, blood, gore or realistic combat is part of the audited build.
- **Graphic / sadistic violence: No.**
- **Guns or realistic weapons: No.** Attacks are fantasy powers / magical projectiles rather than realistic firearms or weapons.

**Apple working answer:** Cartoon or Fantasy Violence = **Yes**. Because combat is a repeatable core mechanic through bosses, Boss Rush and Race attacks, use the portal's frequency definition conservatively and re-check the final production build before submission.

**Google / IARC working answer:** disclose non-realistic / fantasy combat and boss battles accurately; do not mark realistic violence, blood or gore.

### Chance-based activities
- **Loot boxes / randomized virtual rewards: Present.** Mystery Boxes consume Diamonds and return a random virtual reward with displayed odds.
- Current Mystery Box table:
  - 500 Coins — 38%
  - 1000 Coins — 26%
  - Rare Orbuff Egg — 18%
  - Epic Orbuff Egg — 11%
  - Legendary Orbuff Egg — 6%
  - Random Legendary Orbuff — 1%
- Three unopened Mystery Boxes can be combined into a guaranteed egg with disclosed rarity odds.
- **Gambling: No.** There is no betting/wagering for money or items exchangeable for real money.
- **Simulated gambling / casino gameplay: No.** No casino, slots, roulette, cards or betting simulation is part of Orbuff.

**Apple working answer:** Loot Boxes = **Yes**. Gambling = **No**. Simulated Gambling = **No**.

**Google / IARC working answer:** disclose randomized virtual-item mechanics wherever the questionnaire asks about chance-based or paid/random items. Real-money Diamond purchasing remains disabled in the current submission build; revisit this section before enabling paid Diamonds.

### Contests / competitive play
- **Present.** Quick/Friend Race, ranked foundations, leaderboard rankings and Boss Rush rewards are competitive or ranking-oriented gameplay.
- Race attacks are limited gameplay abilities, not player-to-player messaging.

**Apple working answer:** Contests = **Yes**. Use the portal's frequency definition based on the final build; Race and leaderboard are repeatable modes rather than one-off content.

**Google / IARC working answer:** disclose online competitive multiplayer/rankings where asked.

### User communication / user-generated public content
- **Messaging/chat: No.** No text chat, voice chat or direct messaging system was found in the audited release path.
- **Public free-text player names: No.** Player-entered names stay local. Public leaderboard entries use deterministic server-generated aliases in the form `Orbuff-XXXXXX`.
- **Social media: No.**
- **Public UGC feed: No.**
- Support email text is user-initiated customer-support content, not an in-app public social surface.

**Apple working answer:** Messaging and Chat = **No**. User-Generated Content = **No** for the audited public game surfaces.

### Web access
- **Unrestricted web access: No.** The app may open specific privacy/support resources, but it does not provide a general-purpose browser.

### Advertising
- **Advertising: No** in the audited build. No advertising SDK is present.

### Mature themes
- Profanity/crude humor: No intentional mature profanity content found.
- Horror/fear themes: No material horror/gore content found; boss designs are fantasy/cartoon.
- Alcohol/tobacco/drugs: No.
- Sexual content/nudity: No.
- Medical/wellness content: No.

## Apple App Store Connect checklist

Enter answers from the production build, not from marketing intent alone:

- Cartoon or Fantasy Violence: **Yes**
- Realistic Violence: **No**
- Prolonged Graphic/Sadistic Realistic Violence: **No**
- Guns or Other Weapons: **No**
- Loot Boxes: **Yes**
- Gambling: **No**
- Simulated Gambling: **No**
- Contests: **Yes**
- Messaging and Chat: **No**
- User-Generated Content: **No**
- Social Media: **No**
- Unrestricted Web Access: **No**
- Advertising: **No**
- Sexual/Nudity categories: **No**
- Alcohol/Tobacco/Drug categories: **No**
- Medical/Wellness categories: **No**

For descriptors that ask **frequency**, review the final binary and choose the frequency matching Apple's current definitions. Do not reduce a descriptor solely to obtain a lower rating.

## Google Play / IARC checklist

- App/game category: Game.
- Fantasy/cartoon combat: **Yes**.
- Realistic violence/blood/gore: **No**.
- Gambling/casino/betting: **No**.
- Random virtual rewards / loot-box-like mechanic: **Yes where the questionnaire asks**.
- Online competitive gameplay: **Yes**.
- User communication/chat: **No**.
- Public user-generated text/content: **No** in the audited release path.
- Ads: **No**.
- Sexual content/nudity: **No**.
- Alcohol/tobacco/drugs: **No**.
- Horror: **No material horror content**.

Google Play requires an IARC rating and accurate target-audience declarations. Retake the questionnaire whenever gameplay/content changes affect these answers.

## Target audience decision

The target audience is a publisher decision and is intentionally not inferred from colorful art. If any Google Play target-age selection includes children, the app must comply with Families Policy requirements. Decide the intended audience before completing Play Console's Target audience and content section.

## Re-audit triggers

Re-run this audit before release if any of these change:
- paid Diamonds or any real-money randomized purchase becomes enabled;
- chat, voice, custom public names, clans/guild posts or other UGC is added;
- ads or social-media SDKs are added;
- realistic weapons, blood, gore, mature themes or stronger fear/horror content is added;
- Mystery Box odds/reward behavior changes;
- competition/ranking features materially change.
