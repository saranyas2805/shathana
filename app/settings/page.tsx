"use client";
import Link from "next/link";
import {ArrowLeft,Bell,Check,Globe,MapPin,ShieldCheck,Volume2,WifiOff} from "lucide-react";
import {useEffect,useState} from "react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Settings(){
 const [notifications,setNotifications]=useState(true);
 const [sound,setSound]=useState(true);
 const [offline,setOffline]=useState(true);
 const [location,setLocation]=useState(true);
 const [saved,setSaved]=useState(false);
 useEffect(()=>{
  setNotifications(localStorage.getItem("dm-notifications")!=="off");
  setSound(localStorage.getItem("dm-sound")!=="off");
  setOffline(localStorage.getItem("dm-offline")!=="off");
  setLocation(localStorage.getItem("dm-location")!=="off");
 },[]);
 function save(){
  localStorage.setItem("dm-notifications",notifications?"on":"off");
  localStorage.setItem("dm-sound",sound?"on":"off");
  localStorage.setItem("dm-offline",offline?"on":"off");
  localStorage.setItem("dm-location",location?"on":"off");
  setSaved(true); setTimeout(()=>setSaved(false),1800);
 }
 const rows=[
  ["Emergency notifications","Receive SOS, acceptance and dispatch alerts.",Bell,notifications,setNotifications],
  ["Alert sound","Play a sound for new critical incidents.",Volume2,sound,setSound],
  ["Offline SOS queue","Keep emergency reports queued when there is no internet.",WifiOff,offline,setOffline],
  ["Location services","Allow the app to use location for emergency reports.",MapPin,location,setLocation],
 ] as const;
 return <main className="settings-page"><header className="settings-header"><Link href="/" className="back"><ArrowLeft/> DisasterMesh</Link><span className="settings-title">SETTINGS</span></header>
 <section className="settings-shell"><div className="settings-hero"><div><span className="eyebrow">CONTROL CENTER</span><h1>App settings</h1><p>Configure how DisasterMesh looks and how emergency alerts behave on this device.</p></div><ShieldCheck size={42}/></div>
 <div className="settings-card"><div className="setting-row"><div className="setting-icon"><SunIcon/></div><div><b>Appearance</b><small>Choose the interface theme.</small></div><ThemeToggle/></div>
 {rows.map(([title,desc,Icon,value,setter])=><div className="setting-row" key={title}><div className="setting-icon"><Icon size={20}/></div><div><b>{title}</b><small>{desc}</small></div><button className={value?"switch on":"switch"} onClick={()=>setter(!value)} aria-pressed={value}><span/></button></div>)}
 <div className="setting-row"><div className="setting-icon"><Globe size={20}/></div><div><b>Language</b><small>Interface language</small></div><span className="setting-value">English</span></div>
 <div className="settings-actions"><Link href="/citizen" className="secondary">Emergency SOS</Link><button className="primary" onClick={save}>{saved?<><Check size={16}/> Saved</>: "Save settings"}</button></div>
 </div><p className="settings-note">Demo settings are stored locally in this browser. Emergency data remains in the existing DisasterMesh demo flow.</p>
 </section></main>
}
function SunIcon(){return <span style={{fontSize:20}}>☀️</span>}