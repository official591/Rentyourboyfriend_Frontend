"use client";

import { useState } from "react";
import Image from "next/image";
import { Sparkles, ArrowRight } from "lucide-react";

const vibes = [
  {
    id: "lowkey",
    title: "LOWKEY",
    color: "bg-cream text-dark",
    badge: "CAFE & BOOKS",
    tagline: "Quiet hours, artisanal brews, and deep zero-pressure talks.",
    image: "/images/experience-coffee.jpg",
    spot: "Sienna Cafe & Heritage bookstores",
    companion: "Maya (24)",
  },
  {
    id: "social",
    title: "SOCIAL",
    color: "bg-coral text-white",
    badge: "PEOPLE & VIBES",
    tagline: "Live conversations, weekend pop-ups, and spontaneous laughter.",
    image: "/images/hero-cafe.jpg",
    spot: "Southern Avenue flea markets & bakeries",
    companion: "Ananya (22)",
  },
  {
    id: "creative",
    title: "CREATIVE",
    color: "bg-lavender text-dark",
    badge: "ART & 35MM",
    tagline: "Street photography, visual galleries, and indie print shops.",
    image: "/images/experience-gallery.jpg",
    spot: "Kolkata Centre for Creativity & secret lanes",
    companion: "Priya (26)",
  },
  {
    id: "adventurous",
    title: "ADVENTUROUS",
    color: "bg-lime text-dark",
    badge: "CITY ROAMING",
    tagline: "Walking through ghats, old alleys, and catching evening ferries.",
    image: "/images/experience-walk.jpg",
    spot: "Princep Ghat riverside walks at sunset",
    companion: "Rohan (31)",
  },
  {
    id: "foodie",
    title: "FOODIE",
    color: "bg-tangerine text-dark",
    badge: "LATE NIGHT EATS",
    tagline: "Hunting down the crispiest rolls, puchkas, and midnight chai.",
    image: "/images/journal-feature.jpg",
    spot: "Park Street & Dacres Lane street legends",
    companion: "Arjun (28)",
  },
  {
    id: "nightowl",
    title: "NIGHT OWL",
    color: "bg-plum text-lime",
    badge: "AFTER 8PM",
    tagline: "Underground indie gigs, rooftop acoustics, and late city drives.",
    image: "/images/kolkata-city.jpg",
    spot: "Someplace Else & live music basements",
    companion: "Vikram (27)",
  },
];

export default function ExperiencesSection() {
  const [activeVibeId, setActiveVibeId] = useState("creative");
  const activeVibe = vibes.find((v) => v.id === activeVibeId) || vibes[0];

  return (
    <section id="vibe" className="bg-dark text-white py-24 sm:py-32 border-b-4 border-dark relative overflow-hidden">

      {/* Background glow based on active vibe */}
      <div className="absolute top-1/2 -right-20 w-[500px] h-[500px] rounded-full bg-coral/15 blur-[140px] pointer-events-none" />

      <div className="px-6 md:px-10 lg:px-16 max-w-7xl mx-auto relative z-10">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="sticker bg-lime text-dark">SECTION // 04</span>
              <span className="sticker bg-hotpink text-white">PERSONALITY SELECTOR</span>
            </div>
            <h2 className="font-display text-5xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-tight text-cream">
              WHAT’S THE <span className="text-lime underline decoration-coral">VIBE?</span>
            </h2>
          </div>
          <p className="text-sm font-mono text-cream/70 max-w-xs font-bold">
            PICK A MOOD TO MATCH WITH COMPANIONS WHO MATCH YOUR FREQUENCY.
          </p>
        </div>

        {/* Vibe Category Selector Buttons */}
        <div className="flex flex-wrap gap-3 mb-12">
          {vibes.map((v) => (
            <button
              key={v.id}
              onClick={() => setActiveVibeId(v.id)}
              className={`px-6 py-3.5 rounded-full font-display font-extrabold text-sm uppercase tracking-wider border-2 transition-all cursor-pointer ${activeVibeId === v.id
                  ? `${v.color} scale-105 border-white shadow-[4px_4px_0px_#FFFFFF]`
                  : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                }`}
            >
              {v.title}
            </button>
          ))}
        </div>

        {/* Dynamic Vibe Showcase Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white/5 border-3 border-white/20 rounded-3xl p-6 sm:p-10 backdrop-blur-md shadow-[8px_8px_0px_#171717]">

          {/* Left: Vibe Info & Action */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-3">
              <span className="sticker bg-lime text-dark">{activeVibe.badge}</span>
              <span className="font-mono text-xs text-cream/60">MOOD VERIFIED</span>
            </div>

            <h3 className="font-display text-4xl sm:text-5xl font-extrabold uppercase text-cream leading-tight">
              {activeVibe.title} MODE
            </h3>

            <p className="font-editorial text-2xl sm:text-3xl text-cream/90 italic leading-snug">
              “{activeVibe.tagline}”
            </p>

            <div className="p-4 rounded-2xl bg-white/10 border border-white/20 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-lime font-bold">FAVORITE LOCAL SPOTS:</span>
                <span className="text-white">{activeVibe.spot}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-coral font-bold">SUGGESTED COMPANION:</span>
                <span className="text-white font-bold">{activeVibe.companion}</span>
              </div>
            </div>

            <a
              href="#discover"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-lime text-dark font-display font-extrabold text-sm uppercase tracking-wider shadow-[4px_4px_0px_#FF5C5C] hover:bg-coral hover:text-white transition-all"
            >
              <span>FIND {activeVibe.title} COMPANIONS</span>
              <ArrowRight size={18} />
            </a>
          </div>

          {/* Right: Dynamic High-Res Photo Frame */}
          <div className="lg:col-span-6 relative aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden border-2 border-white/30 shadow-2xl">
            <Image
              src={activeVibe.image}
              alt={activeVibe.title}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute top-4 right-4 sticker bg-dark text-lime">
              ✦ ACTIVE VIBE PREVIEW
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
