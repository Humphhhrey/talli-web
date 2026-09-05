# Talli web

This static Cloudflare Pages site serves Talli’s public invite fallback and Apple Universal Link verification. It is intentionally not a browser version of the expense app.

## Required deployment configuration

- Connect the repository to Cloudflare Pages with build command `npm run build` and output directory `dist`.
- Deploy to the `talli.hamfri.me` custom domain.
- Set `TALLI_APP_STORE_URL` to Talli’s published App Store URL before production deployment.
- Serve `/.well-known/apple-app-site-association` without redirects and as `application/json`.
- Deploy this site before the iOS build that enables `applinks:talli.hamfri.me`.

The `/join/<token>` route uses Cloudflare Pages’ default static single-page-app fallback: the browser reads the opaque token only to construct the `talli://` handoff link. It never calls the API or reveals group data. The signed iOS app validates the token only after the recipient signs in.

## Privacy policy and publication

The complete, JavaScript-independent policy lives at `public/privacy/index.html` and is prepared for `https://talli.hamfri.me/privacy`. Both `/privacy` and `/privacy/` must serve that document (a canonical redirect is acceptable), not the SPA homepage. The homepage and invite pages include Privacy Policy and Contact us footer links.

This source change does not publish the site or configure DNS. This repository supports static Cloudflare hosting: the existing `wrangler.toml` uses Workers assets with SPA fallback; the Pages setup above is also documented. Use the existing production project's deployment method, without migrating hosting. Run `npm test` and `npm run build` before publication. Static HTML asset handling resolves the privacy directory independently of the invitation fallback.

The editable policy is maintained in the sibling mobile repository at `docs/privacy-policy.md`; its `public/privacy/index.html` copy must match this site's policy byte-for-byte. Update all three together. Full rollout steps are in the mobile repository's `docs/PRIVACY_PUBLICATION.md`.

Before releasing native builds, verify the Apple association file on the new domain. Android verified links additionally require `/.well-known/assetlinks.json` containing the actual release signing fingerprint; this repository does not yet contain that file. No fingerprint is fabricated here. Existing Apple association paths remain limited to invitations; this change does not add a browser password-reset flow or expand Apple reset-link support.
