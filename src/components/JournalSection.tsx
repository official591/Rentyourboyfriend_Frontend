"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const articles = [
  {
    id: "01",
    tag: "CITY SPOTS",
    color: "bg-coral text-white",
    title: "7 places in Kolkata to disappear into for an afternoon",
    desc: "Quiet courtyard cafes, ancient library desks, and shaded botanical corners meant for long conversations.",
    image: "/images/journal-feature.jpg",
    readTime: "4 MIN READ",
  },
  {
    id: "02",
    tag: "NIGHTLIFE",
    color: "bg-lime text-dark",
    title: "Where Kolkata actually goes after 8PM",
    desc: "Forget commercial nightclubs. The real crowd is at underground vinyl sessions and rooftop chai spots.",
    image: "/images/kolkata-city.jpg",
    readTime: "6 MIN READ",
  },
  {
    id: "03",
    tag: "SOLO & SOCIAL",
    color: "bg-lavender text-dark",
    title: "Things to do when you don't want to go completely alone",
    desc: "How hiring a platonic companion for film festivals and photo walks changes your relationship with the city.",
    image: "/images/experience-walk.jpg",
    readTime: "5 MIN READ",
  },
];

export default function JournalSection() {
  return (
    <section id="journal" className="bg-cream py-24 sm:py-32 relative overflow-hidden">
      {/* Smooth bottom transition */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-cream pointer-events-none z-10" />
      <div className="px-6 md:px-10 lg:px-16 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="sticker bg-coral text-white">SECTION // 09</span>
              <span className="sticker bg-cobalt text-white">DIGITAL CULTURE MAGAZINE</span>
            </div>
            <h2 className="font-display text-5xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-tight text-dark leading-none">
              THE COMPANION <span className="text-hotpink underline decoration-lime">EDIT.</span>
            </h2>
          </div>
          <a
            href="#all-articles"
            className="text-xs font-display font-extrabold text-cobalt hover:text-coral uppercase underline tracking-wider"
          >
            READ ALL ISSUES →
          </a>
        </div>

        {/* 3 Articles Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((art) => (
            <article
              key={art.id}
              className="group bg-white rounded-3xl border-3 border-dark overflow-hidden shadow-[6px_6px_0px_#171717] hover:shadow-[10px_10px_0px_#171717] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative w-full aspect-[16/10] border-b-2 border-dark overflow-hidden">
                  <Image
                    src={art.image}
                    alt={art.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className={`absolute top-3 left-3 sticker ${art.color} text-[10px]`}>
                    {art.tag}
                  </div>
                </div>

                <div className="p-6">
                  <span className="text-[10px] font-mono font-bold text-dark/50">
                    ISSUE {art.id} · {art.readTime}
                  </span>
                  
                  <h3 className="font-display font-black text-2xl text-dark leading-tight mt-2 group-hover:text-coral transition-colors">
                    {art.title}
                  </h3>

                  <p className="text-sm font-medium text-dark/70 mt-3 leading-relaxed">
                    {art.desc}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <a
                  href="#read"
                  className="w-full py-2.5 rounded-full bg-dark text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 group-hover:bg-lime group-hover:text-dark transition-colors"
                >
                  <span>READ FEATURE</span>
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
