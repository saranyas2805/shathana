from flask import Flask, render_template, request, jsonify
import sqlite3, math, re
from datetime import datetime

app = Flask(__name__)
DB = "disastermesh.db"

PLACES = {
    "chennai": (13.0827, 80.2707), "t nagar": (13.0418,80.2341),
    "adyar": (13.0067,80.2575), "velachery": (12.9815,80.2180),
    "guindy": (13.0068,80.2206), "anna nagar": (13.0850,80.2101),
    "marina": (13.0499,80.2824), "tambaram": (12.9249,80.1000)
}

def conn():
    c=sqlite3.connect(DB); c.row_factory=sqlite3.Row
    return c

def init_db():
    c=conn()
    c.executescript("""
    CREATE TABLE IF NOT EXISTS incidents(
      id INTEGER PRIMARY KEY AUTOINCREMENT, description TEXT NOT NULL,
      channel TEXT NOT NULL, location TEXT NOT NULL, lat REAL NOT NULL, lon REAL NOT NULL,
      disaster_type TEXT NOT NULL, severity TEXT NOT NULL, score INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'OPEN', cluster_id INTEGER,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS reports(
      id INTEGER PRIMARY KEY AUTOINCREMENT, incident_id INTEGER NOT NULL,
      description TEXT NOT NULL, channel TEXT NOT NULL, created_at TEXT NOT NULL,
      FOREIGN KEY(incident_id) REFERENCES incidents(id)
    );
    CREATE TABLE IF NOT EXISTS units(
      id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, unit_type TEXT NOT NULL,
      lat REAL NOT NULL, lon REAL NOT NULL, status TEXT NOT NULL DEFAULT 'AVAILABLE',
      incident_id INTEGER
    );
    """)
    if c.execute("SELECT COUNT(*) FROM units").fetchone()[0]==0:
        c.executemany("INSERT INTO units(name,unit_type,lat,lon,status) VALUES(?,?,?,?,?)",[
          ("Rescue-01","RESCUE",13.0827,80.2707,"AVAILABLE"),
          ("Fire-02","FIRE",13.0475,80.2824,"AVAILABLE"),
          ("Medical-03","MEDICAL",13.0674,80.2376,"AVAILABLE"),
          ("Rescue-04","RESCUE",13.1067,80.2206,"AVAILABLE")
        ])
    c.commit(); c.close()

def distance(a,b,c,d):
    R=6371; p1=math.radians(a); p2=math.radians(c)
    x=math.sin(math.radians(c-a)/2)**2+math.cos(p1)*math.cos(p2)*math.sin(math.radians(d-b)/2)**2
    return 2*R*math.asin(math.sqrt(x))

def extract_location(text, lat=None, lon=None):
    if lat is not None and lon is not None:
        return "Map location", float(lat), float(lon)
    t=text.lower()
    for p,(a,b) in PLACES.items():
        if p in t: return p.title(),a,b
    return "Chennai",13.0827,80.2707

def classify(text):
    t=text.lower()
    critical=["trapped","collapsed","collapse","unconscious","explosion","people trapped","life threatening","major fire","missing"]
    high=["fire","flood","cyclone","accident","injured","rescue","smoke","emergency"]
    medium=["water","blocked","damage","fallen tree","power"]
    score=20
    score += sum(20 for k in critical if k in t)
    score += sum(12 for k in high if k in t)
    score += sum(7 for k in medium if k in t)
    score=min(score,100)
    sev="CRITICAL" if score>=76 else "HIGH" if score>=56 else "MEDIUM" if score>=31 else "LOW"
    if any(x in t for x in ["fire","smoke","explosion"]): typ="FIRE"
    elif any(x in t for x in ["flood","water"]): typ="FLOOD"
    elif any(x in t for x in ["cyclone","storm"]): typ="CYCLONE"
    elif any(x in t for x in ["collapse","building"]): typ="STRUCTURAL"
    elif any(x in t for x in ["accident","injured"]): typ="ACCIDENT"
    else: typ="GENERAL"
    return typ,sev,score

def find_cluster(c,lat,lon,typ):
    rows=c.execute("SELECT * FROM incidents WHERE status!='RESOLVED'").fetchall()
    for r in rows:
        if distance(lat,lon,r["lat"],r["lon"])<=2 and (typ==r["disaster_type"] or typ=="GENERAL" or r["disaster_type"]=="GENERAL"):
            return r["cluster_id"] or r["id"]
    return None

@app.route("/")
def home(): return render_template("index.html")

@app.get("/api/dashboard")
def dashboard():
    c=conn()
    incidents=[dict(r) for r in c.execute("SELECT * FROM incidents ORDER BY id DESC").fetchall()]
    units=[dict(r) for r in c.execute("SELECT * FROM units ORDER BY id").fetchall()]
    clusters={}
    for i in incidents:
        clusters[i["cluster_id"]]=clusters.get(i["cluster_id"],0)+1
    stats={
      "reports":c.execute("SELECT COUNT(*) FROM reports").fetchone()[0],
      "incidents":len(incidents),
      "critical":c.execute("SELECT COUNT(*) FROM incidents WHERE severity='CRITICAL' AND status!='RESOLVED'").fetchone()[0],
      "available":c.execute("SELECT COUNT(*) FROM units WHERE status='AVAILABLE'").fetchone()[0],
      "clusters":len([x for x in clusters if x is not None])
    }
    c.close(); return jsonify({"stats":stats,"incidents":incidents,"units":units})

@app.post("/api/report")
def report():
    data=request.form if request.form else (request.get_json(silent=True) or {})
    text=(data.get("description") or "").strip()
    if not text: return jsonify(ok=False,message="Describe the emergency."),400
    channel=data.get("channel","text")
    try: lat=float(data.get("lat")) if data.get("lat") else None
    except: lat=None
    try: lon=float(data.get("lon")) if data.get("lon") else None
    except: lon=None
    location,lat,lon=extract_location(text,lat,lon)
    typ,sev,score=classify(text)
    c=conn(); cluster=find_cluster(c,lat,lon,typ)
    if cluster is None:
        cur=c.execute("INSERT INTO incidents(description,channel,location,lat,lon,disaster_type,severity,score,status,created_at) VALUES(?,?,?,?,?,?,?,?,?,?)",
          (text,channel,location,lat,lon,typ,sev,score,"OPEN",datetime.now().strftime("%Y-%m-%d %H:%M:%S")))
        incident_id=cur.lastrowid; cluster=incident_id
        c.execute("UPDATE incidents SET cluster_id=? WHERE id=?",(cluster,incident_id))
        merged=False
    else:
        r=c.execute("SELECT id,score FROM incidents WHERE cluster_id=? AND status!='RESOLVED' LIMIT 1",(cluster,)).fetchone()
        incident_id=r["id"]; merged=True
        if score>r["score"]:
            c.execute("UPDATE incidents SET severity=?,score=?,description=? WHERE id=?",(sev,score,text,incident_id))
    c.execute("INSERT INTO reports(incident_id,description,channel,created_at) VALUES(?,?,?,?)",
      (incident_id,text,channel,datetime.now().strftime("%Y-%m-%d %H:%M:%S")))
    c.commit(); c.close()
    return jsonify(ok=True,incident_id=incident_id,cluster_id=cluster,merged=merged,
                   location=location,disaster_type=typ,severity=sev,score=score)

@app.post("/api/dispatch/<int:incident_id>")
def dispatch(incident_id):
    c=conn(); inc=c.execute("SELECT * FROM incidents WHERE id=?",(incident_id,)).fetchone()
    if not inc: c.close(); return jsonify(ok=False,message="Incident not found"),404
    required={"FIRE":"FIRE","STRUCTURAL":"RESCUE","ACCIDENT":"MEDICAL","FLOOD":"RESCUE","CYCLONE":"RESCUE"}.get(inc["disaster_type"],"RESCUE")
    units=c.execute("SELECT * FROM units WHERE status='AVAILABLE'").fetchall()
    compatible=[u for u in units if u["unit_type"]==required] or units
    if not compatible: c.close(); return jsonify(ok=False,message="No available response unit"),409
    u=min(compatible,key=lambda x:distance(inc["lat"],inc["lon"],x["lat"],x["lon"]))
    d=round(distance(inc["lat"],inc["lon"],u["lat"],u["lon"]),2)
    c.execute("UPDATE units SET status='DISPATCHED',incident_id=? WHERE id=?",(incident_id,u["id"]))
    c.execute("UPDATE incidents SET status='DISPATCHED' WHERE id=?",(incident_id,))
    c.commit(); c.close()
    return jsonify(ok=True,unit=dict(u),distance_km=d)

@app.post("/api/resolve/<int:incident_id>")
def resolve(incident_id):
    c=conn(); c.execute("UPDATE incidents SET status='RESOLVED' WHERE id=?",(incident_id,))
    c.execute("UPDATE units SET status='AVAILABLE',incident_id=NULL WHERE incident_id=?",(incident_id,))
    c.commit(); c.close(); return jsonify(ok=True)

@app.post("/api/demo")
def demo():
    samples=[
      ("Building collapse near T Nagar, people trapped inside","text",13.0418,80.2341),
      ("Major fire and smoke near Marina, emergency rescue required","voice",13.0499,80.2824),
      ("Flood water blocking road at Velachery","text",12.9815,80.2180),
      ("T Nagar building collapsed, please send rescue team","image",13.0420,80.2345)
    ]
    for text,ch,lat,lon in samples:
        with app.test_request_context():
            pass
        c=conn(); typ,sev,score=classify(text); cluster=find_cluster(c,lat,lon,typ)
        if cluster is None:
            cur=c.execute("INSERT INTO incidents(description,channel,location,lat,lon,disaster_type,severity,score,status,created_at) VALUES(?,?,?,?,?,?,?,?,?,?)",
              (text,ch,"Demo location",lat,lon,typ,sev,score,"OPEN",datetime.now().strftime("%Y-%m-%d %H:%M:%S")))
            iid=cur.lastrowid; cluster=iid; c.execute("UPDATE incidents SET cluster_id=? WHERE id=?",(cluster,iid))
        else: iid=c.execute("SELECT id FROM incidents WHERE cluster_id=? LIMIT 1",(cluster,)).fetchone()["id"]
        c.execute("INSERT INTO reports(incident_id,description,channel,created_at) VALUES(?,?,?,?)",(iid,text,ch,datetime.now().strftime("%Y-%m-%d %H:%M:%S")))
        c.commit(); c.close()
    return jsonify(ok=True)

init_db()
if __name__=="__main__": app.run(debug=True)
