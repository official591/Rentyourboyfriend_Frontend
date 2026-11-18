"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, Lock, UserCheck, AlertTriangle } from "lucide-react";

const safeguards = [
  { 
    title: "GOVERNMENT ID VERIFIED", 
    desc: "Every single companion must pass mandatory government photo-ID authentication before appearing on the roster.", 
    icon: ShieldCheck, 
    color: "bg-coral text-white",
    sticker: "ID // 01"
  },
  { 
    title: "STRICT 18+ ADULTS ONLY", 
    desc: "Zero minors allowed. We strictly verify adult status across all members for safety and maturity.", 
    icon: UserCheck, 
    color: "bg-lime text-dark",
    sticker: "ADULTS ONLY"
  },
  { 
    title: "MANUALLY REVIEWED", 
    desc: "Our human curation team personally vets every profile bio, photos, and social intent before granting access.", 
    icon: CheckCircle2, 
    color: "bg-tangerine text-dark",
    sticker: "VIBE CHECKED"
  },
  { 
    title: "SECURE IN-APP CHAT", 
    desc: "Keep all communication safe inside the app. Never give out your personal phone number or social handles.", 
    icon: Lock, 
    color: "bg-lavender text-dark",
    sticker: "END-TO-END"
  },
  { 
    title: "INSTANT REPORT & BLOCK", 
    desc: "Zero tolerance for weirdness, pressure, or inappropriate behavior. 24/7 one-tap safety dispatch.", 
    icon: AlertTriangle, 
    color: "bg-hotpink text-white",
    sticker: "ZERO TOLERANCE"
  },
  { 
    title: "PUBLIC MEETS ALWAYS", 
    desc: "All meetups take place in bustling cafes, galleries, markets, and public cultural spots. Never private spaces.", 
    icon: CheckCircle2, 
    color: "bg-cobalt text-white",
    sticker: "PUBLIC SPACES"
  },
];

export default function TrustSection() {
  return (
    <section id="safety" className="bg-cream text-dark py-24 sm:py-32 relative overflow-hidden">
      
      {/* Background Graphic shapes */}
      <div className="absolute top-20 right-10 w-80 h-80 rounded-full bg-coral/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-lime/30 blur-3xl pointer-events-none" />

      {/* Smooth bottom transition */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-cream pointer-events-none z-10" />

      <div className="px-6 md:px-10 lg:px-16 max-w-7xl mx-auto relative z-10">
        
        {/* Header matching the rest of the page */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="sticker bg-coral text-white">SECTION // 07</span>
              <span className="sticker bg-lime text-dark">SAFETY PROTOCOL</span>
            </div>
            <h2 className="font-display text-5xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-tight text-dark leading-none">
              FUN SHOULD <br />
              <span className="text-cobalt underline decoration-lime">STILL FEEL SAFE.</span>
            </h2>
          </div>
          <p className="text-sm font-mono font-bold text-dark/75 max-w-xs">
            WE BUILT COMPANION WITH UNCOMPROMISING SAFETY SO YOU CAN EXPLORE WITH COMPLETE PEACE OF MIND.
          </p>
        </div>

        {/* Safeguards Grid matching the chunky border + drop shadow cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {safeguards.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.title}
                whileHover={{ y: -6 }}
                className="bg-white rounded-3xl border-3 border-dark p-6 sm:p-8 flex flex-col justify-between shadow-[6px_6px_0px_#171717] hover:shadow-[10px_10px_0px_#171717] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className={`w-12 h-12 rounded-2xl ${item.color} border-2 border-dark flex items-center justify-center font-bold shadow-[2px_2px_0px_#171717]`}>
                      <IconComponent size={22} />
                    </span>
                    <span className="sticker bg-cream text-dark text-[10px]">
                      {item.sticker}
                    </span>
                  </div>

                  <h3 className="font-display font-extrabold text-2xl text-dark leading-tight">
                    {item.title}
                  </h3>

                  <p className="text-sm font-medium text-dark/70 mt-3 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t-2 border-dark/10 flex items-center justify-between text-xs font-mono font-bold text-dark/50">
                  <span className="text-coral">0{index + 1} // RULE</span>
                  <span className="text-dark font-extrabold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-lime border border-dark" />
                    ENFORCED
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
