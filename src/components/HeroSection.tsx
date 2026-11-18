"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Sparkles, ArrowRight, Compass } from "lucide-react";
import CrowdCanvas from "@/components/CrowdCanvas";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-cream text-dark pt-28 md:pt-36 pb-20 overflow-hidden">
      {/* Interactive Crowd Canvas (Skiper 39 - OpenPeeps Animated Walking Crowd) */}
      <div className="absolute inset-0 pointer-events-none opacity-40 z-0">
        <CrowdCanvas
          src="/images/peeps/all-peeps.png"
          rows={15}
          cols={7}
          className="h-[70vh] sm:h-[80vh] md:h-[85vh]"
        />
      </div>

      {/* Background graphic elements */}
      <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-lime/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-coral/20 blur-3xl pointer-events-none" />

      {/* Marquee ticker top */}
      <div className="overflow-hidden whitespace-nowrap border-y-2 border-dark bg-lime py-2 mb-12">
        <div className="animate-marquee font-display font-extrabold text-xs md:text-sm tracking-widest text-dark uppercase flex gap-8">
          <span>✦ PLATONIC COMPANIONSHIP ONLY</span>
          <span>✦ 100% ID VERIFIED HUMANS</span>
          <span>✦ NO AWKWARD SMALL TALK</span>
          <span>✦ REAL CITY PLANS</span>
          <span>✦ KOLKATA → EVERYWHERE</span>
          <span>✦ NEVER GO TO CONCERTS ALONE</span>
          <span>✦ PLATONIC COMPANIONSHIP ONLY</span>
          <span>✦ 100% ID VERIFIED HUMANS</span>
          <span>✦ NO AWKWARD SMALL TALK</span>
          <span>✦ REAL CITY PLANS</span>
          <span>✦ KOLKATA → EVERYWHERE</span>
        </div>
      </div>

      <div className="px-6 md:px-10 lg:px-16 max-w-7xl mx-auto relative z-10">

        {/* Top Badges & Stickers */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="sticker bg-coral text-white rotate-[-2deg]">
            18+ VERIFIED ONLY
          </span>
          <span className="sticker bg-lavender text-dark rotate-[3deg]">
            MADE FOR REAL LIFE
          </span>
          <span className="sticker bg-lime text-dark rotate-[-1deg] hidden sm:inline-block">
            KOLKATA // CULTURE
          </span>
        </div>

        {/* ── Main Composition Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* Left: Giant Typography Graphic */}
          <div className="lg:col-span-7">
            <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-[7.5rem] font-extrabold uppercase leading-[0.88] tracking-tight">
              <span className="block text-dark">FIND</span>
              <span className="block text-cobalt relative inline-block">
                YOUR
                <span className="absolute -top-3 -right-6 rotate-12 text-xs bg-lime text-dark px-2.5 py-1 rounded-full border border-dark font-mono font-bold">
                  GEN Z VIBE
                </span>
              </span>
              <span className="block text-coral font-editorial lowercase italic tracking-normal font-normal">
                people.
              </span>
            </h1>

            <p className="mt-8 text-base sm:text-lg md:text-xl font-medium max-w-xl text-dark/80 leading-snug">
              “Good conversations. Random plans. Better stories. Discover verified companions to share coffee, photo walks, gigs, and city spots.”
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <motion.a
                href="#discover"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="px-8 py-4 rounded-full bg-dark text-lime font-display font-extrabold text-sm uppercase tracking-wider border-2 border-dark flex items-center gap-2 shadow-[4px_4px_0px_#FF5C5C] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
              >
                <span>FIND A COMPANION</span>
                <ArrowRight size={18} />
              </motion.a>

              <motion.a
                href="#city"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="px-8 py-4 rounded-full bg-white text-dark font-display font-extrabold text-sm uppercase tracking-wider border-2 border-dark flex items-center gap-2 shadow-[4px_4px_0px_#171717] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
              >
                <Compass size={18} className="text-cobalt" />
                <span>EXPLORE THE CITY</span>
              </motion.a>
            </div>
          </div>

          {/* Right: Asymmetric Playful Photo Collage */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            <div className="relative w-full aspect-[4/5] max-w-md mx-auto">

              {/* Main Photo Card (Polaroid Style) */}
              <div className="relative z-10 w-full h-full bg-white p-3 pb-12 rounded-3xl border-3 border-dark shadow-[8px_8px_0px_#3155FF] rotate-[2deg] hover:rotate-0 transition-transform duration-500 overflow-hidden">
                <div
                  suppressHydrationWarning
                  className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-dark"
                >
                  <Image
                    src="/images/hero.png"
                    alt="Young companions laughing and hanging out in the city"
                    fill
                    className="object-cover"
                    priority
                    data-pin-nopin="true"
                    suppressHydrationWarning
                  />
                  <div className="absolute top-3 left-3 bg-dark text-lime text-[10px] font-mono font-bold px-2 py-1 rounded border border-dark">
                    LIVE NOW · 17:42
                  </div>
                </div>
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-mono font-bold text-dark">
                  <span>CITY STREET HANGOUTS</span>
                  <span className="text-coral">✦ MATCHED</span>
                </div>
              </div>

              {/* Floating circular companion sticker */}
              <div
                suppressHydrationWarning
                className="absolute -top-6 -left-6 z-20 w-28 h-28 rounded-full border-3 border-dark overflow-hidden shadow-[4px_4px_0px_#171717] rotate-[-8deg] bg-hotpink pointer-events-none select-none"
              >
                <Image
                  src="/images/portrait-maya.jpg"
                  alt="Maya portrait"
                  fill
                  className="object-cover pointer-events-none"
                  data-pin-nopin="true"
                  data-no-hover="true"
                  suppressHydrationWarning
                />
              </div>

              {/* Floating tag badge */}
              <div
                suppressHydrationWarning
                className="absolute -bottom-4 -left-4 z-20 sticker bg-lime text-dark rotate-[-4deg] flex items-center gap-1.5 shadow-[4px_4px_0px_#171717] pointer-events-none select-none"
              >
                <Sparkles size={14} className="text-coral" />
                <span>NO DATING APP WEIRDNESS</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
