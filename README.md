# ChurchOps public website

Static product website for `www.church-ops.com`. Serve the repository root; no package install or build step is required.

```sh
python3 -m http.server 8768 --bind 127.0.0.1
```

## Product pages

- `index.html`: concise suite introduction and four product choices.
- `churchops.html`: ChurchOps workflows, native app downloads, subscription/access guidance.
- `staff-portal.html`: staff, finance, attendance, executive and reporting tools; current church-specific availability.
- `count.html`: ChurchOps Count, clearly marked in development.
- `request-portal.html`: external requester tools and the existing Crosswalk portal.
- `resources.html`: access directory, preserved form-link helper, support and policies.
- `contact.html`: email draft helper. It does not send mail, collect data, or use a backend.

The new presentation uses `assets/site.css`, `assets/site.js`, and `assets/mark.svg`. All page content is static HTML; JavaScript enhances mobile navigation, expandable workflow deep links, and the two explicitly described helpers. No third-party fonts, trackers, SDKs, image services, or front-end dependencies are added. Product visuals are CSS/SVG illustrations with fictional sample data, labeled as illustrations rather than actual screenshots.

## Preservation

The former homepage is preserved byte-for-byte as `support-center.html`. All other original files remain unchanged, including `styles.css`, legal/support pages, hiring/invoice/reimbursement/event forms, invitation and app-opening handlers, domain configuration, Apple association files, and Plaid OAuth callback.

Do not replace the original form scripts or share a global stylesheet with them as part of a marketing-only change. They depend on church-specific query parameters and existing application services. The resource directory does not choose a church by default. Existing Crosswalk entry points are explicitly labeled.

`tests/original-files.json` records the 18-file starting inventory. Its original `index.html` hash is checked against `support-center.html`.

## Availability and claims

- Main app and separate Mac listing: use the verified existing store destinations. Show current pricing in the app/store, not a hard-coded pricing table.
- Staff and Request Portals: existing Crosswalk installations; do not promise self-service deployment to other churches.
- Count: development/pre-release; no public download button until distribution and its release requirements are actually completed.
- Watch: described on the main product page as developed, with public availability unconfirmed.
- Subscription, account deletion, privacy and terms content is preserved. This marketing change is not a rewrite or certification of legal policies for new products.

GitHub Pages publishes the root of the existing `main` branch. A Git push, GitHub Pages build, custom-domain delivery, and live verification are separate steps. Verify the deployed commit and live asset bytes after publishing. Do not deploy Firebase, shared Functions, Rules or the staff portal to publish this repository.

## Verification

```sh
python3 tests/check-site.py
node --check assets/site.js
node tests/site-interactions.cjs
```

Checks cover original-file preservation, local links and fragments, headings/labels, trusted form destinations, query preservation, church context, and mailto encoding without sending anything. Browser checks additionally cover responsive layouts and menu/workflow/FAQ behavior.
