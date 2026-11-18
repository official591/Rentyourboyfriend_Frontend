"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function FinalCta() {
  return (
    <section className="bg-coral text-dark py-28 sm:py-36 md:py-44 relative overflow-hidden">
      
      {/* Decorative large graphic circles */}
      <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-lime/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-80 h-80 rounded-full bg-cream/40 blur-2xl pointer-events-none" />

      {/* Smooth bottom transition into Plum (Footer) */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-plum/40 to-plum pointer-events-none z-10" />

      <div className="px-6 md:px-10 lg:px-16 max-w-7xl mx-auto relative z-10 text-center flex flex-col items-center">
        
        {/* Top sticker badge */}
        <div className="flex items-center gap-3 mb-8">
          <span className="sticker bg-lime text-dark rotate-[-3deg]">
            READY TO ROLL?
          </span>
          <span className="sticker bg-white text-dark rotate-[2deg]">
            KOLKATA & EXPANDING
          </span>
        </div>

        {/* Huge bold headline */}
        <h2 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase text-dark leading-[0.88] tracking-tighter">
          SO... <br />
          <span className="text-white drop-shadow-[4px_4px_0px_#171717]">WHO’S</span> <br />
          <span className="text-lime underline decoration-dark">COMING?</span>
        </h2>

        <p className="mt-8 text-lg sm:text-xl font-medium text-dark/90 max-w-lg leading-snug">
          Life is too short to skip that gig, sit at cafes alone, or wonder what that hidden museum was like. Find your people today.
        </p>

        {/* Interactive CTA buttons */}
        <div className="mt-12 flex flex-col sm:flex-row items-center gap-5">
          <motion.a
            href="/auth"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-5 rounded-full bg-dark text-lime font-display font-extrabold text-sm uppercase tracking-wider border-3 border-dark flex items-center gap-2 shadow-[6px_6px_0px_#FFFFFF] hover:bg-lime hover:text-dark transition-all cursor-pointer"
          >
            <span>FIND A COMPANION</span>
            <ArrowRight size={18} />
          </motion.a>

          <motion.a
            href="/auth"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-5 rounded-full bg-white text-dark font-display font-extrabold text-sm uppercase tracking-wider border-3 border-dark flex items-center gap-2 shadow-[6px_6px_0px_#171717] hover:bg-cream transition-all cursor-pointer"
          >
            <Sparkles size={16} className="text-coral" />
            <span>BECOME A COMPANION</span>
          </motion.a>
        </div>

        {/* Footer Guarantee stamp */}
        <div className="mt-14 inline-flex items-center gap-2 font-mono text-xs font-bold text-dark/75 bg-cream/70 px-4 py-2 rounded-full border border-dark">
          <span>✦ 100% ID VERIFIED</span>
          <span>·</span>
          <span>STRICTLY PLATONIC</span>
          <span>·</span>
          <span>18+ ADULTS ONLY</span>
        </div>

      </div>
    </section>
  );
}
