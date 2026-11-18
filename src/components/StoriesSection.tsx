"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { MessageSquareQuote, Star } from "lucide-react";

const stories = [
  {
    quote: "Found someone who was also completely obsessed with 35mm film photography and hidden bakeries. Best weekend ever.",
    author: "Rohan K.",
    age: "23",
    city: "Kolkata",
    image: "/images/portrait-rohan.jpg",
    vibe: "PHOTO WALK",
    color: "bg-coral text-white",
  },
  {
    quote: "Went to an underground indie art exhibition with someone I’d never met. Zero awkwardness, purely good conversations.",
    author: "Tanya M.",
    age: "24",
    city: "Kolkata",
    image: "/images/portrait-maya.jpg",
    vibe: "CONTEMPORARY ART",
    color: "bg-lime text-dark",
  },
  {
    quote: "Moved to Kolkata for work knowing nobody. In my first month, I had coffee with 4 brilliant creative people.",
    author: "Arjun S.",
    age: "27",
    city: "Kolkata",
    image: "/images/portrait-arjun.jpg",
    vibe: "COFFEE & BOOKSTORES",
    color: "bg-lavender text-dark",
  },
  {
    quote: "Finally had someone to explore the heritage ghats at dusk without having to turn it into a weird date.",
    author: "Priya D.",
    age: "25",
    city: "Kolkata",
    image: "/images/portrait-priya.jpg",
    vibe: "RIVERSIDE WALKS",
    color: "bg-tangerine text-dark",
  },
];

export default function StoriesSection() {
  return (
    <section className="bg-cream py-24 sm:py-32 relative overflow-hidden">
      {/* Smooth bottom transition */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-cream pointer-events-none z-10" />
      <div className="px-6 md:px-10 lg:px-16 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="sticker bg-hotpink text-white">SECTION // 08</span>
              <span className="sticker bg-lime text-dark">REAL EXPERIENCES</span>
            </div>
            <h2 className="font-display text-5xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-tight text-dark leading-none">
              REAL STORIES. <br />
              <span className="text-coral underline decoration-cobalt">ZERO REGRETS.</span>
            </h2>
          </div>
          <p className="text-sm font-mono font-bold text-dark/70 max-w-xs">
            WHAT PEOPLE SAY AFTER HANGING OUT WITH COMPANIONS IN REAL LIFE.
          </p>
        </div>

        {/* Stories Horizontal Drag / Grid Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stories.map((story, i) => (
            <motion.div
              key={story.author}
              whileHover={{ y: -8 }}
              className="bg-white rounded-3xl border-3 border-dark p-6 flex flex-col justify-between shadow-[6px_6px_0px_#171717]"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`sticker ${story.color} text-[10px]`}>
                    {story.vibe}
                  </span>
                  <div className="flex text-amber">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} size={13} fill="currentColor" />
                    ))}
                  </div>
                </div>

                <p className="font-editorial text-2xl text-dark leading-snug my-4">
                  “{story.quote}”
                </p>
              </div>

              <div className="pt-4 border-t border-dark/10 flex items-center gap-3 mt-4">
                <div className="relative w-12 h-12 rounded-full border-2 border-dark overflow-hidden shrink-0">
                  <Image src={story.image} alt={story.author} fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-display font-extrabold text-base text-dark leading-none">
                    {story.author}, {story.age}
                  </h4>
                  <span className="text-xs font-mono text-dark/60">{story.city}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
