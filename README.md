# Talli web

This static Cloudflare Pages site serves Talli’s public invite fallback and Apple Universal Link verification. It is intentionally not a browser version of the expense app.

## Required deployment configuration

- Connect the repository to Cloudflare Pages with build command `npm run build` and output directory `dist`.
- Deploy to the `app.talli.com` custom domain.
- Set `TALLI_APP_STORE_URL` to Talli’s published App Store URL before production deployment.
- Serve `/.well-known/apple-app-site-association` without redirects and as `application/json`.
- Deploy this site before the iOS build that enables `applinks:app.talli.com`.

The `/join/<token>` route uses Cloudflare Pages’ default static single-page-app fallback: the browser reads the opaque token only to construct the `talli://` handoff link. It never calls the API or reveals group data. The signed iOS app validates the token only after the recipient signs in.
