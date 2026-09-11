# Puffling IP & Rights Audit

**Audit date:** 12 September 2026  
**Repository:** `zycon123/Puffling`  
**Audited base commit:** `ebfa2d14155ca6159850836e7ecfe227027384c5` (`5.27-beta.106`)  
**Purpose:** identify ownership, licensing and naming risks before commercial release.

> This is a project compliance record, not a legal opinion. Final trademark clearance and any ownership transfer documents should be reviewed by a qualified lawyer/attorney in the relevant jurisdictions.

## Executive result

The repository is in a comparatively clean position for a small game project: no open-source license had previously been granted over the original Puffling code, the visible pull-request history is controlled through the `zycon123` repository, the server declares only two direct runtime npm dependencies (`pg` and `ws`), and both are MIT-licensed. No externally hosted font, image or audio asset dependency was found in the repository searches performed for this audit. The current theme audio is generated programmatically with the Web Audio API.

However, **exclusive rights to the name `Puffling` are NOT cleared**. A separate commercial product is already operating under the Puffling name, including an iOS app launched in 2026 and a company/service using `puffling.ai`. This does not automatically mean the game must be renamed, because trademark conflicts depend on jurisdiction, goods/services, priority and likelihood of confusion, but it is a material launch risk that must be cleared before a trademark filing or major commercial release.

## Findings

| Area | Status | Finding | Required action |
| --- | --- | --- | --- |
| Repository control | Green | Repository is under `zycon123/Puffling`; the connected account has administrative repository control. | Keep 2FA/recovery and signing credentials secure. |
| Proprietary licensing | Fixed in this branch | No root `LICENSE` file was present before this audit. | Added a proprietary `LICENSE`. Do not replace it with MIT/GPL/Apache for original Puffling code unless intentionally open-sourcing. |
| Copyright ownership notice | Fixed in this branch | Ownership scope was not formally documented in-repo. | Added `COPYRIGHT.md`. Replace `Zycon Studios` with the exact legal owner if it is only a trading name. |
| Third-party runtime code | Green / documented | Direct server dependencies are `pg ^8.13.1` and `ws ^8.18.0`; both use the MIT License. | Added `THIRD_PARTY_NOTICES.md`; retain required notices in distributed builds. |
| Dependency reproducibility | Amber | No server dependency lockfile was identified in the audited repository tree. Version ranges can resolve to different transitive dependencies over time. | Commit a lockfile from the release build and run a final license/security inventory against that exact tree. |
| Images / binary art | Green with packaging caveat | No tracked `.png`, `.jpg` or similar external art assets were identified in the repository tree search used for this audit; Puffling visuals are predominantly procedural/code-defined. | Re-run the asset inventory after native Android/iOS packaging because store icons, splash screens and marketing art may be added later. |
| Audio / music | Green with packaging caveat | No tracked external audio file was identified; current theme generation uses Web Audio / `AudioContext`. | Record the source/license for any future music, samples or sound effects added as files. |
| External fonts / CDN assets | Green | Searches did not identify Google Fonts, unpkg or comparable asset CDN dependencies. | Preserve this rule or record each future external asset/license. |
| Famous third-party game references | Green in code search | Searches found no `Pokemon`, `Palworld` or `Transformers` references in the current repository code. | Avoid copied names, character designs, logos, UI art or distinctive protected expression even if used only as inspiration. |
| Contributor chain of title | Amber | All 53 pull requests visible during this audit were created through the same GitHub account, but Git history alone cannot prove who authored material outside GitHub. | Obtain written IP assignment/licensing from any human contributor, contractor, artist, composer or designer who supplied material. |
| AI-assisted material | Amber | The project has used AI-assisted development. AI assistance does not guarantee that every output is copyrightable or non-infringing in every jurisdiction. | Keep human direction/editing records where practical and review outputs for third-party copying; claim only rights legally available. |
| `Puffling` name / trademark | **Red** | A separate active commercial Puffling service/app exists in 2026. | Complete professional trademark clearance before filing/launch; be prepared to adopt a more distinctive game name if needed. |
| Logo / character design registration | Amber | No design-registration record was established by this audit. | Consider registering the final logo and selected flagship character designs after final art is frozen and before broad disclosure where local rules make timing relevant. |
| App-store publisher ownership | Not audited | Apple/Google publisher accounts and signing identities are outside this repository. | Ensure developer accounts, bundle/package IDs, signing keys, merchant/payment accounts and contracts are owned by the intended legal owner/company. |

## Trademark/name risk: Puffling

Current public evidence reviewed during this audit includes:

- Apple App Store listing: `Puffling: Early Childhood Play` (copyright shown as © 2026 Puffling AI Inc.)  
  https://apps.apple.com/us/app/puffling-early-childhood-play/id6745132264
- Commercial site: `puffling.ai`  
  https://puffling.ai/
- The service publicly states that it launched on the Apple App Store in April 2026.

This is **not** a complete trademark search. Before relying on `Puffling` as the commercial game brand, search at minimum:

1. Patentstyret (Norway);
2. EUIPO / TMview for EU/EEA-relevant marks;
3. WIPO Global Brand Database for international registrations;
4. USPTO if the United States is a target market;
5. app stores, domains, company names and unregistered/common-law commercial use in important markets.

For a downloadable/mobile game, trademark professionals commonly review classes covering downloadable software/game software and entertainment/game services, but the correct classes and wording should be selected from the actual launch plan rather than copied from this audit.

## Third-party dependency finding

`server/package.json` currently declares:

```json
"dependencies": {
  "pg": "^8.13.1",
  "ws": "^8.18.0"
}
```

The code also uses Node.js built-in modules such as `crypto` and `assert`. Built-in Node modules are platform/runtime components rather than Puffling-owned code.

The MIT notices for `pg` and `ws` are preserved in `THIRD_PARTY_NOTICES.md`.

### Release dependency gate

Before an App Store / Google Play production build:

- create/commit the package-manager lockfile used by production;
- install exactly from the lockfile (`npm ci` where applicable);
- record direct + transitive package names, versions and licenses;
- investigate any copyleft, source-available, non-commercial or unknown license immediately;
- ship all required license/copyright notices.

## Asset provenance rule

Every future non-code asset should have a provenance record containing:

- file/path;
- creator/author;
- creation date;
- whether it was human-created, commissioned, AI-assisted or stock/third-party;
- original source URL/order/invoice if applicable;
- license or written assignment;
- whether commercial use, modification and worldwide distribution are allowed;
- required attribution;
- evidence location (contract, invoice, license snapshot, source file).

Do not accept "found online", "royalty free" or "AI generated" as sufficient provenance on its own.

## Human contributor rule

If anyone other than the legal Puffling owner creates material for the game, use a written agreement before release. It should clearly address, as applicable:

- ownership/assignment of transferable economic rights;
- right to modify and create derivative works;
- commercial distribution on all platforms;
- marketing/promotional use;
- sublicensing to distributors/platforms where necessary;
- worldwide territory and adequate duration;
- payment/consideration;
- warranties that the contributor has the right to provide the material;
- disclosure of any third-party or open-source components.

Do not rely solely on a GitHub commit, verbal agreement or payment receipt to prove transfer of copyright.

## Legal-owner cleanup required before release

The repository currently uses the publisher/studio label `Zycon Studios`. Before public commercial release, determine which of these is legally true:

- `Zycon Studios` is the registered company that owns the project; or
- `Zycon Studios` is only a brand/trading name and the individual creator owns the rights; or
- the rights are being transferred from the individual creator to a newly formed company.

Then make the same legal owner consistent across:

- `LICENSE` / `COPYRIGHT.md`;
- Apple Developer / App Store Connect;
- Google Play Console;
- domains and website terms/privacy documents;
- payment/merchant accounts;
- contractor agreements;
- trademark/design applications;
- backend/cloud service contracts where practical.

## What can be concluded now

Based on the repository evidence reviewed, there is **no identified open-source license that gives the public broad reuse rights to the original Puffling game code**, and the only identified direct runtime libraries are permissive MIT components. The new files in this branch make the intended proprietary status much clearer.

What cannot yet be concluded is that the owner has exclusive worldwide rights to the word `Puffling`, or that every future native-store/marketing asset is cleared. Those remain release gates.

## Recommended release gate checklist

- [ ] Confirm the exact legal copyright/IP owner.
- [ ] Complete trademark clearance for `Puffling` in target markets; rename if clearance is not acceptable.
- [ ] Decide whether to file word mark, logo mark and/or design registrations.
- [ ] Obtain signed assignments/licenses from every external human contributor, if any.
- [ ] Create and commit the production dependency lockfile.
- [ ] Run an exact transitive dependency/license inventory from the lockfile.
- [ ] Create a final asset provenance inventory for icons, splash art, screenshots, trailers, music and SFX.
- [ ] Confirm App Store / Play publisher accounts, package IDs and signing keys are controlled by the intended legal owner.
- [ ] Archive source files and dated release snapshots as evidence of development history.
- [ ] Have final trademark/assignment documents reviewed professionally before relying on exclusive rights.