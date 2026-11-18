"use client";

import React, { useState, useEffect } from "react";
import { Lock, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import TierBadge from "@/components/TierBadge";

// Tier hierarchy levels
const TIER_LEVELS: Record<string, number> = {
  free: 0,
  basic: 1,
  premium: 2,
  vip: 3,
};

interface TierGateProps {
  requiredTier: "basic" | "premium" | "vip";
  children: React.ReactNode;
  /** What to show when locked. "blur" = blur background + floating lock modal. "lock-card" = replaces children with lock badge */
  mode?: "blur" | "lock-card";
  /** Optional feature name shown in the lock message */
  featureLabel?: string;
  className?: string;
}

export default function TierGate({
  requiredTier,
  children,
  mode = "blur",
  featureLabel,
  className = "",
}: TierGateProps) {
  const [userTier, setUserTier] = useState<string>("free");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("companion_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.membership_tier) {
          setUserTier(parsed.membership_tier.toLowerCase());
        }
      }
    } catch (e) {
      console.error("TierGate failed to parse user tier:", e);
    }
  }, []);

  const userLevel = TIER_LEVELS[userTier] ?? 0;
  const requiredLevel = TIER_LEVELS[requiredTier] ?? 0;
  const hasAccess = userLevel >= requiredLevel;

  // Unlocked — user has required tier or higher
  if (hasAccess) {
    return <>{children}</>;
  }

  const tierNames: Record<string, string> = {
    basic: "BASIC",
    premium: "PREMIUM",
    vip: "VIP BESPOKE",
  };

  if (mode === "lock-card") {
    return (
      <div
        className={`relative rounded-3xl border-3 border-dark bg-cream p-6 sm:p-8 text-center space-y-4 shadow-[6px_6px_0px_#171717] ${className}`}
      >
        <div className="w-14 h-14 mx-auto rounded-full bg-coral/10 border-2 border-dark flex items-center justify-center text-coral shadow-[2px_2px_0px_#171717]">
          <Lock size={26} />
        </div>

        <div className="space-y-1">
          <p className="font-display font-black text-lg uppercase text-dark">
            {featureLabel ? `${featureLabel} is Locked` : "Members-Only Perk"}
          </p>
          <p className="text-xs text-dark/70 font-editorial max-w-sm mx-auto">
            This exclusive feature requires an active{" "}
            <TierBadge tier={requiredTier} size="sm" className="inline-flex mx-1" />
            membership or higher.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/#membership"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-coral text-white font-display font-bold text-xs uppercase tracking-wider border-2 border-dark shadow-[3px_3px_0px_#171717] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
          >
            <Sparkles size={14} />
            <span>UPGRADE TO {tierNames[requiredTier] || "UNLOCK"}</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  // mode === "blur"
  return (
    <div className={`relative overflow-hidden rounded-3xl ${className}`}>
      {/* Blurred background content */}
      <div className="filter blur-md pointer-events-none select-none opacity-40 transition-all">
        {children}
      </div>

      {/* Floating lock badge */}
      <div className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-dark/20 backdrop-blur-[2px]">
        <div className="bg-white rounded-3xl border-3 border-dark shadow-[8px_8px_0px_#171717] p-6 max-w-sm w-full text-center space-y-3.5">
          <div className="w-12 h-12 mx-auto rounded-full bg-lime border-2 border-dark flex items-center justify-center text-dark shadow-[3px_3px_0px_#171717]">
            <Lock size={22} />
          </div>

          <div className="space-y-1">
            <h4 className="font-display font-black text-base uppercase text-dark">
              {featureLabel || "Exclusive Feature Locked"}
            </h4>
            <p className="text-xs text-dark/70 font-editorial leading-relaxed">
              Available exclusively for{" "}
              <TierBadge tier={requiredTier} size="sm" className="inline-flex mx-0.5" /> members.
            </p>
          </div>

          <Link
            href="/#membership"
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-coral text-white font-display font-black text-xs uppercase tracking-wider border-2 border-dark shadow-[3px_3px_0px_#171717] hover:bg-dark hover:text-white transition-all cursor-pointer"
          >
            <Sparkles size={14} />
            <span>UNLOCK WITH {tierNames[requiredTier]} →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

