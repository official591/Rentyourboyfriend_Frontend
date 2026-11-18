"use client";

import { motion } from "framer-motion";
import { Search, Sparkles, Calendar, Rocket } from "lucide-react";

const steps = [
  {
    num: "01",
    title: "FIND",
    color: "bg-coral text-white",
    desc: "Browse verified profiles by city, shared interests, favorite cafes, or photo spots.",
    tag: "VERIFIED HUMANS",
    icon: Search,
  },
  {
    num: "02",
    title: "VIBE",
    color: "bg-lime text-dark",
    desc: "Chat securely in-app with zero dating pressure. Align on mutual plans and timings.",
    tag: "NO SMALL TALK",
    icon: Sparkles,
  },
  {
    num: "03",
    title: "PLAN",
    color: "bg-lavender text-dark",
    desc: "Pick a public spot—a gallery opening, an afternoon pour-over, or an evening gig.",
    tag: "SAFE & PUBLIC",
    icon: Calendar,
  },
  {
    num: "04",
    title: "GO",
    color: "bg-tangerine text-dark",
    desc: "Meet up, share real conversation, split the bill, and leave with authentic stories.",
    tag: "BETTER MEMORIES",
    icon: Rocket,
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-cream py-24 sm:py-32 relative overflow-hidden">
      {/* Smooth bottom transition */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-b from-transparent to-cream pointer-events-none z-10" />
      <div className="px-6 md:px-10 lg:px-16 max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="sticker bg-cobalt text-white mb-3">SECTION // 06</span>
          <h2 className="font-display text-5xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-tight text-dark">
            HOW IT <span className="text-coral underline decoration-lime">WORKS.</span>
          </h2>
          <p className="mt-4 text-base font-medium text-dark/75">
            Four simple steps from digital discovery to unforgettable real-life moments.
          </p>
        </div>

        {/* 4 Steps Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const IconComponent = step.icon;
            return (
              <motion.div
                key={step.num}
                whileHover={{ y: -6 }}
                className="bg-white rounded-3xl border-3 border-dark p-6 sm:p-8 flex flex-col justify-between shadow-[6px_6px_0px_#171717] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className={`w-14 h-14 rounded-2xl ${step.color} border-2 border-dark flex items-center justify-center font-display font-black text-2xl shadow-[3px_3px_0px_#171717]`}>
                      {step.num}
                    </span>
                    <IconComponent size={24} className="text-dark/70" />
                  </div>

                  <span className="sticker bg-cream text-dark text-[10px] mb-2">
                    {step.tag}
                  </span>

                  <h3 className="font-display font-black text-3xl sm:text-4xl text-dark mt-2">
                    {step.title}
                  </h3>

                  <p className="text-sm font-medium text-dark/70 mt-3 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-dark/10 flex items-center justify-between text-xs font-mono font-bold text-dark/40">
                  <span>STEP // {step.num}</span>
                  <span>DONE ✦</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
