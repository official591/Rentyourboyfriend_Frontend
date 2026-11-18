"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import TierBadge from "@/components/TierBadge";

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userTier, setUserTier] = useState<string>("free");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("companion_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.membership_tier) setUserTier(parsed.membership_tier);
      }
    } catch (e) {}
  }, []);

  const links = [
    { label: "PROFILES", href: "/profile?tab=explore", tag: "LIVE" },
    { label: "DISCOVER", href: "/#discover", tag: "NEW" },
    { label: "PLANS", href: "/#membership", tag: "TIERS" },
    { label: "EXPERIENCES", href: "/#vibe", tag: "HOT" },
    { label: "JOURNAL", href: "/#journal" },
  ];

  return (
    <>
      <header className="fixed top-4 md:top-6 left-0 right-0 z-50 px-4 md:px-8 max-w-7xl mx-auto flex items-center justify-between pointer-events-none">
        {/* Left: Brand Logo */}
        <motion.a
          href="/"
          className="pointer-events-auto group bg-dark text-cream px-4 py-2.5 rounded-full border-2 border-dark flex items-center gap-2.5 shadow-[3px_3px_0px_#FF5C5C] hover:shadow-[1px_1px_0px_#FF5C5C] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="w-5 h-5 rounded-full bg-lime text-dark flex items-center justify-center font-bold text-xs">
            C
          </span>
          <span className="font-display font-bold text-sm tracking-tight text-white flex items-center gap-1">
            COMPANION<span className="text-coral text-xs">®</span>
          </span>
        </motion.a>

        {/* Center: Desktop Navigation Bar */}
        <nav className="pointer-events-auto hidden md:flex items-center gap-1 bg-white/90 backdrop-blur-md px-3 py-2 rounded-full border-2 border-dark shadow-[4px_4px_0px_#171717]">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="relative px-4 py-1.5 rounded-full text-xs font-display font-bold tracking-wider text-dark hover:bg-cream hover:text-coral transition-colors flex items-center gap-1.5 group"
            >
              <span>{link.label}</span>
              {link.tag && (
                <span className="text-[9px] bg-lime text-dark px-1.5 py-0.2 rounded-full font-mono border border-dark">
                  {link.tag}
                </span>
              )}
            </a>
          ))}
        </nav>

        {/* Right: CTA & Sign In */}
        <div className="pointer-events-auto hidden md:flex items-center gap-2.5">
          {userTier && userTier !== "free" && (
            <TierBadge tier={userTier} size="sm" />
          )}
          <a
            href="/profile"
            className="text-xs font-display font-bold uppercase tracking-wider text-dark bg-lime hover:bg-lime/80 px-4 py-2 rounded-full border-2 border-dark transition-colors shadow-[2px_2px_0px_#171717]"
          >
            MY PROFILE
          </a>
          
          <motion.a
            href="/auth"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group px-5 py-2.5 rounded-full bg-coral text-white font-display font-bold text-xs uppercase tracking-wider border-2 border-dark flex items-center gap-1.5 shadow-[3px_3px_0px_#171717] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
          >
            <span>SIGN IN</span>
            <ArrowUpRight size={15} className="group-hover:rotate-45 transition-transform" />
          </motion.a>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="pointer-events-auto md:hidden p-2.5 rounded-full bg-lime border-2 border-dark shadow-[2px_2px_0px_#171717]"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X size={20} className="text-dark" /> : <Menu size={20} className="text-dark" />}
        </button>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-coral flex flex-col justify-between p-8 pt-24 text-dark md:hidden"
          >
            <div className="space-y-6">
              <span className="sticker bg-lime text-dark">MENU // 01</span>
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block font-display text-4xl font-extrabold text-cream hover:text-dark transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="space-y-4 pt-8 border-t-2 border-dark">
              <a
                href="/auth"
                onClick={() => setMobileOpen(false)}
                className="w-full py-4 rounded-2xl bg-dark text-lime font-display font-bold text-center block text-lg shadow-[4px_4px_0px_#171717] hover:bg-lime hover:text-dark transition-all cursor-pointer"
              >
                LET'S GO →
              </a>
              <div className="flex justify-between text-xs font-mono text-cream font-bold">
                <span>18+ VERIFIED ONLY</span>
                <span>KOLKATA // IN</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
