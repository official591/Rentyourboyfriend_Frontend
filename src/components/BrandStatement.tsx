"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownRight } from "lucide-react";

const options = [
  { id: "coffee", label: "☕ COFFEE", color: "bg-coral text-cream border-dark", hint: "Good beans, real talks" },
  { id: "photo", label: "📸 PHOTO WALK", color: "bg-lime text-dark border-dark", hint: "Shoot 35mm film on secret streets" },
  { id: "food", label: "🍜 FOOD", color: "bg-tangerine text-dark border-dark", hint: "Late night momos & kathi rolls" },
  { id: "concert", label: "🎵 CONCERT", color: "bg-hotpink text-white border-dark", hint: "Indie gigs & music venues" },
  { id: "art", label: "🎨 ART", color: "bg-lavender text-dark border-dark", hint: "Gallery hopping & creative spaces" },
  { id: "walk", label: "🌆 CITY WALK", color: "bg-lime text-dark border-dark", hint: "Heritage architecture after sunset" },
  { id: "gaming", label: "🎮 GAMING", color: "bg-plum text-lime border-dark", hint: "Arcades, switch co-op & board games" },
  { id: "random", label: "✨ SOMETHING RANDOM", color: "bg-cream text-dark border-dark", hint: "Zero itinerary, good memories" },
];

export default function BrandStatement() {
  const [selectedVibe, setSelectedVibe] = useState("coffee");

  return (
    <section className="relative bg-cobalt text-white py-24 sm:py-32 border-b-4 border-dark overflow-hidden">
      {/* Background Graphic shapes */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-lime/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-coral/30 rounded-full blur-2xl pointer-events-none" />

      <div className="px-6 md:px-10 lg:px-16 max-w-7xl mx-auto relative z-10">

        {/* Playful Stickers */}
        <div className="flex items-center gap-3 mb-8">
          <span className="sticker bg-lime text-dark rotate-[-2deg]">
            SECTION // 02
          </span>
          <span className="sticker bg-coral text-white rotate-[3deg]">
            THE SOCIAL TRUTH
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">

          {/* Big Bold Headline */}
          <div className="lg:col-span-8">
            <h2 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold uppercase leading-[0.88] tracking-tighter text-cream">
              YOUR <br />
              <span className="text-lime">PEOPLE</span> <br />
              ARE OUT <br />
              <span className="text-coral underline decoration-wavy decoration-lime">THERE.</span>
            </h2>
          </div>

          {/* Side Narrative & Playful Arrow */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-3xl border-2 border-white/20 shadow-[6px_6px_0px_#171717]">
              <p className="font-editorial text-2xl sm:text-3xl text-cream leading-snug">
                “Maybe they’re into the exact same music. Maybe they know the hidden rooftop cafe. Or maybe you just have something real to talk about.”
              </p>
              <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between text-xs font-mono font-bold text-lime">
                <span>0% AWKWARDNESS</span>
                <span>100% REAL</span>
              </div>
            </div>

            {/* Playful animated pointer to next section */}
            <div className="flex items-center gap-4 text-cream">
              <span className="font-display font-extrabold text-sm uppercase tracking-wider">
                PEEP THE ROSTER BELOW
              </span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="p-3 rounded-full bg-lime text-dark border-2 border-dark"
              >
                <ArrowDownRight size={20} />
              </motion.div>
            </div>
          </div>

        </div>

        {/* ── Interactive Discovery Widget: "WHAT ARE YOU UP FOR?" ── */}
        <div className="mt-20 pt-12 border-t-2 border-white/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <span className="sticker bg-hotpink text-white mb-2 rotate-[-1deg]">GEN Z DISCOVERY</span>
              <h3 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-cream">
                WHAT ARE YOU UP FOR?
              </h3>
            </div>
            <p className="text-xs font-mono text-lime uppercase tracking-widest font-bold">
              TAP AN ACTIVITY TO FIND YOUR COMPANION →
            </p>
          </div>

          {/* Vibe Selection Pills */}
          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            {options.map((option) => {
              const isSelected = selectedVibe === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => setSelectedVibe(option.id)}
                  className={`px-5 py-3 rounded-full text-xs sm:text-sm font-display font-black uppercase tracking-wider border-2 border-dark transition-all cursor-pointer ${
                    isSelected
                      ? `${option.color} scale-105 shadow-[4px_4px_0px_#171717]`
                      : "bg-[#FFF4DF] !text-[#171717] hover:bg-white shadow-[2px_2px_0px_#171717]"
                  }`}
                >
                  <span className={isSelected ? "" : "text-[#171717]"}>
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active selection feedback strip */}
          <div className="mt-5 p-4 rounded-2xl bg-dark/70 backdrop-blur-md border-2 border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[4px_4px_0px_#171717]">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-lime animate-pulse border border-dark" />
              <span className="font-display font-bold text-sm text-cream">
                SELECTED: <span className="text-lime uppercase font-extrabold">{options.find(o => o.id === selectedVibe)?.label}</span>
              </span>
              <span className="hidden md:inline text-xs font-mono text-cream/70">
                — {options.find(o => o.id === selectedVibe)?.hint}
              </span>
            </div>
            <a
              href="#discover"
              className="text-xs font-display font-extrabold text-lime hover:text-coral uppercase underline tracking-wider"
            >
              See Available Companions →
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
