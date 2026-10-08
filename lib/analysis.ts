import type {Category,Severity} from "./types";
const LOCATION_MAP:Record<string,{name:string;lat:number;lng:number}>={
"tambaram railway station":{name:"Tambaram Railway Station",lat:12.9249,lng:80.1000},
"tambaram":{name:"Tambaram",lat:12.9249,lng:80.1000},
"chromepet":{name:"Chromepet",lat:12.9516,lng:80.1462},
"velachery":{name:"Velachery",lat:12.9750,lng:80.2210},
"adyar":{name:"Adyar",lat:13.0067,lng:80.2570},
"guindy":{name:"Guindy",lat:13.0067,lng:80.2206},
"saidapet":{name:"Saidapet",lat:13.0213,lng:80.2231},
"porur":{name:"Porur",lat:13.0358,lng:80.1560}
};
const CRITICAL=["trapped","unconscious","collapse","people trapped","fire spreading","multiple casualties","severe injury","immediate danger"];
const HIGH=["injured","stranded","rising water","major fire","elderly at risk","children at risk"];
const MEDIUM=["blocked road","flooding","property damage","isolated person"];
export function analyze(text:string,category:Category){const t=text.toLowerCase();let score=0;const reasons:string[]=[];for(const x of CRITICAL)if(t.includes(x)){score+=5;reasons.push(x)}for(const x of HIGH)if(t.includes(x)){score+=3;reasons.push(x)}for(const x of MEDIUM)if(t.includes(x)){score+=1;reasons.push(x)}if(category==="FIRE"&&t.includes("fire"))score+=3;if(category==="MEDICAL"&&/unconscious|severe injury|injured/.test(t))score+=3;const severity:Severity=score>=8?"CRITICAL":score>=5?"HIGH":score>=2?"MEDIUM":"LOW";return{severity,score,reasons:reasons.length?reasons:["No high-risk indicator detected"]}}
export function extractLocation(text:string,lat?:number,lng?:number){const t=text.toLowerCase();for(const [key,v] of Object.entries(LOCATION_MAP))if(t.includes(key))return {location_text:v.name,latitude:v.lat,longitude:v.lng};if(typeof lat==="number"&&typeof lng==="number")return {location_text:"Browser-selected location",latitude:lat,longitude:lng};return {location_text:"Tambaram Railway Station (demo fallback)",latitude:12.9249,longitude:80.1000};}
export function haversine(aLat:number,aLng:number,bLat:number,bLng:number){const R=6371000,dLat=(bLat-aLat)*Math.PI/180,dLng=(bLng-aLng)*Math.PI/180;const x=Math.sin(dLat/2)**2+Math.cos(aLat*Math.PI/180)*Math.cos(bLat*Math.PI/180)*Math.sin(dLng/2)**2;return 2*R*Math.asin(Math.sqrt(x))}
