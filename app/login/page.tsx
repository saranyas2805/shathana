"use client";
import Link from "next/link";
import {ShieldAlert,LockKeyhole,Mail,ArrowRight} from "lucide-react";
import {useState} from "react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Login(){
 const [submitted,setSubmitted]=useState(false);
 return <main className="login-page"><div className="login-top"><Link href="/" className="brand"><ShieldAlert size={28}/> DISASTERMESH</Link><div className="login-tools"><ThemeToggle/><Link href="/settings">Settings</Link></div></div>
 <section className="login-card"><div className="login-icon"><ShieldAlert size={34}/></div><span className="eyebrow">SECURE ACCESS</span><h1>Welcome back</h1><p>Sign in to access the DisasterMesh emergency command platform.</p>
 <form onSubmit={e=>{e.preventDefault();setSubmitted(true)}}><label>Email or username<><input required placeholder="you@example.com"/></></label><label>Password<><input required type="password" placeholder="••••••••"/></></label><button className="primary login-button">{submitted?"SIGNED IN ✓":<>SIGN IN <ArrowRight size={16}/></>}</button></form>
 {submitted&&<div className="login-success"><LockKeyhole size={16}/> Demo sign-in successful. Continue to the command center.</div>}
 <Link href="/dispatcher" className="command-link">Open Command Center →</Link><div className="login-footer">Emergency? <Link href="/citizen">Send Citizen SOS</Link></div>
 </section></main>