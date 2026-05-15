# The-Integrated-Woman-Diagnostic-Tool
Live AI-powered life strategy diagnostic for African women. Purpose · Profession · Faith

## Links
- **Live Demo:** https://theintegratedwomandiagnostic.tiiny.site
- **Overview / Pitch Deck:** https://gamma.app/docs/Unlock-Your-Potential-Your-AI-Powered-Life-Strategy-for-the-Moder-65i4mpgv8it0mst

## Project layout
- `index.html` — the entire frontend (single-file HTML/CSS/JS)
- `api/generate.js` — Vercel serverless function that proxies the Claude API for the personalised narrative
- `api/lead.js` — Vercel serverless function that captures opted-in emails to Airtable
- `vercel.json`, `package.json`, `.env.example` — deployment config

## Deploy (Vercel + Airtable)

### 1. Airtable
Create a base. Add a table named `Leads` (or whatever you set in `AIRTABLE_TABLE_NAME`) with these fields:

| Field | Type |
|---|---|
| Email | Single line text |
| Name | Single line text |
| Stage | Single line text |
| Domain | Single line text |
| Faith | Single line text |
| Family | Single line text |
| FirstGen | Single line text |
| Archetype | Single line text |
| ArchetypeId | Single line text |
| Constraint | Single line text |
| ConstraintId | Single line text |
| Scores | Long text |
| Narrative | Long text |
| Consent | Checkbox |
| SubmittedAt | Date (or Single line text) |

Generate a Personal Access Token at https://airtable.com/create/tokens with `data.records:write` scope on the base. Grab the base ID from the API docs page for that base (starts with `app...`).

### 2. Vercel
```sh
npm i -g vercel       # if you don't have it
vercel link           # link this repo to a Vercel project
vercel env add ANTHROPIC_API_KEY
vercel env add AIRTABLE_API_KEY
vercel env add AIRTABLE_BASE_ID
vercel env add AIRTABLE_TABLE_NAME    # e.g. "Leads"
vercel env add ALLOWED_ORIGIN         # optional; set to your deployed origin to lock CORS
vercel --prod
```

Or push this branch and import the repo via the Vercel dashboard, then add the same env vars under **Settings → Environment Variables**.

### 3. Local dev
```sh
npm install
vercel dev            # serves index.html and runs api/* as functions
```

## Environment variables
See `.env.example`. Required:
- `ANTHROPIC_API_KEY` — for `/api/generate`
- `AIRTABLE_API_KEY` — for `/api/lead`
- `AIRTABLE_BASE_ID` — for `/api/lead`

Optional:
- `AIRTABLE_TABLE_NAME` — defaults to `Leads`
- `ALLOWED_ORIGIN` — defaults to `*`. Set to your production origin for a tighter CORS policy.
