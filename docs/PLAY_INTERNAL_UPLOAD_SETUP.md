# Orbuff Google Play Internal upload setup

Release identity:

- Package: `com.zyconstudios.orbuff`
- Version: `5.27.107`
- Version code: `107`
- Target track: `internal`

The repository has a separate manually-triggered workflow at `.github/workflows/upload-android-play-internal.yml`. Normal pushes and pull requests cannot upload a build to Google Play.

## Upload credential

Create a dedicated Google Cloud service account for release automation and grant only the Google Play Console permissions required to upload releases for Orbuff. Store its complete JSON key only in this GitHub Actions secret:

- `ORBUFF_PLAY_SERVICE_ACCOUNT_JSON`

Do not reuse a broad owner/admin credential when a narrower release credential is sufficient. Do not commit the JSON key to Git or put it in client/server app code.

The uploader requests only the OAuth scope:

`https://www.googleapis.com/auth/androidpublisher`

## Required signed build

First configure the four Android signing secrets documented in `docs/STORE_SIGNING_SETUP.md`, then manually run **Build Orbuff Android Release** on reviewed current `main`.

That successful run must contain:

- `orbuff-android-play-signed-aab`

Copy the GitHub Actions run ID from that build.

## Explicit Internal testing upload

Manually run **Upload Orbuff Android to Play Internal** and provide:

- `source_run_id` — the successful signed Android run ID.
- `confirm` — exactly `UPLOAD PLAY INTERNAL`.

The workflow fails closed unless all of the following are true:

1. The supplied source run is `.github/workflows/build-android-release.yml`.
2. The source run concluded successfully on branch `main`.
3. Its commit is still the current `main` commit.
4. Artifact `orbuff-android-play-signed-aab` exists.
5. `jarsigner -verify` passes on the downloaded AAB.
6. The source release metadata is package `com.zyconstudios.orbuff`, version `5.27.107`, build/versionCode `107`.
7. Immediately before contacting Google Play, current `main` is checked again and must still equal the signed-build source commit.
8. `ORBUFF_PLAY_SERVICE_ACCOUNT_JSON` parses as a service-account credential.

The uploader is checked out from the exact signed-build commit, not a later moving branch.

## Google Play Developer API sequence

`scripts/upload-google-play-internal.mjs` performs a single Google Play edit:

1. Create an app edit.
2. Upload the signed Android App Bundle.
3. Require Google Play to report `versionCode` 107 for the uploaded bundle.
4. Update the `internal` track with Orbuff 5.27.107 (107), status `completed`.
5. Validate the edit.
6. Commit using `changesInReviewBehavior=ERROR_IF_IN_REVIEW`.

`ERROR_IF_IN_REVIEW` is intentional: the automation should fail rather than cancel an unrelated change that is already being reviewed in Play Console.

If an error occurs before commit, the uploader attempts to delete the uncommitted edit.

## External prerequisites

Before the first API upload:

- The Orbuff Play Console app must exist for `com.zyconstudios.orbuff`.
- Play App Signing must be configured as appropriate for the release.
- The service account must be linked/granted sufficient Play Console API access for Orbuff.
- Required Play Console app-content/Data Safety/content-rating/target-audience setup must not block the test release.

A successful API commit makes the specified release available through the configured Internal testing track subject to Google Play processing and tester configuration. It does not mean the app is approved for production.

## Release safety

- Never trigger this workflow for a branch build.
- Never change the track from `internal` to production in this workflow.
- Never weaken the current-main checks merely to upload an older artifact; create a fresh signed build from reviewed `main` instead.
- Keep real-money Diamonds disabled until Google Play license/Internal purchase tests and the Apple sandbox/TestFlight tests pass.
