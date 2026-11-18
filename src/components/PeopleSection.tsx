"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ArrowUpRight, IndianRupee, Loader2, Sparkles } from "lucide-react";
import { useRazorpay } from "@/hooks/useRazorpay";

const companions = [
  {
    name: "Maya",
    age: 24,
    city: "Kolkata",
    price: 650,
    image: "/images/portrait-maya.jpg",
    tags: ["PHOTO", "ARCHITECTURE", "COFFEE"],
    color: "bg-coral text-white",
    badge: "35MM FILM ONLY",
  },
  {
    name: "Arjun",
    age: 28,
    city: "Kolkata",
    price: 750,
    image: "/images/portrait-arjun.jpg",
    tags: ["INDIE GIGS", "CINEMA", "VINYL"],
    color: "bg-lime text-dark",
    badge: "CAFE HOPPER",
  },
  {
    name: "Priya",
    age: 26,
    city: "Kolkata",
    price: 550,
    image: "/images/portrait-priya.jpg",
    tags: ["CONTEMPORARY ART", "WRITING", "GALLERIES"],
    color: "bg-lavender text-dark",
    badge: "CURATOR",
  },
  {
    name: "Rohan",
    age: 31,
    city: "Kolkata",
    price: 500,
    image: "/images/portrait-rohan.jpg",
    tags: ["HERITAGE WALKS", "STREET FOOD", "HISTORY"],
    color: "bg-tangerine text-dark",
    badge: "CITY EXPLORER",
  },
  {
    name: "Ananya",
    age: 22,
    city: "Kolkata",
    price: 600,
    image: "/images/portrait-ananya.jpg",
    tags: ["POP CULTURE", "CONVERSATIONS", "MATCHA"],
    color: "bg-hotpink text-white",
    badge: "NIGHT OWL",
  },
];

export default function PeopleSection() {
  const [activePerson, setActivePerson] = useState<string | null>(null);
  const [bookingToast, setBookingToast] = useState<{
    status: "success" | "error";
    message: string;
  } | null>(null);

  const { pay, status, reset } = useRazorpay({
    name: "COMPANION HANGOUT",
    description: "Verified Social Outing Booking",
    themeColor: "#C7F35B",
    onSuccess: (data) => {
      setBookingToast({
        status: "success",
        message: `🎉 Outing booked! Payment ID: ${data.payment_id}`,
      });
      setActivePerson(null);
    },
    onError: (err) => {
      setBookingToast({
        status: "error",
        message: err || "Booking payment was cancelled or failed.",
      });
      setActivePerson(null);
    },
  });

  const handleBookHang = (person: (typeof companions)[0]) => {
    setActivePerson(person.name);
    reset();
    setBookingToast(null);

    const amountInPaise = person.price * 100;
    pay(amountInPaise, `hang_${person.name.toLowerCase()}_${Date.now()}`, {
      name: `COMPANION // ${person.name.toUpperCase()}`,
      description: `1-Hour Verified Outing with ${person.name} in ${person.city}`,
      themeColor: "#171717",
    });
  };

  return (
    <section id="discover" className="bg-cream py-16 sm:py-24 border-b-4 border-dark relative overflow-hidden">
      {/* Header */}
      <div className="px-6 md:px-10 lg:px-16 max-w-6xl mx-auto mb-10 sm:mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-2.5">
              <span className="sticker bg-hotpink text-white text-[10px]">SECTION // 03</span>
              <span className="sticker bg-lime text-dark text-[10px]">PEOPLE DIRECTORY</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-dark">
              PEOPLE WORTH <span className="text-cobalt underline decoration-coral">MEETING.</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-mono font-bold text-dark/70 max-w-xs leading-snug">
            100% ID-VERIFIED COMPANIONS WITH TRANSPARENT HOURLY PRICING. NO DATING WEIRDNESS.
          </p>
        </div>
      </div>

      {/* Collage Profile Cards - Compact Sizing & Transparent Pricing */}
      <div className="px-6 md:px-10 lg:px-16 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {companions.map((person) => (
            <motion.div
              key={person.name}
              whileHover={{ y: -6, scale: 1.015 }}
              transition={{ duration: 0.25 }}
              className="group relative bg-white p-3.5 rounded-[2rem] border-3 border-dark shadow-[5px_5px_0px_#171717] hover:shadow-[8px_8px_0px_#171717] transition-all flex flex-col justify-between"
            >
              {/* Compact Image Frame */}
              <div className="relative w-full aspect-[4/3.4] rounded-2xl overflow-hidden border-2 border-dark bg-cream">
                <Image
                  src={person.image}
                  alt={person.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Verified badge */}
                <div className="absolute top-2.5 left-2.5 bg-dark/90 backdrop-blur-sm text-lime px-2 py-0.5 rounded-full text-[11px] font-mono font-bold flex items-center gap-1 border border-white/20 shadow-sm">
                  <CheckCircle2 size={12} className="text-lime" />
                  <span>VERIFIED</span>
                </div>

                {/* Custom sticker tag */}
                <div className={`absolute bottom-2.5 right-2.5 sticker ${person.color} text-[10px] shadow-sm`}>
                  {person.badge}
                </div>

                {/* Pricing Badge on Image */}
                <div className="absolute bottom-2.5 left-2.5 bg-dark/95 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full text-xs font-display font-black flex items-center gap-0.5 border border-white/20 shadow-sm">
                  <span className="text-lime">₹{person.price}</span>
                  <span className="text-[10px] font-mono text-white/70">/hr</span>
                </div>
              </div>

              {/* Profile Details */}
              <div className="pt-3.5 pb-1">
                <div className="flex items-baseline justify-between">
                  <div>
                    <h3 className="font-display font-black text-xl sm:text-2xl text-dark">
                      {person.name}, <span className="font-editorial text-lg text-dark/70">{person.age}</span>
                    </h3>
                    <span className="text-[11px] font-mono font-bold text-dark/50">
                      📍 {person.city}
                    </span>
                  </div>

                  {/* Pricing Pill */}
                  <div className="text-right bg-[#FFF4DF] px-2.5 py-1 rounded-xl border border-dark/20">
                    <span className="font-display font-black text-xs sm:text-sm text-coral">
                      ₹{person.price}
                    </span>
                    <span className="text-[9px] font-mono text-dark/60 block -mt-0.5">
                      / hour
                    </span>
                  </div>
                </div>

                {/* Interest Pills */}
                <div className="flex flex-wrap gap-1 mt-2.5">
                  {person.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-md bg-cream text-dark border border-dark/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Profile & Booking CTAs */}
                <div className="space-y-1.5 mt-3.5">
                  <Link
                    href="/profile?tab=explore"
                    className="w-full py-2 rounded-xl bg-cream hover:bg-white text-dark font-display font-extrabold text-xs uppercase border-2 border-dark transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>VIEW FULL PROFILE</span>
                    <ArrowUpRight size={13} />
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleBookHang(person)}
                    disabled={status === "loading" && activePerson === person.name}
                    className="w-full py-2.5 rounded-xl bg-lime hover:bg-dark hover:text-lime text-dark font-display font-black text-xs uppercase tracking-wider border-2 border-dark transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[3px_3px_0px_#171717] disabled:opacity-60 disabled:cursor-wait"
                  >
                    {status === "loading" && activePerson === person.name ? (
                      <>
                        <Loader2 size={13} className="animate-spin text-dark" />
                        <span>OPENING RAZORPAY...</span>
                      </>
                    ) : (
                      <>
                        <span>BOOK HANG WITH {person.name.toUpperCase()} →</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Compact Join Callout Card in the Grid */}
          <div className="bg-lime p-6 sm:p-7 rounded-[2rem] border-3 border-dark shadow-[5px_5px_0px_#171717] flex flex-col justify-between">
            <div>
              <span className="sticker bg-coral text-white text-[10px] mb-3">JOIN THE SQUAD</span>
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-dark leading-tight mt-2">
                BECOME A <br />VERIFIED COMPANION.
              </h3>
              <p className="mt-3 text-xs sm:text-sm font-medium text-dark/85 leading-relaxed">
                Turn your city knowledge, coffee runs, and gallery visits into paid social company. Set your own hourly rate (₹500–₹1200/hr).
              </p>
            </div>

            <Link
              href="/auth"
              className="mt-6 w-full py-3 rounded-xl bg-dark text-lime font-display font-extrabold text-xs uppercase tracking-wider text-center block shadow-[3px_3px_0px_#171717] hover:bg-white hover:text-dark transition-all border border-dark"
            >
              APPLY AS COMPANION →
            </Link>
          </div>
        </div>
      </div>

      {/* Payment Toast */}
      <AnimatePresence>
        {bookingToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-2xl border-3 shadow-[4px_4px_0px_#171717] max-w-md text-center ${
              bookingToast.status === "success"
                ? "bg-lime border-dark text-dark"
                : "bg-coral border-dark text-white"
            }`}
          >
            <p className="font-display font-bold text-sm">{bookingToast.message}</p>
            <button
              onClick={() => setBookingToast(null)}
              className="mt-2 text-xs font-bold underline opacity-80 hover:opacity-100 cursor-pointer"
            >
              DISMISS
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
