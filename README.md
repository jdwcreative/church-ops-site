# ChurchOps public website

Static product website for `www.church-ops.com`. Serve the repository root; no package install or build step is required.

```sh
python3 -m http.server 8768 --bind 127.0.0.1
```

## Product pages

- `index.html`: suite introduction, real app icons, selectable product screens, and four products, with the two portals belonging to Hub.
- `churchops.html`: ChurchOps workflows, native app downloads, subscription/access guidance.
- `live.html`: service teams, equipment, screens, preview availability, and source-aligned Basic/Pro pricing.
- `music.html`: songwriting, lyrics, recording feedback, plans, separate access and support.
- `pricing.html`: current U.S. Hub subscription prices and clearly proposed future suite pricing.
- `staff-portal.html`: staff, finance, attendance, executive and reporting tools; current church-specific availability.
- `count.html`: ChurchOps Count, clearly marked in development.
- `request-portal.html`: external requester tools and the existing Crosswalk portal.
- `resources.html`: access directory, preserved form-link helper, support and policies.
- `faq.html`: product selection, availability, pricing, accounts, and setup answers.
- `contact.html`: email draft helper. It does not send mail, collect data, or use a backend.

The new presentation uses `assets/site.css`, `assets/site.js`, and `assets/mark.svg`. All page content is static HTML; JavaScript enhances mobile navigation, expandable workflow deep links, real product-preview switching, billing-period display, product-specific inquiry selection, and the two explicitly described helpers. No third-party fonts, trackers, SDKs, image services, or front-end dependencies are added. The website uses a unified set of vector icons based on the existing ChurchOps two-stroke mark, with a different palette for each product. Original app icon files remain preserved as source references. Music, Count, Live, and Staff Portal screens use fictional demo/reviewer data; Hub screens come from existing training captures. Image provenance is recorded in `assets/products/sources.json`. No screenshot is represented as a live customer record.

## Preservation

The former homepage is preserved byte-for-byte as `support-center.html`. All other original files remain unchanged, including `styles.css`, legal/support pages, hiring/invoice/reimbursement/event forms, invitation and app-opening handlers, domain configuration, Apple association files, and Plaid OAuth callback.

Do not replace the original form scripts or share a global stylesheet with them as part of a marketing-only change. They depend on church-specific query parameters and existing application services. The resource directory does not choose a church by default. Existing Crosswalk entry points are explicitly labeled.

`tests/original-files.json` records the 18-file starting inventory. Its original `index.html` hash is checked against `support-center.html`.

## Availability and claims

- Main app and separate Mac listing: use the verified existing store destinations. The table mirrors verified U.S. App Store prices as of October 4, 2026; refresh it when store products change.
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

## October 4 sales revision and pricing vision

The user requested all products, correct capitalization, actual icons and app visuals, and a cohesive commercial pricing proposal. The website does not activate billing or grant access. The pricing approach preserves current Hub pricing, preserves free invited-team Music access, and uses Live’s existing draft Basic/Pro catalog rather than inventing conflicting Live tiers.

- Hub: Starter $29.99/$299.99, Team $79.99/$799.99, Growth $149.99/$999.99 (monthly/annual). Seat caps 3/10/25, verified against `App/TeamBillingSupport.swift` and the U.S. App Store listing.
- Live draft: Basic $19/$190 for 1 room and 1 operator; Pro $59/$590 for 3 rooms and 3 operators. Pro additions $12/$120 per operator and $15/$150 per room. Source: Live `src/entitlements.mjs`, draft catalog 2026-10-01.
- Music proposed commercial team plan: $29/$290 for 10 collaborators. Existing invited workspace remains free. This new commercial model requires product, hosting/storage cost, and billing implementation review before activation.
- Count proposed: $19/$190 per campus; service-scoped counters are not Hub staff seats. Counter and service technical limits still apply.
- Complete Suite proposed: $149/$1,490 with Hub Team, Live Pro, Music team, Count for 1 campus, including Hub’s Staff and Request Portals. Setup, migration, and custom work are separately scoped. Individual monthly components total $186.99, so proposed monthly savings are $37.99. Annual components total $1,869.99, so proposed annual savings are $379.99.

Rationale: preserve an inexpensive operations entry point, make songwriting/attendance approachable, charge Live by production capacity, and provide a meaningful bundle discount. This is a positioning and pricing hypothesis, not validated unit economics. Before selling the bundle, review storage/streaming/support costs and limits, enable paid products, define refunds/taxes and seat transitions, and implement a confirmed migration from existing App Store billing to avoid double billing. The site explicitly distinguishes separate accounts and permissions from a future purchasing bundle. No promise of unified sign-in or automatic cross-product data exchange is made.

All 18 original operational/legal files remain byte-for-byte preserved, with the original homepage archived at support-center.html. Do not publish local responsive test fixtures.

## October 4 product tours and FAQ

The four product pages and two Hub feature pages include progressively enhanced screen tours (19 screens total) with full-size image links, workflow explanations, and product-specific FAQs. With JavaScript disabled, every tour panel remains readable. `faq.html` provides 16 suite-wide questions; the homepage, resource directory, and shared footer link to it. Existing product, access, support, and pricing destinations remain in place.

Resources uses the shared family icons for Hub, Live, Music, and Count. The portals use the Hub family mark and are explicitly presented as Hub features; no separate portal app icon has been invented.

New Hub screens come from existing training captures. Additional Music/Count screens use native review/demo fixtures; the Live readiness capture uses the actual renderer with an isolated fictional service and synthetic readings. Staff People uses an existing fictional QA preview. Request screenshots render the original form layouts with fictional contact/event/expense details in isolated, script-free fixtures with form submission disabled. Only the PNGs are published; live forms and services are unchanged. No real financial account data was entered.

Browser verification covers all 19 tour selections, FAQ expansion, and all 11 authored pages at 390, 768, and 1440 pixels. Image dimensions reserve space while screens load. Keep `assets/products/sources.json` current when replacing images, and update the content-hashed CSS/JS URLs when shared assets change.

## Product hierarchy correction

The product family is Hub, Live, Music, and Count. Staff Portal and Request Portal belong to Hub. Their detail URLs remain for feature tours and existing links; they are not standalone products or subscriptions. Resources nests their entry points under Hub, pricing includes them within Hub, and contact inquiries use Hub.

## Shared product icon family

At the user’s request, all four website product icons now share the existing two-stroke vector paths from Live’s public icon. Geometry, mark scale, placement, and tile shape are identical; palettes distinguish Hub (blue/purple/aqua), Live (orange), Music (olive on cream), and Count (white and blue on black). The SVG files are named `*-family-icon.svg` and used throughout the marketing pages and website favicon. Original native PNG assets are retained; native app bundles and App Store listings were not changed by this website release.
