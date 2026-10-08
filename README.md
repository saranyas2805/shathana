# DisasterMesh

DisasterMesh is a software-only crisis dispatch MVP for PS-05: Public Safety & Crisis Governance.

## What is implemented

- Next.js + React + TypeScript
- Browser-local demo persistence with localStorage (no external database required)
- Citizen SOS reporting
- Explainable severity scoring
- Deterministic Chennai/Tamil Nadu location extraction fallback
- 500m category-aware spatial clustering
- Dispatcher command center
- Leaflet + OpenStreetMap map
- Rescue unit status and nearest-unit dispatch
- Browser Web Speech API voice input when supported
- Seeded demo incidents, reports and rescue units
- No Supabase project, database, API key, LLM, or external backend required

## Architecture

Citizen UI -> deterministic analysis -> browser demo store -> Dispatcher Dashboard.

The demo store is persisted in browser localStorage so the hackathon flow survives page refreshes without requiring a hosted database.

## Local / Vercel setup

1. Install Node.js 20+.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000`.

No `.env.local` or Supabase configuration is required.

## Demo workflow

1. Open **Dispatcher Dashboard**.
2. Open **Citizen SOS**.
3. Submit the prefilled Tambaram fire scenario.
4. Show CRITICAL severity and reasons.
5. The report is clustered with the nearby compatible incident when within 500m.
6. Return to the dashboard; the incident/report state is stored in the browser.
7. Select the incident and click **ASSIGN NEAREST AVAILABLE UNIT**.
8. Show a nearby AVAILABLE rescue unit becoming ASSIGNED and the incident becoming DISPATCHED.
9. Refresh the dashboard to demonstrate browser persistence.

## Reset

Use **RESET DEMO** in the dispatcher dashboard to restore the seeded incidents and rescue units.

## Intentional scope

Image upload is represented in the citizen UI but is not persisted. LLM enhancement, advanced routing, authentication and analytics are intentionally omitted so the P0 flow stays deterministic and explainable.
