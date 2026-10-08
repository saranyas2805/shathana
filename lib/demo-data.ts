import type {Incident, Report, RescueUnit, Dispatch} from "./types";

export const STORAGE_KEY = "disastermesh-demo-v1";

const now = new Date().toISOString();

export const seedIncidents: Incident[] = [
  {id:"incident-1",title:"Fire near Tambaram Railway Station",category:"FIRE",description:"Building fire with people trapped.",latitude:12.9249,longitude:80.1000,location_text:"Tambaram Railway Station",severity:"CRITICAL",severity_score:13,severity_reasons:["fire spreading","people trapped","immediate danger"],report_count:3,status:"TRIAGED",created_at:now,updated_at:now},
  {id:"incident-2",title:"Flooding at Velachery Main Road",category:"FLOOD",description:"Rising water stranded residents.",latitude:12.9750,longitude:80.2210,location_text:"Velachery Main Road",severity:"HIGH",severity_score:7,severity_reasons:["rising water","stranded"],report_count:2,status:"TRIAGED",created_at:now,updated_at:now},
  {id:"incident-3",title:"Medical emergency at Adyar",category:"MEDICAL",description:"Severe injury reported.",latitude:13.0067,longitude:80.2570,location_text:"Adyar",severity:"HIGH",severity_score:8,severity_reasons:["severe injury","immediate danger"],report_count:1,status:"DISPATCHED",created_at:now,updated_at:now},
  {id:"incident-4",title:"Blocked road at Guindy",category:"ROAD BLOCKAGE",description:"Flood debris blocks one lane.",latitude:13.0067,longitude:80.2206,location_text:"Guindy",severity:"MEDIUM",severity_score:2,severity_reasons:["blocked road","flooding"],report_count:1,status:"NEW",created_at:now,updated_at:now},
  {id:"incident-5",title:"Minor property damage at Porur",category:"OTHER",description:"Minor storm damage observed.",latitude:13.0358,longitude:80.1560,location_text:"Porur",severity:"LOW",severity_score:1,severity_reasons:["property damage"],report_count:1,status:"NEW",created_at:now,updated_at:now}
];

export const seedReports: Report[] = [
  {id:"report-1",incident_id:"incident-1",description:"Fire spreading near Tambaram station, people trapped.",source:"text",latitude:12.9249,longitude:80.1000,location_text:"Tambaram Railway Station",severity:"CRITICAL",severity_score:13,severity_reasons:["fire spreading","people trapped"],created_at:now},
  {id:"report-2",incident_id:"incident-1",description:"Smoke and flames visible near the station building.",source:"voice",latitude:12.9252,longitude:80.1002,location_text:"Tambaram Railway Station",severity:"HIGH",severity_score:8,severity_reasons:["fire spreading"],created_at:now},
  {id:"report-3",incident_id:"incident-1",description:"People are trapped inside.",source:"text",latitude:12.9247,longitude:80.0998,location_text:"Tambaram Railway Station",severity:"CRITICAL",severity_score:10,severity_reasons:["people trapped"],created_at:now},
  {id:"report-4",incident_id:"incident-2",description:"Water is rising and residents are stranded.",source:"text",latitude:12.9750,longitude:80.2210,location_text:"Velachery Main Road",severity:"HIGH",severity_score:7,severity_reasons:["rising water","stranded"],created_at:now},
  {id:"report-5",incident_id:"incident-2",description:"Flooding across the road.",source:"text",latitude:12.9753,longitude:80.2212,location_text:"Velachery Main Road",severity:"MEDIUM",severity_score:2,severity_reasons:["flooding"],created_at:now},
  {id:"report-6",incident_id:"incident-3",description:"Person has severe injury.",source:"text",latitude:13.0067,longitude:80.2570,location_text:"Adyar",severity:"HIGH",severity_score:8,severity_reasons:["severe injury"],created_at:now},
  {id:"report-7",incident_id:"incident-4",description:"Road blocked by debris.",source:"text",latitude:13.0067,longitude:80.2206,location_text:"Guindy",severity:"MEDIUM",severity_score:2,severity_reasons:["blocked road"],created_at:now},
  {id:"report-8",incident_id:"incident-5",description:"Minor property damage observed.",source:"image",latitude:13.0358,longitude:80.1560,location_text:"Porur",severity:"LOW",severity_score:1,severity_reasons:["property damage"],created_at:now}
];

export const seedUnits: RescueUnit[] = [
  {id:"unit-1",name:"Fire Rescue Unit 01",type:"Fire Rescue",latitude:12.9300,longitude:80.1050,status:"AVAILABLE",current_incident_id:null,updated_at:now},
  {id:"unit-2",name:"Fire Rescue Unit 02",type:"Fire Rescue",latitude:12.9200,longitude:80.0970,status:"AVAILABLE",current_incident_id:null,updated_at:now},
  {id:"unit-3",name:"Flood Rescue Unit 01",type:"Flood Rescue",latitude:12.9700,longitude:80.2250,status:"ASSIGNED",current_incident_id:"incident-2",updated_at:now},
  {id:"unit-4",name:"Ambulance Unit 01",type:"Ambulance",latitude:13.0100,longitude:80.2600,status:"EN_ROUTE",current_incident_id:"incident-3",updated_at:now},
  {id:"unit-5",name:"General Rescue 01",type:"General Rescue",latitude:13.0000,longitude:80.2150,status:"ON_SCENE",current_incident_id:"incident-4",updated_at:now},
  {id:"unit-6",name:"General Rescue 02",type:"General Rescue",latitude:13.0400,longitude:80.1500,status:"AVAILABLE",current_incident_id:null,updated_at:now}
];

export interface DemoState {incidents:Incident[];reports:Report[];units:RescueUnit[];dispatches:Dispatch[]}

export function freshDemoState(): DemoState {
  return {incidents:structuredClone(seedIncidents),reports:structuredClone(seedReports),units:structuredClone(seedUnits),dispatches:[
    {id:"dispatch-1",incident_id:"incident-2",unit_id:"unit-3",assigned_at:now,status:"ASSIGNED"},
    {id:"dispatch-2",incident_id:"incident-3",unit_id:"unit-4",assigned_at:now,status:"EN_ROUTE"}
  ]};
}

export function loadDemoState(): DemoState {
  if(typeof window==="undefined") return freshDemoState();
  try { const raw=localStorage.getItem(STORAGE_KEY); if(raw) return JSON.parse(raw) as DemoState; } catch {}
  const state=freshDemoState(); localStorage.setItem(STORAGE_KEY,JSON.stringify(state)); return state;
}

export function saveDemoState(state:DemoState) {
  if(typeof window!=="undefined") localStorage.setItem(STORAGE_KEY,JSON.stringify(state));
}
