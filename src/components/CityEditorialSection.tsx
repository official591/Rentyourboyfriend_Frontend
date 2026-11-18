"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, Navigation, Sparkles } from "lucide-react";

const hotspots = [
  { id: "cafe", name: "Sienna & Cafe Arts", type: "CAFE", x: "32%", y: "45%", match: "Maya (24)", experience: "Pour-over coffees & reading scripts" },
  { id: "gallery", name: "Kolkata Centre for Creativity", type: "GALLERY", x: "65%", y: "30%", match: "Priya (26)", experience: "Contemporary visual art installations" },
  { id: "bookstore", name: "College Street Book Market", type: "BOOKS", x: "48%", y: "20%", match: "Arjun (28)", experience: "Hunting vintage first editions & chai" },
  { id: "ghat", name: "Princep Ghat Riverfront", type: "RIVERSIDE", x: "25%", y: "70%", match: "Rohan (31)", experience: "Sunset walks & photography talks" },
  { id: "music", name: "Someplace Else Basement", type: "MUSIC", x: "78%", y: "60%", match: "Ananya (22)", experience: "Live indie rock gigs & craft sodas" },
  { id: "food", name: "Park Street Legendary Eateries", type: "FOOD", x: "55%", y: "55%", match: "Vikram (27)", experience: "Midnight egg rolls & city stories" },
];

export default function CityEditorialSection() {
  const [activeSpot, setActiveSpot] = useState(hotspots[0]);

  return (
    <section id="city" className="bg-lavender text-dark py-24 sm:py-32 relative overflow-hidden">
      {/* Smooth bottom transition into Cream (HowItWorks) */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-cream/40 to-cream pointer-events-none z-10" />
      
      <div className="px-6 md:px-10 lg:px-16 max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="sticker bg-coral text-white">SECTION // 05</span>
              <span className="sticker bg-lime text-dark">INTERACTIVE CITY MAP</span>
            </div>
            <h2 className="font-display text-5xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-tight text-dark leading-none">
              YOUR CITY, <br />
              <span className="text-cobalt underline decoration-hotpink">BUT DIFFERENT.</span>
            </h2>
          </div>
          <p className="text-sm font-mono font-bold text-dark/80 max-w-xs">
            TAP PINS ON THE CITY GRID TO DISCOVER EXPERIENCES AND COMPANIONS READY TO GO.
          </p>
        </div>

        {/* ── Interactive City Map Canvas ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Stylized Interactive Map Board */}
          <div className="lg:col-span-8 relative aspect-[4/3] sm:aspect-[16/10] bg-white rounded-3xl border-3 border-dark shadow-[8px_8px_0px_#171717] overflow-hidden p-6">
            
            {/* Artistic stylized background map grid */}
            <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#171717_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-dashed border-t-2 border-dark/20 pointer-events-none" />
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-dashed border-l-2 border-dark/20 pointer-events-none" />

            <div className="absolute top-4 left-4 sticker bg-dark text-lime text-[11px]">
              KOLKATA SPATIAL ROSTER // ACTIVE
            </div>

            {/* Clickable Hotspot Pins */}
            {hotspots.map((spot) => (
              <button
                key={spot.id}
                onClick={() => setActiveSpot(spot)}
                style={{ top: spot.y, left: spot.x }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full border-2 border-dark cursor-pointer transition-all duration-300 ${
                  activeSpot.id === spot.id
                    ? "bg-coral text-white scale-125 z-20 shadow-[3px_3px_0px_#171717]"
                    : "bg-lime text-dark hover:scale-110 z-10"
                }`}
              >
                <MapPin size={20} className={activeSpot.id === spot.id ? "animate-bounce" : ""} />
              </button>
            ))}

            {/* River label decoration */}
            <div className="absolute bottom-6 left-6 font-mono text-[10px] font-bold text-dark/40 tracking-widest uppercase">
              ~ HOOGHLY RIVERFLOW CORRIDOR ~
            </div>
          </div>

          {/* Right: Selected Location Detail Card */}
          <div className="lg:col-span-4 bg-white rounded-3xl border-3 border-dark p-6 sm:p-8 shadow-[8px_8px_0px_#FF5C5C] space-y-5">
            <div className="flex items-center justify-between">
              <span className="sticker bg-cobalt text-white">{activeSpot.type}</span>
              <span className="text-xs font-mono font-bold text-coral flex items-center gap-1">
                <Sparkles size={13} />
                MATCH FOUND
              </span>
            </div>

            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-dark leading-tight">
              {activeSpot.name}
            </h3>

            <p className="text-sm font-medium text-dark/75 leading-relaxed">
              {activeSpot.experience}
            </p>

            <div className="p-4 rounded-2xl bg-cream border-2 border-dark">
              <p className="text-[10px] font-mono font-bold text-dark/60 uppercase">
                SUGGESTED COMPANION TO GO WITH:
              </p>
              <p className="font-display font-bold text-lg text-dark mt-1">
                {activeSpot.match}
              </p>
            </div>

            <a
              href="#discover"
              className="w-full py-3.5 rounded-full bg-dark text-lime font-display font-bold text-xs uppercase tracking-wider text-center block shadow-[3px_3px_0px_#171717] hover:bg-coral hover:text-white transition-colors"
            >
              PLAN THIS OUTING →
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
