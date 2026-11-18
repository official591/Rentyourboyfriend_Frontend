"use client";

import React from "react";
import { ShieldCheck, Star, Crown, Sparkles } from "lucide-react";

export type MembershipTierType = "free" | "basic" | "premium" | "vip" | string;

interface TierBadgeProps {
  tier?: MembershipTierType;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function TierBadge({
  tier = "free",
  showIcon = true,
  size = "md",
  className = "",
}: TierBadgeProps) {
  const normalizedTier = (tier || "free").toLowerCase();

  const configs: Record<
    string,
    {
      label: string;
      bg: string;
      border: string;
      text: string;
      shadow: string;
      icon: React.ReactNode;
    }
  > = {
    free: {
      label: "STARTER",
      bg: "bg-white",
      border: "border-dark/60",
      text: "text-dark/80",
      shadow: "shadow-none",
      icon: <span className="w-1.5 h-1.5 rounded-full bg-dark/40 inline-block" />,
    },
    basic: {
      label: "BASIC MEMBER",
      bg: "bg-lavender",
      border: "border-dark",
      text: "text-dark",
      shadow: "shadow-[2px_2px_0px_#171717]",
      icon: <ShieldCheck size={12} className="text-dark shrink-0" />,
    },
    premium: {
      label: "PREMIUM EXPLORER",
      bg: "bg-lime",
      border: "border-dark",
      text: "text-dark",
      shadow: "shadow-[2px_2px_0px_#171717]",
      icon: <Star size={12} className="text-dark fill-dark shrink-0" />,
    },
    vip: {
      label: "VIP BESPOKE",
      bg: "bg-coral",
      border: "border-dark",
      text: "text-white",
      shadow: "shadow-[2px_2px_0px_#171717]",
      icon: <Crown size={13} className="text-yellow-300 fill-yellow-300 shrink-0" />,
    },
  };

  const config = configs[normalizedTier] || configs.free;

  const sizeStyles = {
    sm: "text-[10px] px-2 py-0.5 gap-1 border",
    md: "text-xs px-2.5 py-1 gap-1.5 border-2",
    lg: "text-sm px-3.5 py-1.5 gap-2 border-2",
  };

  return (
    <span
      className={`inline-flex items-center font-display font-black uppercase tracking-wider rounded-full transition-all ${config.bg} ${config.border} ${config.text} ${config.shadow} ${sizeStyles[size]} ${className}`}
    >
      {showIcon && config.icon}
      <span>{config.label}</span>
    </span>
  );
}

