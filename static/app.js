let map,markers=[];
function init(){map=L.map('map').setView([13.0827,80.2707],12);L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap'}).addTo(map);load()}
function color(s){return s==='CRITICAL'?'#ff4e68':s==='HIGH'?'#ffad4d':s==='MEDIUM'?'#48bff0':'#6bea9f'}
async function load(){
 const d=await (await fetch('/api/dashboard')).json();
 for(const m of markers)map.removeLayer(m);markers=[];
 for(const i of d.incidents){const m=L.circleMarker([i.lat,i.lon],{radius:i.severity==='CRITICAL'?10:8,color:color(i.severity),fillColor:color(i.severity),fillOpacity:.82}).addTo(map);m.bindPopup('<b>'+i.severity+'</b><br>'+i.description+'<br>Cluster #'+i.cluster_id);markers.push(m)}
 for(const u of d.units){const m=L.marker([u.lat,u.lon]).addTo(map);m.bindPopup('<b>'+u.name+'</b><br>'+u.unit_type+' • '+u.status);markers.push(m)}
 for(const k of ['reports','incidents','critical','available','clusters'])document.getElementById(k).textContent=d.stats[k];
 document.getElementById('incidentList').innerHTML=d.incidents.length?d.incidents.map(i=>'<div class="item"><div class="itemtop"><b>#'+i.id+' • '+i.location+'</b><span class="badge '+i.severity+'">'+i.severity+' '+i.score+'%</span></div><div>'+i.description+'</div><div class="small">'+i.disaster_type+' • '+i.channel.toUpperCase()+' • '+i.status+' • Cluster #'+i.cluster_id+'</div>'+(i.status==='OPEN'?'<button class="dispatch" onclick="dispatch('+i.id+')">DISPATCH RESPONSE UNIT</button>':i.status==='DISPATCHED'?'<button class="resolve" onclick="resolve('+i.id+')">MARK RESOLVED</button>':'')+'</div>').join(''):'<p class="muted">No incidents yet.</p>';
 document.getElementById('unitList').innerHTML=d.units.map(u=>'<div class="unit"><div><b>'+u.name+'</b><div class="small">'+u.unit_type+'</div></div><span class="'+(u.status==='AVAILABLE'?'avail':'busy')+'">'+u.status+'</span></div>').join('')
}
async function submitReport(){
 const body={description:document.getElementById('desc').value,channel:document.getElementById('channel').value,lat:document.getElementById('lat').value,lon:document.getElementById('lon').value};
 if(!body.description.trim()){toast('Enter emergency details');return}
 const d=await (await fetch('/api/report',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})).json();
 if(!d.ok){toast(d.message);return}
 document.getElementById('result').textContent='SOS #'+d.incident_id+' • '+d.severity+' • '+d.location+(d.merged?' • DUPLICATE REPORT MERGED into Cluster #'+d.cluster_id:' • NEW INCIDENT');
 document.getElementById('desc').value='';load();toast('SOS processed successfully')
}
async function dispatch(id){const d=await (await fetch('/api/dispatch/'+id,{method:'POST'})).json();toast(d.ok?d.unit.name+' dispatched • '+d.distance_km+' km':d.message);load()}
async function resolve(id){await fetch('/api/resolve/'+id,{method:'POST'});toast('Incident resolved; unit available again');load()}
async function demo(){await fetch('/api/demo',{method:'POST'});toast('Demo crisis data loaded');load()}
function toast(s){const x=document.getElementById('toast');x.textContent=s;x.style.display='block';setTimeout(()=>x.style.display='none',2600)}
init();setInterval(load,5000);