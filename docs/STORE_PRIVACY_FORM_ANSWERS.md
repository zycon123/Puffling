# Orbuff — App Store Privacy & Google Play Data Safety working answers

Reviewed against Orbuff 5.27.107 source on 2026-09-15.

This file is a **release working sheet**, not legal advice. It is scoped to the build currently prepared for submission. Re-check every answer if SDKs, backend logging, analytics, ads, crash reporting, account behavior, leaderboard presentation, or paid purchases change.

## Release assumptions

- App: `Orbuff`
- Developer/publisher: `Zycon Studios`
- Bundle/package: `com.zyconstudios.orbuff`
- Privacy Policy: `https://zycon123.github.io/Puffling/privacy.html`
- Privacy choices / account deletion: `https://zycon123.github.io/Puffling/delete-account.html`
- Online API and multiplayer endpoints use HTTPS/WSS.
- No advertising SDK or dedicated behavioral analytics SDK is present in the audited repository.
- Real-money Diamond purchasing is **not enabled for this submitted build** unless production store credentials/provider mode are later activated.
- Core local play works without creating an online guest identity; online/ranked/trade/leaderboard features may create or use a pseudonymous guest account.
- Guest accounts support recovery after reinstall/device change. The player holds a recovery key; the server stores only its SHA-256 hash.
- Paid-Diamond wallets are account-linkable/recoverable, but purchase-history disclosure remains out of scope while public paid IAP is disabled.
- Player-entered display names remain local. Public leaderboard presentation uses server-generated `Orbuff-XXXXXX` aliases and does not publish the player's free-text local name.
- The support button prepares an email containing diagnostics, but the user must choose to send it through their email app.

---

# Apple App Privacy — current submitted build

## Top-level collection question

**Does this app or its third-party partners collect data?**

Recommended answer: **Yes**.

Online features transmit pseudonymous account identifiers, gameplay/competitive state, leaderboard scores and security/integrity data to Orbuff servers. Guest-account recovery also stores a one-way hash of the recovery credential. Support information may be sent when the user explicitly sends a support email.

## Privacy URLs

- **Privacy Policy URL:** `https://zycon123.github.io/Puffling/privacy.html`
- **User Privacy Choices URL:** `https://zycon123.github.io/Puffling/delete-account.html`

## Data types to declare

### 1. Identifiers → User ID

**Collected:** Yes, when protected online features are used.

What: randomly generated pseudonymous guest account ID. The account can be recovered with an Account ID + recovery key; the server stores only the recovery-key hash.

**Purpose(s):**
- App Functionality
- Account Management
- Fraud Prevention / Security / Compliance

**Linked to the user:** Yes. It associates ranked, inventory, trade, boss/reward, account-linked leaderboard state and the recoverable Diamond-wallet relationship.

**Used for tracking:** No. The audited build has no cross-company tracking behavior or advertising/tracking SDK.

### 2. User Content / Gameplay Content

**Collected:** Yes, when online features are used.

Examples:
- race position/progress and results;
- ranked rating/results;
- server-authoritative Orbuff inventory/ownership state;
- trade state/records;
- boss-session/reward state;
- leaderboard score/height and validation signature.

**Purpose(s):**
- App Functionality
- Fraud Prevention / Security / Compliance

**Linked to the user:** Yes for authenticated online records.

**Used for tracking:** No.

### 3. Contact Info → Email Address

**Collected:** Optional / user initiated only.

When: a user chooses a support/privacy flow and actually sends an email. The developer receives the sender address through the mail service.

**Purpose(s):**
- App Functionality / Customer Support
- Account Management when handling a privacy/deletion request

**Linked to the user:** Potentially yes.

**Used for tracking:** No.

### 4. User Content → Customer Support

**Collected:** Optional / user initiated only.

Examples:
- the user's description of what happened;
- steps leading to an issue;
- height/boss/mode notes;
- privacy or deletion requests.

**Purpose(s):**
- App Functionality / Customer Support

**Linked to the user:** Potentially yes when sent from an identifiable email address or when the user includes an Account ID.

**Used for tracking:** No.

### 5. Diagnostics → Other Diagnostic Data

**Collected:** Optional / user initiated support flow only in the audited build.

The support email can include:
- build version;
- smoke-check/status codes;
- last runtime error;
- anti-cheat diagnostic state;
- configured service status;
- browser/device user-agent string.

This data is prepared locally and leaves the device only if the user sends the support email.

**Purpose(s):**
- App Functionality / troubleshooting
- Fraud Prevention / Security / Compliance where security diagnostics are included

**Linked to the user:** Potentially yes when sent from an identifiable email address or with the Account ID.

**Used for tracking:** No.

## Data types NOT currently expected

Do **not** select these merely because they may exist in a future production-paid build:

- Name / player nickname — the player-entered local display name is not sent for public leaderboard submission in the audited build; public leaderboard aliases are system-generated.
- Precise Location / Coarse Location — no intentional location collection found.
- Contacts — none found.
- Photos / Videos — none found.
- Audio recordings — none found.
- Health / Fitness — none found.
- Advertising Data — no advertising SDK found.
- Device ID / Advertising ID — no intentional advertising/device identifier collection found in audited app code.
- Purchase History — **do not select for the current release while public real-money purchases remain disabled**.
- Payment Information — payment credentials should be handled by Apple/Google rather than Orbuff; Orbuff must not claim to receive card details.

## Apple tracking question

Recommended current answer: **No data is used for tracking**, provided the final signed binary still contains no ad/tracking SDK and no cross-company tracking behavior.

## Apple age rating

Complete Apple's current questionnaire from the production content using `docs/CONTENT_RATING_AUDIT.md` as the source checklist. Apple generates the final age rating from the submitted descriptors; do not manually guess a rating.

---

# Google Play Data Safety — current submitted build

## Data collection and security

### Does the app collect or share any required user data types?

Recommended answer: **Yes**.

### Is all collected user data encrypted in transit?

Recommended answer: **Yes**, provided the final production configuration continues to use HTTPS/WSS for every server data flow. Re-verify the signed binary and production endpoints before submitting.

### Does the app provide a way for users to request deletion?

Recommended answer: **Yes**.

- In-app: `System & Support → Delete guest account`
- External web resource: `https://zycon123.github.io/Puffling/delete-account.html`

### Is data shared with third parties?

Recommended current answer: **No**, based on the audited build and provided infrastructure/email vendors act only as service providers processing data on Zycon Studios' behalf. Revisit this if ads, cross-company analytics, marketing SDKs or another independent recipient is added.

## Data types

### Personal info → User IDs

**Collected:** Yes, optional relative to local/core play; required when the user chooses protected online features needing a guest identity.

What: pseudonymous Orbuff guest account ID. Guest-account recovery stores a one-way hash of the recovery key; the plaintext recovery key is kept by the player/device.

**Shared:** No.

**Purposes:**
- App functionality
- Fraud prevention, security and compliance
- Account management

### App activity → Other actions

**Collected:** Yes for online features.

What:
- gameplay/race progress and result data;
- rank/results;
- inventory/ownership state;
- trade actions;
- boss/reward actions;
- leaderboard scores/heights.

Google includes gameplay activity under **Other actions**.

**Required or optional:** Optional for users who only use local/core play; required when using the corresponding online feature.

**Shared:** No.

**Purposes:**
- App functionality
- Fraud prevention, security and compliance

### App info and performance → Diagnostics

**Collected:** Optional, user initiated.

What: build/status information, last runtime error, service status, anti-cheat diagnostic state and device/browser user-agent contained in a support email prepared by the game.

The user must choose to send the email.

**Shared:** No, subject to service-provider/user-initiated-transfer rules.

**Purposes:**
- App functionality / troubleshooting
- Fraud prevention, security and compliance where security diagnostics are included

### Other user-generated content

**Collected:** Optional, user initiated.

What: free-text support responses such as what happened, what the user did before the error, or additional account/privacy request context.

**Shared:** No.

**Purposes:**
- App functionality / customer support

### Personal info → Email address

**Collected:** Optional, only when the user sends a support/privacy email from an identifiable address.

The guest account does not require an email address.

**Shared:** No.

**Purposes:**
- App functionality / customer support
- Account management when used to handle a privacy/deletion request

## Google Play types not currently expected

Do not select unless the final signed production build actually collects them:

- Personal info → Name / local player nickname — not transmitted by the audited leaderboard flow.
- Location
- Contacts
- Photos/videos
- Audio
- Health/fitness
- Installed apps
- Web browsing
- Device or other IDs used as device identifiers
- Purchase history while public paid IAP remains disabled
- User payment information/card details

## Account deletion form

Recommended entries:

- **Does your app allow users to create an account?** Yes — a pseudonymous guest account can be created for online features.
- **Can users request account deletion from within the app?** Yes.
- **Account deletion web URL:** `https://zycon123.github.io/Puffling/delete-account.html`
- **Does deletion also delete associated user data?** Yes for guest-account-linked Orbuff server data, subject to clearly disclosed minimal retention for security/legal/accounting reasons.

Current deletion covers authenticated ranked data, authoritative inventory/migration state, trade records involving the account, boss sessions, acquisition/reward grants, account-linked leaderboard scores and the account recovery credential. A linked Diamond wallet is unlinked and disabled so old wallet tokens can no longer spend or receive purchases. A minimal deleted-ID tombstone is retained to prevent reuse of a deleted identity. Local-only save data is separately controllable on the device.

If paid IAP is enabled later, some pseudonymized store transaction/wallet-ledger records may be retained for duplicate prevention, refunds, fraud prevention, accounting, disputes or legal obligations; the public policy must remain aligned with that retention.

## Target audience / Families

**Owner decision required.** Do not select child age groups solely because Orbuff uses colorful/cartoon art. Any Google Play target-audience selection that includes children triggers Families Policy requirements and must match the intended audience and production experience.

---

# Re-open this sheet before enabling paid Diamonds

When real-money IAP becomes production-ready, reassess at minimum:

## Apple
- Purchases → Purchase History
- identifiers linked to purchase reconciliation
- purposes for purchase processing, fraud prevention and account management

## Google Play
- Financial info → Purchase history
- whether purchase data is required/optional
- purposes: App functionality and Fraud prevention/security/compliance
- native billing/provider data flows and retained transaction/ledger records

Do not enable paid Diamonds until the public Privacy Policy, App Privacy answers and Data Safety answers have been updated to match the actual production billing flow and retention policy.
