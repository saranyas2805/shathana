# DisasterMesh

DisasterMesh is a judge-ready, software-only crisis dispatch MVP for PS-05: Public Safety & Crisis Governance.

## What is implemented

- Next.js + React + TypeScript frontend
- Supabase PostgreSQL persistence
- Citizen SOS reporting
- Explainable severity scoring
- Deterministic Chennai/Tamil Nadu location extraction fallback
- 500m category-aware spatial clustering
- Dispatcher command center
- Leaflet + OpenStreetMap live map
- Rescue unit status and nearest-unit dispatch
- Supabase Realtime subscriptions with refresh fallback
- Browser Web Speech API voice input when supported
- Seeded demo incidents, reports and rescue units
- Safe demo reset RPC
- No hardware and no required LLM/API key

## Architecture

Citizen UI -> Next.js API route -> deterministic analysis -> Supabase RPC -> reports/incidents -> Realtime -> Dispatcher Dashboard.

Core database operations are atomic PostgreSQL functions:
- `process_sos`: creates a report and either attaches it to a nearby compatible incident or creates a new incident.
- `assign_nearest_unit`: selects the nearest AVAILABLE unit, creates a dispatch, updates unit status and incident status.
- `reset_demo_data`: restores the seeded judge demo.

## Local setup

1. Install Node.js 20+.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env.local` from `.env.example`.
4. Create a Supabase project.
5. Run `supabase/migrations/20261008000000_disastermesh.sql` in the Supabase SQL editor.
6. Run `supabase/seed.sql` in the SQL editor.
7. Add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` only as a server-side environment variable if desired.
8. Start:
   ```bash
   npm run dev
   ```
9. Open `http://localhost:3000`.

## Demo workflow

1. Open **Dispatcher Dashboard**.
2. Open **Citizen SOS**.
3. Submit the prefilled Tambaram fire scenario.
4. Show CRITICAL severity and reasons.
5. Show the existing nearby fire cluster and increased report count.
6. Return to the dashboard; the incident updates through Realtime.
7. Select the incident and click **ASSIGN NEAREST AVAILABLE UNIT**.
8. Show Fire Rescue Unit 01/02 moving from AVAILABLE to ASSIGNED and the incident moving to DISPATCHED.
9. Refresh the dashboard to demonstrate persistence.

## Environment variables

See `.env.example`. Never commit `.env.local` or service-role credentials.

## Intentional scope

Image upload is represented in the citizen UI but not persisted yet; this is P1 and not required for the core 3-minute verification. LLM enhancement, advanced routing, authentication and analytics are intentionally omitted so the P0 flow stays deterministic and explainable.
