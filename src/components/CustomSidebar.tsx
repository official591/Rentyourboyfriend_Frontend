"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  Users,
  Sparkles,
  MapPin,
  ShieldCheck,
  ArrowUp,
  LogIn,
  Zap,
} from "lucide-react";

export default function CustomSidebar() {
  const [mounted, setMounted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("");
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const progress = Math.min(
          100,
          Math.max(0, Math.round((window.scrollY / totalScroll) * 100))
        );
        setScrollProgress(progress);
      }

      // Check current section
      const sections = ["discover", "vibe", "city", "safety", "journal"];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= window.innerHeight * 0.2) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) return null;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navItems = [
    { id: "discover", label: "COMPANIONS", icon: Users, href: "/#discover", color: "bg-coral text-white" },
    { id: "vibe", label: "VIBES", icon: Sparkles, href: "/#vibe", color: "bg-lime text-dark" },
    { id: "city", label: "KOLKATA", icon: MapPin, href: "/#city", color: "bg-lavender text-dark" },
    { id: "safety", label: "TRUST", icon: ShieldCheck, href: "/#safety", color: "bg-hotpink text-white" },
  ];

  return (
    <aside className="fixed right-3 md:right-5 top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col items-center gap-3 pointer-events-none select-none">
      
      {/* ── Main Neo-Brutalist Vertical Dock ── */}
      <div className="pointer-events-auto bg-white/95 backdrop-blur-md p-2 rounded-full border-3 border-dark shadow-[4px_4px_0px_#171717] flex flex-col items-center gap-2">
        
        {/* Top Status & Radar Pill */}
        <div className="relative group cursor-pointer p-1">
          <div className="w-8 h-8 rounded-full bg-dark text-lime flex items-center justify-center border-2 border-dark shadow-sm">
            <Compass size={16} className="animate-[spin_8s_linear_infinite]" />
          </div>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-lime rounded-full border border-dark animate-pulse" />
          
          {/* Tooltip */}
          <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            <span className="sticker bg-dark text-lime text-[10px] py-1 px-2.5">
              ✦ 142 ONLINE IN KOLKATA
            </span>
          </div>
        </div>

        {/* Vertical Scroll Progress Gauge */}
        <div className="w-2.5 h-16 bg-[#FFF4DF] rounded-full border border-dark relative overflow-hidden my-1">
          <motion.div
            className="w-full bg-coral absolute bottom-0 left-0 right-0 rounded-full"
            style={{ height: `${scrollProgress}%` }}
            transition={{ ease: "easeOut", duration: 0.1 }}
          />
        </div>

        <span className="font-mono font-bold text-[9px] text-dark/70">
          {scrollProgress}%
        </span>

        <div className="w-5 h-[1.5px] bg-dark/20 my-0.5" />

        {/* Quick Nav Anchors */}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <div
              key={item.id}
              className="relative"
              onMouseEnter={() => setHoveredNav(item.id)}
              onMouseLeave={() => setHoveredNav(null)}
            >
              <Link
                href={item.href}
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 border-dark transition-all cursor-pointer ${
                  isActive
                    ? `${item.color} scale-110 shadow-[2px_2px_0px_#171717]`
                    : "bg-cream text-dark hover:bg-white hover:scale-105"
                }`}
                aria-label={item.label}
              >
                <Icon size={14} />
              </Link>

              {/* Tooltip on hover */}
              <AnimatePresence>
                {hoveredNav === item.id && (
                  <motion.div
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    className="absolute right-11 top-1/2 -translate-y-1/2 pointer-events-none whitespace-nowrap z-50"
                  >
                    <span className={`sticker text-[10px] py-1 px-2.5 ${item.color}`}>
                      {item.label}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        <div className="w-5 h-[1.5px] bg-dark/20 my-0.5" />

        {/* Quick Auth Trigger Button */}
        <div
          className="relative"
          onMouseEnter={() => setHoveredNav("auth")}
          onMouseLeave={() => setHoveredNav(null)}
        >
          <Link
            href="/auth"
            className="w-8 h-8 rounded-full bg-lime text-dark flex items-center justify-center border-2 border-dark shadow-[2px_2px_0px_#171717] hover:bg-coral hover:text-white hover:scale-105 transition-all cursor-pointer"
            aria-label="Join or Login"
          >
            <Zap size={14} />
          </Link>

          {/* Tooltip */}
          <AnimatePresence>
            {hoveredNav === "auth" && (
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                className="absolute right-11 top-1/2 -translate-y-1/2 pointer-events-none whitespace-nowrap z-50"
              >
                <span className="sticker bg-lime text-dark text-[10px] py-1 px-2.5">
                  ✦ JOIN / LOG IN
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Scroll To Top Button */}
        {scrollProgress > 15 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={scrollToTop}
            className="w-8 h-8 rounded-full bg-dark text-white flex items-center justify-center border-2 border-dark shadow-[2px_2px_0px_#FF5C5C] hover:bg-coral hover:text-white transition-all cursor-pointer mt-1"
            aria-label="Scroll to top"
          >
            <ArrowUp size={14} />
          </motion.button>
        )}

      </div>

    </aside>
  );
}
