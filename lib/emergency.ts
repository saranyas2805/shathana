export type EvidenceItem={name:string;type:string;size:number};
export interface Zone{name:string;type:"SAFE"|"DANGER";latitude:number;longitude:number;radius:number;description:string}
export const ZONES:Zone[]=[
{name:"Safe Assembly Zone",type:"SAFE",latitude:12.947,longitude:80.180,radius:900,description:"Suggested safe gathering area"},
{name:"Flood Danger Zone",type:"DANGER",latitude:12.975,longitude:80.221,radius:1100,description:"Flood-risk area"},
{name:"Fire Danger Zone",type:"DANGER",latitude:12.925,longitude:80.100,radius:700,description:"Active fire-risk area"},
{name:"Medical Safe Point",type:"SAFE",latitude:13.0067,longitude:80.257,radius:500,description:"Nearby medical support area"}
];
export const DISPATCHERS=["Dispatcher Alpha","Dispatcher Bravo","Dispatcher Charlie"];
export const QUEUE_KEY="disastermesh-offline-queue-v1";
export const NOTIFY_KEY="disastermesh-notifications-v1";
export function saveOfflineReport(report:any){if(typeof window==="undefined")return;const q=JSON.parse(localStorage.getItem(QUEUE_KEY)||"[]");q.push(report);localStorage.setItem(QUEUE_KEY,JSON.stringify(q))}
export function getOfflineReports(){if(typeof window==="undefined")return [];try{return JSON.parse(localStorage.getItem(QUEUE_KEY)||"[]")}catch{return []}}
export function clearOfflineReports(){if(typeof window!=="undefined")localStorage.removeItem(QUEUE_KEY)}
export function addNotification(message:string){if(typeof window==="undefined")return;const n=JSON.parse(localStorage.getItem(NOTIFY_KEY)||"[]");n.unshift({id:crypto.randomUUID(),message,created_at:new Date().toISOString(),read:false});localStorage.setItem(NOTIFY_KEY,JSON.stringify(n).slice(0,20000))}
