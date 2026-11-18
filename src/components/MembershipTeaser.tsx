"use client";

import { motion } from "framer-motion";
import { Check, Loader2, Sparkles, Crown } from "lucide-react";
import { useRazorpay, PaymentStatus } from "@/hooks/useRazorpay";
import TierBadge from "@/components/TierBadge";
import { useState, useEffect } from "react";

const plans = [
  {
    level: "FREE",
    price: "₹0",
    amountPaise: 0,
    color: "bg-white text-dark",
    badge: "STARTER",
    desc: "Test the waters. Browse verified profiles & send limited intro requests.",
    perks: [
      "Curated profile browsing",
      "Up to 3 introduction pings",
      "Standard ID verification badge",
    ],
  },
  {
    level: "BASIC",
    price: "₹299",
    suffix: "/ MO",
    amountPaise: 29900,
    color: "bg-lavender text-dark",
    badge: "POPULAR",
    desc: "For frequent city explorers and weekly coffee chats. Core messaging features only.",
    perks: [
      "Unlimited companion chats",
      "Verified member icon",
      "Read receipts & status",
      "Direct in-app coordination",
    ],
  },
  {
    level: "PREMIUM",
    price: "₹699",
    suffix: "/ MO",
    amountPaise: 69900,
    color: "bg-lime text-dark border-3 border-dark",
    badge: "RECOMMENDED",
    desc: "Priority companion access, concierge bookings, and events. Includes all Basic features.",
    perks: [
      "✨ Includes all Basic perks",
      "Priority companion booking queue",
      "Concierge cafe & table reservations",
      "Exclusive gallery & gig invites",
      "24/7 priority support assistance",
    ],
  },
  {
    level: "VIP",
    price: "₹1,499",
    suffix: "/ MO",
    amountPaise: 149900,
    color: "bg-coral text-white",
    badge: "BESPOKE",
    desc: "The ultimate pass. Unlocks every single feature across Basic, Premium, plus exclusive VIP access.",
    perks: [
      "👑 Includes all Basic & Premium perks",
      "Dedicated 1-on-1 human curator",
      "Invitation-only private chef dinners",
      "Custom secret city itineraries",
      "High-discretion private arrangements",
    ],
  },
];

function PaymentStatusToast({
  status,
  error,
  retryCooldown = 0,
  onDismiss,
}: {
  status: PaymentStatus;
  error: string | null;
  retryCooldown?: number;
  onDismiss: () => void;
}) {
  if (status === "idle" || status === "loading") return null;

  const errorMessage = retryCooldown > 0
    ? `⚠️ Payment authentication failed. You can retry again in ${retryCooldown}s.`
    : (error || "Payment failed. Please try again.");

  const config = {
    success: {
      bg: "bg-lime border-dark text-dark",
      message: "🎉 Payment successful! Welcome to COMPANION.",
    },
    error: {
      bg: "bg-coral border-dark text-white",
      message: errorMessage,
    },
    cancelled: {
      bg: "bg-lavender border-dark text-dark",
      message: "Payment cancelled. No charge was made.",
    },
  };

  const c = config[status as keyof typeof config];
  if (!c) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-2xl border-3 shadow-[4px_4px_0px_#171717] ${c.bg} max-w-md text-center`}
    >
      <p className="font-display font-bold text-sm">{c.message}</p>
      {retryCooldown > 0 && (
        <div className="w-full bg-white/20 h-1.5 rounded-full mt-2 overflow-hidden">
          <div
            className="bg-white h-full transition-all duration-1000"
            style={{ width: `${(retryCooldown / 60) * 100}%` }}
          />
        </div>
      )}
      <button
        onClick={onDismiss}
        className="mt-2 text-xs font-bold underline opacity-80 hover:opacity-100 cursor-pointer"
      >
        DISMISS
      </button>
    </motion.div>
  );
}

export default function MembershipTeaser() {
  const [activePlan, setActivePlan] = useState<string | null>(null);
  const [upgradedTier, setUpgradedTier] = useState<string | null>(null);
  const [retryCooldown, setRetryCooldown] = useState<number>(0);

  // 1-minute live countdown timer
  useEffect(() => {
    if (retryCooldown <= 0) return;
    const interval = setInterval(() => {
      setRetryCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [retryCooldown]);

  const { pay, status, error, reset } = useRazorpay({
    name: "COMPANION",
    description: "Membership Subscription",
    themeColor: "#3155FF",
    onSuccess: (data) => {
      console.log("Membership verified & upgraded:", data);
      setRetryCooldown(0);
      if (data.upgraded_tier) {
        setUpgradedTier(data.upgraded_tier);
        try {
          const stored = localStorage.getItem("companion_user");
          const parsed = stored ? JSON.parse(stored) : {};
          parsed.membership_tier = data.upgraded_tier;
          localStorage.setItem("companion_user", JSON.stringify(parsed));
        } catch (e) {
          console.error("Local storage error:", e);
        }
      }
      setActivePlan(null);
    },
    onError: (err) => {
      console.error("Payment error:", err);
      setActivePlan(null);
      // Start 1-minute (60 seconds) retry cooldown
      setRetryCooldown(60);
    },
  });

  const handleSelectPlan = (plan: typeof plans[number]) => {
    // Free plan — no payment needed
    if (plan.amountPaise === 0) {
      return;
    }

    const storedUser = typeof window !== "undefined" ? localStorage.getItem("companion_user") : null;
    let userEmail = "joy.companion@gmail.com";
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.email) userEmail = parsed.email;
      } catch (e) { }
    }

    const tierLower = plan.level.toLowerCase();
    setActivePlan(plan.level);
    pay(plan.amountPaise, `membership_${tierLower}_${Date.now()}`, {
      name: `COMPANION // ${plan.level} MEMBERSHIP`,
      description: `${plan.level} Plan Subscription (${plan.price}/mo)`,
      tier: tierLower,
      userEmail: userEmail,
      themeColor: plan.level === "VIP" ? "#FF5C5C" : plan.level === "PREMIUM" ? "#C7F35B" : "#B8A7FF",
    });
  };

  return (
    <section id="membership" className="bg-cream py-24 sm:py-32 relative overflow-hidden">
      {/* Smooth bottom transition into Coral (FinalCta) */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-coral/30 to-coral pointer-events-none z-10" />
      <div className="px-6 md:px-10 lg:px-16 max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="sticker bg-coral text-white">SECTION // 10</span>
            <span className="sticker bg-lime text-dark">COMMUNITY MEMBERSHIP</span>
          </div>
          <h2 className="font-display text-5xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-tight text-dark leading-none">
            MORE PEOPLE. <br />
            <span className="text-cobalt">MORE PLANS.</span> <br />
            <span className="text-coral underline decoration-lime">MORE STORIES.</span>
          </h2>
          <p className="mt-6 text-base font-medium text-dark/75">
            Transparent pricing designed for genuine connection with zero commitments.
          </p>
        </div>

        {/* Horizontal Pricing Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((p) => {
            const isLoading = status === "loading" && activePlan === p.level;
            const isPaid = p.amountPaise > 0;

            return (
              <motion.div
                key={p.level}
                whileHover={{ y: -6 }}
                className={`rounded-3xl border-3 border-dark p-6 sm:p-8 flex flex-col justify-between shadow-[6px_6px_0px_#171717] ${p.color}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="sticker bg-dark text-white text-[10px]">
                      {p.badge}
                    </span>
                    <TierBadge tier={p.level.toLowerCase()} size="sm" />
                  </div>

                  <h3 className="font-display font-black text-3xl">
                    {p.level}
                  </h3>

                  <div className="my-5 flex items-baseline gap-1">
                    <span className="font-display font-black text-5xl">
                      {p.price}
                    </span>
                    {p.suffix && (
                      <span className="font-mono text-xs font-bold opacity-75">
                        {p.suffix}
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-medium opacity-80 leading-relaxed mb-6">
                    {p.desc}
                  </p>

                  <div className="space-y-2 border-t border-current/20 pt-4 mb-8">
                    {p.perks.map((perk, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs font-medium">
                        <Check size={14} className="shrink-0 mt-0.5" />
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleSelectPlan(p)}
                  disabled={isLoading || (isPaid && retryCooldown > 0)}
                  className="w-full py-3 rounded-full bg-dark text-white font-display font-bold text-xs uppercase tracking-wider text-center shadow-[3px_3px_0px_#171717] hover:bg-white hover:text-dark border-2 border-dark transition-colors disabled:opacity-60 disabled:cursor-wait flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      PROCESSING…
                    </>
                  ) : isPaid && retryCooldown > 0 ? (
                    <>
                      <span>⏳ RETRY IN {retryCooldown}s</span>
                    </>
                  ) : isPaid ? (
                    <>{retryCooldown === 0 && error ? `RETRY ${p.level} →` : `SELECT ${p.level} →`}</>
                  ) : (
                    <>GET STARTED FREE →</>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Payment status toast */}
      <PaymentStatusToast
        status={status}
        error={error}
        retryCooldown={retryCooldown}
        onDismiss={() => {
          reset();
          setRetryCooldown(0);
        }}
      />
    </section>
  );
}
