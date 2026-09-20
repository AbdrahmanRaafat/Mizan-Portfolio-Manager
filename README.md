# Mizan Portfolio Manager

This repository contains the **original Mizan browser application and API bundle**, adapted only at the runtime layer so the same application can run from a public web URL.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/AbdrahmanRaafat/Mizan-Portfolio-Manager)

## What is preserved
- Original Mizan UI and Arabic interface
- Holdings and transaction management
- Cash features
- Portfolio analytics
- Market-price/history API routes
- Funds, FX and gold integrations
- Backup/restore
- Excel/PDF-related browser features
- Local browser storage per visitor

## Deployment
The original application is stored as a verified compressed bundle under `bundle/`.
During deployment, `npm run build` reconstructs `server/index.js` and verifies its SHA-256 before starting.

```bash
npm run build
npm start
```

The server listens on `0.0.0.0:$PORT`. `render.yaml` is configured for a free Render web service, and `railway.toml` is included as an alternative.
