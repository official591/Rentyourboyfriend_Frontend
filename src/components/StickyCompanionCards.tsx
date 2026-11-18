"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CheckCircle2, ArrowUpRight, Sparkles, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompanionCardData {
  id: string | number;
  name: string;
  age: number;
  city: string;
  image: string;
  tags: string[];
  color: string;
  badge: string;
  bio: string;
  rate: string;
  vibeTag: string;
}

const companionsData: CompanionCardData[] = [
  {
    id: "maya",
    name: "Maya",
    age: 24,
    city: "Park Street & South Kolkata",
    image: "/images/portrait-maya.jpg",
    tags: ["PHOTO", "ARCHITECTURE", "COFFEE"],
    color: "bg-coral",
    badge: "35MM FILM ONLY",
    bio: "Obsessed with colonial heritage facades, brutalist corners, and flat white pitstops. Knows every quiet terrace in South Calcutta.",
    rate: "₹450 / hr",
    vibeTag: "ART & ARCHITECTURE",
  },
  {
    id: "arjun",
    name: "Arjun",
    age: 28,
    city: "Salt Lake & New Town",
    image: "/images/portrait-arjun.jpg",
    tags: ["INDIE GIGS", "CINEMA", "VINYL"],
    color: "bg-lime",
    badge: "CAFE HOPPER",
    bio: "Record collector and acoustic gig regular. Can debate Wong Kar-wai cinematography or take you to underground live sets.",
    rate: "₹500 / hr",
    vibeTag: "MUSIC & FILM",
  },
  {
    id: "priya",
    name: "Priya",
    age: 26,
    city: "Ballygunge & Dover Park",
    image: "/images/portrait-priya.jpg",
    tags: ["CONTEMPORARY ART", "WRITING", "GALLERIES"],
    color: "bg-lavender",
    badge: "CURATOR",
    bio: "Independent art curator. Turns awkward museum silence into fascinating gossip about Bengal Renaissance avant-garde.",
    rate: "₹550 / hr",
    vibeTag: "GALLERY RUNS",
  },
  {
    id: "rohan",
    name: "Rohan",
    age: 31,
    city: "North Kolkata & Ghats",
    image: "/images/portrait-rohan.jpg",
    tags: ["HERITAGE WALKS", "STREET FOOD", "HISTORY"],
    color: "bg-tangerine",
    badge: "CITY EXPLORER",
    bio: "Born storyteller who knows the secret lanes behind Kumartuli, boatmen at Bagbazar ghat, and legendary 1920s sweet shops.",
    rate: "₹400 / hr",
    vibeTag: "HERITAGE & FOOD",
  },
  {
    id: "ananya",
    name: "Ananya",
    age: 22,
    city: "Southern Avenue & Lakes",
    image: "/images/portrait-ananya.jpg",
    tags: ["POP CULTURE", "CONVERSATIONS", "MATCHA"],
    color: "bg-hotpink",
    badge: "NIGHT OWL",
    bio: "Gen Z cultural critic, podcast addict, and midnight walk enthusiast. Perfect company when you just need deep no-filter talk.",
    rate: "₹450 / hr",
    vibeTag: "DEEP CONVERSATIONS",
  },
];

export default function StickyCompanionCards() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const cardElements = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    const totalCards = cardElements.length;
    if (totalCards === 0 || !containerRef.current) return;

    // First card starts normal in position
    gsap.set(cardElements[0], { y: "0%", scale: 1, rotation: 0, opacity: 1 });

    // Subsequent cards wait below at y: "100%"
    for (let i = 1; i < totalCards; i++) {
      gsap.set(cardElements[i], { y: "100%", scale: 1, rotation: 0, opacity: 1 });
    }

    // Scroll timeline with pinned container and scrub physics matching reference
    const scrollTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current.querySelector(".sticky-cards-track"),
        start: "top top",
        end: `+=${window.innerHeight * (totalCards - 1) * 1.1}`,
        pin: true,
        scrub: 0.6,
        pinSpacing: true,
        anticipatePin: 1,
      },
    });

    for (let i = 0; i < totalCards - 1; i++) {
      const currentCard = cardElements[i];
      const nextCard = cardElements[i + 1];
      const position = i;

      // Current card scales down and rotates slightly back
      scrollTimeline.to(
        currentCard,
        {
          scale: 0.88,
          rotation: (i % 2 === 0 ? 4 : -4),
          filter: "brightness(0.7)",
          ease: "none",
          duration: 1,
        },
        position,
      );

      // Next portrait card rises smoothly up from below to cover/stack
      scrollTimeline.to(
        nextCard,
        {
          y: "0%",
          duration: 1,
          ease: "none",
        },
        position,
      );
    }

    const resizeObserver = new ResizeObserver(() => {
      ScrollTrigger.refresh();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      scrollTimeline.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      id="discover-roster"
      ref={containerRef}
      className="relative w-full bg-cream border-b-4 border-dark overflow-hidden"
    >
      {/* Editorial Section Top Header */}
      <div className="pt-20 pb-8 px-6 md:px-10 lg:px-16 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-3 border-dark pb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="sticker bg-hotpink text-white">FEATURED // ROSTER</span>
              <span className="sticker bg-lime text-dark">SCROLL TO FLIP</span>
            </div>
            <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-tight text-dark">
              MEET YOUR <span className="text-cobalt underline decoration-coral">CREW.</span>
            </h2>
          </div>
          <div className="max-w-sm">
            <p className="text-sm font-mono font-bold text-dark/80">
              [ 05 VERIFIED PROFILES ] · SCROLL DOWN TO FLIP THROUGH CALCUTTA&apos;S BEST COMPANIONS IN REAL-TIME.
            </p>
          </div>
        </div>
      </div>

      {/* Pinned Sticky Stage */}
      <div className="sticky-cards-track relative flex h-screen w-full items-center justify-center overflow-hidden px-4 py-6 md:p-10">
        
        {/* Background graphic accents */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-between px-6 lg:px-16 opacity-30 select-none">
          <div className="font-display font-black text-8xl md:text-9xl tracking-tighter text-dark/10 rotate-[-90deg]">
            MEET
          </div>
          <div className="font-display font-black text-8xl md:text-9xl tracking-tighter text-dark/10 rotate-90">
            CHILL
          </div>
        </div>

        {/* Card Stack Container (Polaroid/Gen Z Companion styling) */}
        <div className="relative h-[82vh] max-h-[680px] w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl overflow-hidden rounded-3xl shadow-[12px_12px_0px_#171717] border-4 border-dark bg-white">
          {companionsData.map((card, i) => (
            <div
              key={card.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              style={{ zIndex: i + 1 }}
              className="absolute inset-0 h-full w-full bg-white flex flex-col justify-between p-4 sm:p-6 select-none origin-bottom"
            >
              {/* Top Card Bar */}
              <div className="flex items-center justify-between pb-3 border-b-2 border-dark/20">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-coral border border-dark"></span>
                  <span className="w-3 h-3 rounded-full bg-lime border border-dark"></span>
                  <span className="text-xs font-mono font-extrabold uppercase text-dark tracking-wider">
                    COMPANION ID #{String(i + 1).padStart(2, "0")} / {String(companionsData.length).padStart(2, "0")}
                  </span>
                </div>
                <div className="sticker bg-lime text-dark text-[10px] sm:text-xs">
                  {card.badge}
                </div>
              </div>

              {/* Main Media & Portrait Display with Polaroid framing */}
              <div className="relative flex-1 w-full my-3 rounded-2xl overflow-hidden border-3 border-dark bg-dark">
                <Image
                  src={card.image}
                  alt={card.name}
                  fill
                  priority={i === 0}
                  className="object-cover"
                />

                {/* Verified Shield Badge Overlay */}
                <div className="absolute top-4 left-4 bg-dark/90 backdrop-blur-md text-lime px-3 py-1.5 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 border border-white/20 shadow-[3px_3px_0px_#171717]">
                  <CheckCircle2 size={14} className="text-lime" />
                  <span>GOVT ID VERIFIED</span>
                </div>

                {/* Floating Rate Sticker */}
                <div className="absolute top-4 right-4 bg-white text-dark px-3 py-1.5 rounded-full text-xs font-mono font-extrabold border-2 border-dark shadow-[3px_3px_0px_#171717]">
                  {card.rate}
                </div>

                {/* Vibe Tag Pill */}
                <div className="absolute bottom-4 left-4 bg-cobalt text-white px-3 py-1 rounded-md text-[11px] font-mono font-black border-2 border-white shadow-[2px_2px_0px_#171717]">
                  ★ {card.vibeTag}
                </div>
              </div>

              {/* Bottom Details Footer */}
              <div className="space-y-3 pt-1">
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-display font-black text-3xl sm:text-4xl text-dark">
                      {card.name}
                    </h3>
                    <span className="font-editorial text-2xl text-dark/70">
                      {card.age}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-mono font-bold text-dark/70">
                    <MapPin size={13} className="text-coral" />
                    <span>{card.city}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-dark/80 line-clamp-2 font-medium">
                  {card.bio}
                </p>

                {/* Tag Pills & Book Action Bar */}
                <div className="flex items-center justify-between pt-1 gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {card.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-md bg-cream text-dark border border-dark"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <a
                    href="#profile"
                    className="flex-shrink-0 px-4 py-2 rounded-full bg-dark text-white hover:bg-coral transition-colors font-display font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-[2px_2px_0px_#171717]"
                  >
                    <span>HANG OUT</span>
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll Progress Indicator Hint */}
        <div className="absolute bottom-6 right-6 hidden md:flex items-center gap-2 bg-white/90 backdrop-blur-sm border-2 border-dark px-3 py-1.5 rounded-full shadow-[3px_3px_0px_#171717]">
          <Sparkles size={14} className="text-coral animate-pulse" />
          <span className="text-[11px] font-mono font-bold text-dark">
            CONTINUE SCROLLING TO UNPIN
          </span>
        </div>
      </div>
    </section>
  );
}
