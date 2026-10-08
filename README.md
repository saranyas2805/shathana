# DisasterMesh — PS-05 Hackathon Solution

DisasterMesh is a 100% software crisis dispatch command center built directly for the PS-05 problem statement.

## What it demonstrates
- Citizen distress reports through text, simulated voice transcript and image evidence channels
- NLP-style entity extraction for location and disaster type
- Explainable urgency scoring: LOW / MEDIUM / HIGH / CRITICAL
- Geospatial clustering of nearby duplicate reports within 2 km
- Dispatcher triage command center
- Live incident map
- Capability-aware response-unit dispatch
- Live field-unit status tracking
- SQLite live persistence
- No hardware, IoT devices or client-side API keys

## Unique idea
Instead of treating every citizen report as a separate incident, DisasterMesh creates a master incident cluster. New nearby reports are attached to the same cluster, reducing duplicate dispatches and helping the dispatcher understand how many citizens are reporting the same crisis.

## Run locally
```bash
python -m venv venv
venv\\Scripts\\activate
pip install -r requirements.txt
python app.py
```

Open http://127.0.0.1:5000

## 3-minute verification
1. Click **3-MINUTE DEMO**.
2. Show the map and incident clusters.
3. Submit: **Building collapse near T Nagar, people trapped inside**.
4. Show CRITICAL classification and automatic location extraction.
5. Submit another T Nagar collapse report.
6. Show **DUPLICATE REPORT MERGED** into the existing cluster.
7. Click **DISPATCH RESPONSE UNIT**.
8. Show the correct response unit changing to DISPATCHED.
9. Click **MARK RESOLVED** and show the unit becoming AVAILABLE.

## Security
No credentials or API keys are stored in the frontend. The application uses local SQLite persistence and public OpenStreetMap tiles.
