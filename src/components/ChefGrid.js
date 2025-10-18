// src/components/ChefGrid.js
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./ChefGrid.anim.css";

// Images first (must be before any other statements for eslint import/first)
import Chef1 from "../assets/images/chefs/chef1.jpg";
import Chef2 from "../assets/images/chefs/chef2.jpg";
import Chef3 from "../assets/images/chefs/chef3.jpg";
import Chef4 from "../assets/images/chefs/chef4.jpg";
import Chef5 from "../assets/images/chefs/chef5.jpg";
import Placeholder from "../assets/images/placeholders/chef2table_placeholder.png";

// Inline styles
const styles = {
  wrap: { width: "100%", margin: "0 auto", maxWidth: 1100 },
  row3: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16, alignItems: "start" },
  card: { border: "1px solid #eee", borderRadius: 12, padding: 12, background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" },
  img: { width: "100%", height: 220, objectFit: "cover", borderRadius: 10, display: "block", background: "#f6f6f6" },
  name: { margin: "10px 0 4px", fontSize: 18, fontWeight: 700 },
  spec: { margin: 0, color: "#444" },
};

// Local fallback 5 real chef images
const LOCAL_REAL = [
  { name: "Chef Maria",  specialty: "Farm-to-table",    image: Chef1 },
  { name: "Chef Marcus", specialty: "Savory Delights",  image: Chef2 },
  { name: "Chef Luis",   specialty: "Seasonal Dishes",  image: Chef3 },
  { name: "Chef Ana",    specialty: "Desserts",         image: Chef4 },
  { name: "Chef Quinn",  specialty: "Artisanal Breads", image: Chef5 },
];

function shuffle(arr){ const a=arr.slice(); for(let i=a.length-1;i>0;i--){const j=(Math.random()*(i+1))|0; [a[i],a[j]]=[a[j],a[i]];} return a; }
function strip(s){ return typeof s === "string" ? s.replace(/^["']|["']$/g, "") : s; }

function normalizeSpecialties(v){
  if (v == null) return "Chef";
  if (Array.isArray(v)) return v.map(strip).filter(Boolean).join(", ");
  if (typeof v === "string") {
    const s = v.trim();
    if (s.startsWith("[") && s.endsWith("]")) {
      try {
        const p = JSON.parse(s);
        if (Array.isArray(p)) return p.map(strip).filter(Boolean).join(", ");
      } catch {}
    }
    if (s.includes(",")) return s.split(",").map((t)=>strip(t.trim())).filter(Boolean).join(", ");
    return strip(s);
  }
  return "Chef";
}

function ensureSixWithOnePlaceholder(realPool){
  const dedupe = (items)=>{ const out=[]; const seen=new Set(); for(const it of items){ const img=it?.image; if(!img || img===Placeholder) continue; if(!seen.has(img)){ out.push(it); seen.add(img);} } return out; };
  let uniqReal = dedupe(realPool || []);
  for (const lr of LOCAL_REAL){ if(uniqReal.length>=5) break; if(!uniqReal.some(x=>x.image===lr.image)) uniqReal.push(lr); }
  if (uniqReal.length<5){ const filler=LOCAL_REAL.filter(lr=>!uniqReal.some(x=>x.image===lr.image)); uniqReal = uniqReal.concat(filler).slice(0,5); }
  const five = shuffle(uniqReal).slice(0,5);
  const ph = { name:"Chefs2Table", specialty:"Featured", image: Placeholder };
  const withPH = five.slice(); withPH.splice(Math.min(4, withPH.length), 0, ph);
  if (withPH.length<6){
    for (const lr of LOCAL_REAL){ if(withPH.length>=6) break; if(!withPH.some(x=>x?.image===lr.image)) withPH.push(lr); }
  }
  return withPH.slice(0,6);
}

function hashString(s){ let h=2166136261>>>0; for(let i=0;i<s.length;i++){ h^=s.charCodeAt(i); h += (h<<1)+(h<<4)+(h<<7)+(h<<8)+(h<<24);} return h>>>0; }
function makeRng(seedStr){ let seed=hashString(seedStr)||123456789; return ()=>{ seed=(seed*1664525+1013904223)>>>0; return seed/0xffffffff; }; }

const VARIANTS=["slide-left","slide-right","slide-up-left","slide-up-right","slide-down-left","slide-down-right"];

export default function ChefGrid({ city }) {
  const instant = useMemo(()=>ensureSixWithOnePlaceholder(LOCAL_REAL),[city]);
  const [cards, setCards] = useState(instant);

  useEffect(()=>{
    let cancelled=false;
    setCards(instant);
    (async ()=>{
      try{
        const res=await fetch(`/api/chefs?city=${encodeURIComponent(city)}&limit=24`,{ headers:{accept:"application/json"}});
        if(!res.ok) throw new Error(`API ${res.status}`);
        const json=await res.json();
        const fromApi = Array.isArray(json?.chefs)
          ? json.chefs.filter(Boolean).map((c)=>({
              id: c.id, // keep id so card can deep-link to ChefDemo
              name: c.name || "Local Chef",
              specialty: normalizeSpecialties(c.specialties),
              image: c.photo_url,
            })).filter((c)=>!!c.image)
          : [];
        const picked = ensureSixWithOnePlaceholder(fromApi.length ? fromApi : LOCAL_REAL);
        if(!cancelled) setCards(picked);
      }catch(e){
        console.warn("ChefGrid fallback due to error:", e);
        if(!cancelled) setCards(instant);
      }
    })();
    return ()=>{ cancelled=true; };
  },[city, instant]);

  const safe = cards.filter(Boolean).slice(0,6);
  while(safe.length<6){
    const extra = LOCAL_REAL.find((lr)=>!safe.some((x)=>x?.image===lr.image));
    safe.push(extra || { name:"Chefs2Table", specialty:"Featured", image: Placeholder });
  }

  const top = safe.slice(0,3);
  const bottom = safe.slice(3,6);

  const animPlan = useMemo(()=>{
    const rng = makeRng(`${city}-${Date.now()}`);
    const dir = Array.from({length:6},()=>VARIANTS[(rng()*VARIANTS.length)|0]);
    const baseDelays=[0,140,280,420,560,700];
    const delays = baseDelays.map((d)=>Math.round(d+(rng()*80-40)));
    const durations = Array.from({length:6},()=> (1.1 + rng()*0.5).toFixed(2)+"s");
    return {dir,delays,durations};
  },[city]);

  const renderCard = (chef, i, rowOffset=0)=>{
    const idx = i+rowOffset;
    const cls = animPlan.dir[idx] || "slide-left";
    const delay = (animPlan.delays[idx] ?? 0) + "ms";
    const duration = animPlan.durations[idx] || "1.2s";

    const href = chef?.id
      ? `/chef-demo/${encodeURIComponent(city)}?id=${encodeURIComponent(chef.id)}`
      : `/chef-demo/${encodeURIComponent(city)}`;

    return (
      <Link
        key={`${chef?.name || "Chef"}-${rowOffset ? "b" : "t"}-${i}`}
        to={href}
        className={`card-anim ${cls}`}
        style={{ ...styles.card, animationDelay: delay, animationDuration: duration, textDecoration:"none", color:"inherit" }}
        aria-label={`View profile for ${chef?.name || "Chef"}`}
      >
        <img src={chef.image} alt={chef.name} style={styles.img} />
        <h3 style={styles.name}>{chef.name}</h3>
        <p style={styles.spec}>{normalizeSpecialties(chef.specialty)}</p>
      </Link>
    );
  };

  return (
    <section style={styles.wrap}>
      <div style={styles.row3}>{top.map((c,i)=>renderCard(c,i,0))}</div>
      <div style={{ ...styles.row3, marginTop:16 }}>{bottom.map((c,i)=>renderCard(c,i,3))}</div>
    </section>
  );
}