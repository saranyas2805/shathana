"use client";
import {Moon,Sun} from "lucide-react";
import {useEffect,useState} from "react";

export default function ThemeToggle(){
  const [light,setLight]=useState(false);
  useEffect(()=>{
    const saved=localStorage.getItem("disastermesh-theme");
    const isLight=saved==="light";
    setLight(isLight);
    document.documentElement.classList.toggle("light",isLight);
  },[]);
  function toggle(){
    const next=!light;
    setLight(next);
    document.documentElement.classList.toggle("light",next);
    localStorage.setItem("disastermesh-theme",next?"light":"dark");
  }
  return <button className="theme-toggle" onClick={toggle} aria-label={light?"Switch to dark mode":"Switch to light mode"} title={light?"Dark mode":"Light mode"}>
    {light?<Moon size={16}/>:<Sun size={16}/>} {light?"Dark":"Light"} mode
  </button>;
}