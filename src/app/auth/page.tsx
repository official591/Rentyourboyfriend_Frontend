"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Mail,
  Zap,
  Flame,
  Check,
  Eye,
  EyeOff,
  RotateCcw,
  IndianRupee,
} from "lucide-react";

type VibeCategory = "all" | "food" | "culture" | "music" | "deep";

interface VibeOption {
  id: string;
  category: "food" | "culture" | "music" | "deep";
  label: string;
  color: string;
  emoji: string;
}

const ALL_VIBES: VibeOption[] = [
  // Cafes & Food
  { id: "flat-whites", category: "food", emoji: "☕", label: "Flat Whites & Specialty Cafes", color: "bg-coral text-white" },
  { id: "chai-ghat", category: "food", emoji: "🌅", label: "Princep Ghat Sunset & Chai", color: "bg-tangerine text-dark" },
  { id: "street-food", category: "food", emoji: "🍜", label: "Late-Night Street Food & Rolls", color: "bg-amber-300 text-dark" },
  { id: "coffee-house", category: "food", emoji: "📚", label: "College Street Coffee House Adda", color: "bg-lime text-dark" },
  { id: "momo-runs", category: "food", emoji: "🥟", label: "Steaming Momo Runs in Bhawanipur", color: "bg-coral text-white" },
  { id: "desserts", category: "food", emoji: "🍨", label: "Artisanal Bakeries & Gelato", color: "bg-lavender text-dark" },

  // Culture & Arts
  { id: "photo-walks", category: "culture", emoji: "📸", label: "35mm Film & Street Walks", color: "bg-lime text-dark" },
  { id: "art-galleries", category: "culture", emoji: "🎨", label: "Modern Art Galleries & Openings", color: "bg-lavender text-dark" },
  { id: "nandan-cinema", category: "culture", emoji: "🎬", label: "Art-House Cinema at Nandan", color: "bg-cobalt text-white" },
  { id: "heritage", category: "culture", emoji: "🏛️", label: "Old Calcutta Lore & Heritage Walks", color: "bg-cream text-dark" },
  { id: "theatre", category: "culture", emoji: "🎭", label: "Academy of Fine Arts Stage Plays", color: "bg-hotpink text-white" },
  { id: "book-hunting", category: "culture", emoji: "📖", label: "Rare Book Hunting & Zines", color: "bg-lime text-dark" },
  { id: "pottery", category: "culture", emoji: "🏺", label: "Kumartuli Clay Studios", color: "bg-tangerine text-dark" },

  // Music & Nights
  { id: "indie-gigs", category: "music", emoji: "🎵", label: "Underground Indie & Jazz Gigs", color: "bg-hotpink text-white" },
  { id: "vinyl-jam", category: "music", emoji: "🎸", label: "Rooftop Vinyl Sessions & Jamming", color: "bg-cobalt text-white" },
  { id: "midnight-cycle", category: "music", emoji: "🚲", label: "Midnight Cycling by Victoria", color: "bg-lime text-dark" },
  { id: "park-st-night", category: "music", emoji: "🍸", label: "Classic Park Street Jazz Lounges", color: "bg-coral text-white" },

  // Deep & Chill
  { id: "deep-talks", category: "deep", emoji: "✨", label: "Zero-Filter Deep 3AM Convos", color: "bg-cobalt text-white" },
  { id: "arcade", category: "deep", emoji: "👾", label: "Retro Arcades & Board Game Cafes", color: "bg-tangerine text-dark" },
  { id: "thrifting", category: "deep", label: "Vintage Thrifting & Flea Markets", color: "bg-lavender text-dark", emoji: "🛍️" },
  { id: "stargazing", category: "deep", emoji: "🌌", label: "Quiet Rooftop Wind-Down & Stars", color: "bg-dark text-lime" },
  { id: "picnics", category: "deep", emoji: "🌿", label: "Botanical Garden Chill & Reading", color: "bg-lime text-dark" },
];

const SOCIAL_PROOF_CREW = [
  { name: "Maya", image: "/images/portrait-maya.jpg", city: "Park Street", tag: "35MM FILM" },
  { name: "Arjun", image: "/images/portrait-arjun.jpg", city: "Salt Lake", tag: "INDIE GIGS" },
  { name: "Priya", image: "/images/portrait-priya.jpg", city: "Ballygunge", tag: "CURATOR" },
  { name: "Ananya", image: "/images/portrait-ananya.jpg", city: "Southern Ave", tag: "NIGHT OWL" },
];

const PRESET_RATES = ["399", "599", "899", "1299"];

export default function AuthPage() {
  const [authMode, setAuthMode] = useState<"signup" | "login">("signup");
  const [role, setRole] = useState<"seeker" | "companion">("seeker");
  const [activeCategory, setActiveCategory] = useState<VibeCategory>("all");
  const [selectedVibes, setSelectedVibes] = useState<string[]>([
    "flat-whites",
    "deep-talks",
    "photo-walks",
  ]);

  // Form inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [age, setAge] = useState("21");
  const [city, setCity] = useState("Kolkata");
  const [hourlyRate, setHourlyRate] = useState("599");

  // OTP State (Signup only)
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [previewOtp, setPreviewOtp] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successHeadline, setSuccessHeadline] = useState("");

  // Countdown timer for OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpSent && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, resendTimer]);

  const toggleVibe = (id: string) => {
    setSelectedVibes((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const filteredVibes =
    activeCategory === "all"
      ? ALL_VIBES
      : ALL_VIBES.filter((v) => v.category === activeCategory);

  const getMatchScore = () => {
    const count = selectedVibes.length;
    if (count === 0) return { percent: 40, label: "Pick at least 2 vibes to match", color: "text-dark/60" };
    if (count === 1) return { percent: 65, label: "65% Match • Add more for deep resonance", color: "text-amber-600" };
    if (count === 2) return { percent: 82, label: "82% Match • Great taste detected!", color: "text-cobalt" };
    if (count <= 4) return { percent: 94, label: "🔥 94% Match • High Kolkata Resonance", color: "text-coral" };
    return { percent: 99, label: "⚡ 99% Match • Elite City Explorer Vibe!", color: "text-emerald-600" };
  };

  const match = getMatchScore();

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val[0];
    const newOtp = [...otpCode];
    newOtp[index] = val;
    setOtpCode(newOtp);

    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const paste = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(paste)) {
      e.preventDefault();
      setOtpCode(paste.split(""));
    }
  };

  // 1. SIGN UP: Send Email OTP to verify during registration
  const handleSignUpInit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }
    if (role === "companion" && (!hourlyRate || parseInt(hourlyRate, 10) < 100)) {
      setErrorMessage("Please set a valid hourly rate (minimum ₹100/hr).");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send verification code");
      }

      setOtpSent(true);
      setPreviewOtp(data.previewOtp || null);
      setResendTimer(30);
      setCanResend(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error sending code";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. SIGN UP: Verify Email OTP & Finalize Account in Neon
  const handleVerifyOtpAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const enteredOtp = otpCode.join("");
    if (enteredOtp.length !== 6) {
      setErrorMessage("Please enter the complete 6-digit verification code.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp: enteredOtp,
          password,
          name: name || "Companion Friend",
          age: parseInt(age, 10) || 21,
          city,
          vibes: selectedVibes,
          role,
          hourlyRate: role === "companion" ? parseInt(hourlyRate, 10) : 0,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Verification failed");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem(
          "companion_user",
          JSON.stringify({
            email: email.trim().toLowerCase(),
            name: name || "Companion Friend",
            id: data.profile?.id || "",
            role: role,
            hourlyRate: role === "companion" ? parseInt(hourlyRate, 10) : 0,
          })
        );
      }

      setSuccessHeadline(`YOU'RE VERIFIED & IN, ${name.toUpperCase() || "LEGEND"}! 🎉`);
      setIsSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Verification failed";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. LOG IN: Password Only (No OTP Required)
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter your registered email address.");
      return;
    }
    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem(
          "companion_user",
          JSON.stringify({
            email: data.user?.email || email.trim().toLowerCase(),
            name: data.user?.name || "Friend",
            id: data.user?.id || "",
            role: data.user?.isCompanion ? "companion" : "seeker",
            hourlyRate: data.user?.hourlyRate || 0,
          })
        );
      }

      setSuccessHeadline(`WELCOME BACK, ${data.user?.name?.toUpperCase() || "FRIEND"}! 👋`);
      setIsSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-cream text-dark relative selection:bg-lime selection:text-dark flex flex-col justify-between">
      {/* Dynamic Background Blobs */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-coral/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-10 left-0 w-[500px] h-[500px] bg-lime/25 rounded-full blur-3xl pointer-events-none translate-y-1/3 -translate-x-1/3" />
      <div className="absolute top-1/2 left-1/2 w-[650px] h-[650px] bg-lavender/25 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      {/* Top Header / Brand Bar */}
      <header className="relative z-30 px-6 md:px-12 py-3.5 max-w-7xl mx-auto w-full flex items-center justify-between shrink-0">
        <Link
          href="/"
          className="group inline-flex items-center gap-2.5 bg-dark text-white px-4 py-2 rounded-full border-2 border-dark shadow-[3px_3px_0px_#FF5C5C] hover:shadow-[1px_1px_0px_#FF5C5C] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
        >
          <span className="w-5 h-5 rounded-full bg-lime text-dark flex items-center justify-center font-bold text-xs">
            C
          </span>
          <span className="font-display font-extrabold text-sm tracking-tight text-white flex items-center gap-1">
            COMPANION<span className="text-coral text-xs">®</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-dark font-display font-bold text-xs uppercase tracking-wider border-2 border-dark shadow-[2px_2px_0px_#171717] hover:bg-cream transition-all"
          >
            <ArrowLeft size={14} />
            <span>BACK TO HOME</span>
          </Link>
        </div>
      </header>

      {/* ── Main Layout Container ── */}
      <div className="relative z-20 flex-1 flex items-center justify-center w-full px-4 sm:px-6 md:px-8 py-3 lg:py-4">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* ── Left Column: Editorial & Gen Z Visual Hype ── */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Stickers row */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="sticker bg-lime text-dark rotate-[-2deg]">
                  ✦ 100% EMAIL VERIFIED
                </span>
                <span className="sticker bg-coral text-white rotate-[2deg]">
                  KOLKATA SOCIAL CLUB
                </span>
                <span className="sticker bg-lavender text-dark rotate-[-1deg] hidden sm:inline-block">
                  NEON DATABASE CLOUD
                </span>
              </div>

              {/* Bold Punchy Headline */}
              <div className="space-y-3">
                <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight leading-[0.88] text-dark">
                  NEVER GO TO <br />
                  <span className="text-cobalt underline decoration-wavy decoration-lime">CONCERTS</span> <br />
                  <span className="text-coral">OR CAFES</span> <br />
                  ALONE AGAIN.
                </h1>
                <p className="font-editorial text-xl sm:text-2xl text-dark/80 pt-2 leading-snug">
                  Curated, verified humans for good conversation, secret coffee corners, and memorable city plans. No dating pressure. Just real connection.
                </p>
              </div>

              {/* Social Proof Strip with Live Companions */}
              <div className="bg-white p-5 rounded-3xl border-3 border-dark shadow-[6px_6px_0px_#171717] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-lime animate-pulse border border-dark" />
                    <span className="text-xs font-mono font-extrabold uppercase text-dark">
                      142 ACTIVE COMPANIONS IN CALCUTTA
                    </span>
                  </div>
                  <span className="sticker bg-hotpink text-white text-[10px]">
                    ONLINE NOW
                  </span>
                </div>

                {/* Avatars row */}
                <div className="flex items-center gap-3 pt-1">
                  <div className="flex -space-x-3 overflow-hidden">
                    {SOCIAL_PROOF_CREW.map((person, idx) => (
                      <div
                        key={idx}
                        className="relative w-12 h-12 rounded-full border-2 border-dark overflow-hidden bg-cream shadow-sm"
                      >
                        <Image
                          src={person.image}
                          alt={person.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="text-xs">
                    <p className="font-display font-extrabold text-dark uppercase">
                      Maya, Arjun, Priya & 139 others
                    </p>
                    <p className="font-mono text-[11px] text-dark/70">
                      Ready for cafe hops, film clubs & indie gigs
                    </p>
                  </div>
                </div>

                {/* Testimonial Quote */}
                <div className="p-3.5 rounded-2xl bg-cream border-2 border-dark text-xs font-medium text-dark/90 leading-relaxed">
                  <span className="text-coral font-bold font-mono">“</span>Booked Maya for a 35mm street walk in North Calcutta. Zero pressure, no awkward vibes, got incredible flat whites and film photos. 10/10!
                  <span className="text-coral font-bold font-mono">”</span>
                  <div className="mt-1.5 text-[10px] font-mono font-extrabold text-cobalt uppercase">
                    — Tiyasha D. · Salt Lake
                  </div>
                </div>
              </div>

              {/* Safety & Trust Mini-Pills */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono font-bold">
                <div className="p-3 rounded-2xl bg-lime/30 border-2 border-dark flex items-center gap-2">
                  <ShieldCheck size={18} className="text-dark shrink-0" />
                  <span>EMAIL OTP • VERIFIED</span>
                </div>
                <div className="p-3 rounded-2xl bg-lavender/40 border-2 border-dark flex items-center gap-2">
                  <Lock size={18} className="text-dark shrink-0" />
                  <span>PASSWORD LOGIN READY</span>
                </div>
              </div>

            </div>

            {/* ── Right Column: Interactive Auth Card ── */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-[2.5rem] border-4 border-dark shadow-[10px_10px_0px_#171717] p-6 sm:p-8 md:p-10 relative overflow-hidden">
                
                {/* Top Card Tape Accent */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-yellow-300 text-dark px-6 py-0.5 text-[10px] font-mono font-black uppercase tracking-widest border border-dark rotate-[-1deg] shadow-sm">
                  ✦ COMPANION ACCESS PORTAL ✦
                </div>

                {/* Success Celebration View */}
                <AnimatePresence mode="wait">
                  {isSuccess ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="py-12 text-center space-y-6"
                    >
                      <div className="w-24 h-24 mx-auto rounded-full bg-lime border-4 border-dark flex items-center justify-center shadow-[6px_6px_0px_#171717] rotate-[-4deg]">
                        <Sparkles size={48} className="text-dark animate-bounce" />
                      </div>

                      <div className="space-y-2">
                        <span className="sticker bg-coral text-white text-xs">
                          {authMode === "signup" ? "WELCOME TO THE CREW" : "AUTHENTICATED"}
                        </span>
                        <h2 className="font-display text-4xl sm:text-5xl font-extrabold uppercase text-dark tracking-tight">
                          {successHeadline || "YOU'RE IN, LEGEND! 🎉"}
                        </h2>
                        <p className="font-editorial text-xl text-dark/80 max-w-md mx-auto">
                          {authMode === "signup"
                            ? "Your profile has been saved and verified in the Neon database. Instant access granted."
                            : "You have signed in successfully with your password. Welcome back!"}
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-[#FFF4DF] border-3 border-dark text-left max-w-md mx-auto space-y-2.5">
                        <div className="flex items-center gap-2 text-xs font-mono font-bold text-dark">
                          <CheckCircle2 size={16} className="text-cobalt" />
                          <span>Account: {email}</span>
                        </div>
                        {role === "companion" && authMode === "signup" && (
                          <div className="flex items-center gap-2 text-xs font-mono font-bold text-dark">
                            <CheckCircle2 size={16} className="text-cobalt" />
                            <span>Companion Hourly Rate Set: ₹{hourlyRate}/hr</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-xs font-mono font-bold text-dark">
                          <CheckCircle2 size={16} className="text-cobalt" />
                          <span>Direct Password Login Active</span>
                        </div>
                      </div>

                      <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                          href="/profile"
                          className="px-6 py-4 rounded-full bg-dark text-lime font-display font-black text-sm uppercase tracking-wider border-2 border-dark shadow-[4px_4px_0px_#171717] hover:bg-coral hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                          <span>GO TO MY PROFILE & ID VERIFICATION</span>
                          <ArrowRight size={16} />
                        </Link>
                        <Link
                          href="/profile?tab=explore"
                          className="px-6 py-4 rounded-full bg-lime text-dark font-display font-black text-sm uppercase tracking-wider border-2 border-dark shadow-[4px_4px_0px_#171717] hover:bg-white transition-all flex items-center justify-center gap-2"
                        >
                          <span>BROWSE OTHER PROFILES</span>
                          <Sparkles size={16} />
                        </Link>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="pt-4 space-y-6">

                      {/* Mode Selector Tabs (Sign Up vs Log In) */}
                      <div className="flex p-1.5 rounded-2xl bg-cream border-3 border-dark shadow-[3px_3px_0px_#171717]">
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode("signup");
                            setOtpSent(false);
                            setErrorMessage(null);
                          }}
                          className={`flex-1 py-3 rounded-xl font-display font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer ${
                            authMode === "signup"
                              ? "bg-coral text-white border-2 border-dark shadow-[3px_3px_0px_#171717] scale-[1.02]"
                              : "text-dark/70 hover:text-dark hover:bg-white/50"
                          }`}
                        >
                          ✦ JOIN THE CREW (SIGN UP)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode("login");
                            setOtpSent(false);
                            setErrorMessage(null);
                          }}
                          className={`flex-1 py-3 rounded-xl font-display font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer ${
                            authMode === "login"
                              ? "bg-dark text-lime border-2 border-dark shadow-[3px_3px_0px_#171717] scale-[1.02]"
                              : "text-dark/70 hover:text-dark hover:bg-white/50"
                          }`}
                        >
                          WELCOME BACK (LOG IN)
                        </button>
                      </div>

                      {/* Role Selector Pill (Signup Only) */}
                      {authMode === "signup" && (
                        <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-lavender/30 border-2 border-dark">
                          <div className="text-xs">
                            <span className="font-display font-extrabold text-dark uppercase block">
                              I WANT TO:
                            </span>
                            <span className="font-mono text-[11px] text-dark/70">
                              {role === "seeker"
                                ? "Book verified companions for hangs"
                                : "Become a verified companion & get booked"}
                            </span>
                          </div>
                          <div className="flex gap-1.5 bg-white p-1 rounded-xl border border-dark">
                            <button
                              type="button"
                              onClick={() => setRole("seeker")}
                              className={`px-3 py-1.5 rounded-lg text-xs font-display font-bold uppercase transition-all cursor-pointer ${
                                role === "seeker"
                                  ? "bg-lime text-dark border border-dark shadow-sm"
                                  : "text-dark/60 hover:text-dark"
                              }`}
                            >
                              EXPLORE HANGS
                            </button>
                            <button
                              type="button"
                              onClick={() => setRole("companion")}
                              className={`px-3 py-1.5 rounded-lg text-xs font-display font-bold uppercase transition-all cursor-pointer ${
                                role === "companion"
                                  ? "bg-hotpink text-white border border-dark shadow-sm"
                                  : "text-dark/60 hover:text-dark"
                              }`}
                            >
                              BE COMPANION
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Error Banner */}
                      {errorMessage && (
                        <div className="p-3 rounded-xl bg-red-100 border-2 border-red-500 text-red-800 text-xs font-mono font-bold flex items-center justify-between">
                          <span>⚠️ {errorMessage}</span>
                          <button
                            type="button"
                            onClick={() => setErrorMessage(null)}
                            className="text-red-800 hover:text-red-950 font-black px-1 cursor-pointer"
                          >
                            ×
                          </button>
                        </div>
                      )}

                      {/* ══════════════════════════════════════════════
                          MODE 1: LOG IN WITH PASSWORD (NO OTP NEEDED)
                          ══════════════════════════════════════════════ */}
                      {authMode === "login" ? (
                        <form onSubmit={handlePasswordLogin} className="space-y-4">
                          {/* Email Input */}
                          <div>
                            <label className="block text-xs font-display font-extrabold uppercase text-dark tracking-wider mb-1.5">
                              EMAIL ADDRESS <span className="text-coral">*</span>
                            </label>
                            <div className="relative">
                              <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#FFF4DF] border-2 border-dark font-mono font-bold text-dark placeholder:text-dark/40 focus:outline-none focus:ring-2 focus:ring-cobalt shadow-[2px_2px_0px_#171717]"
                              />
                              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/50" />
                            </div>
                          </div>

                          {/* Password Input */}
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <label className="block text-xs font-display font-extrabold uppercase text-dark tracking-wider">
                                PASSWORD <span className="text-coral">*</span>
                              </label>
                              <span className="text-[11px] font-mono text-dark/60">
                                Direct login • No OTP required
                              </span>
                            </div>
                            <div className="relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••••"
                                className="w-full pl-11 pr-11 py-3 rounded-2xl bg-[#FFF4DF] border-2 border-dark font-mono font-bold text-dark placeholder:text-dark/40 focus:outline-none focus:ring-2 focus:ring-cobalt shadow-[2px_2px_0px_#171717]"
                              />
                              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/50" />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-dark/60 hover:text-dark p-1 cursor-pointer"
                              >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                          </div>

                          {/* Login CTA Button */}
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full mt-4 py-4 rounded-2xl bg-dark text-lime font-display font-black text-sm uppercase tracking-wider border-3 border-dark shadow-[4px_4px_0px_#FF5C5C] hover:bg-coral hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                          >
                            {isSubmitting ? (
                              <div className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-lime border-t-transparent rounded-full animate-spin" />
                                <span>LOGGING IN...</span>
                              </div>
                            ) : (
                              <>
                                <span>LOG IN WITH PASSWORD →</span>
                                <Zap size={16} />
                              </>
                            )}
                          </button>
                        </form>
                      ) : !otpSent ? (
                        /* ══════════════════════════════════════════════
                           MODE 2: SIGN UP WITH PASSWORD + EMAIL VERIFY
                           ══════════════════════════════════════════════ */
                        <form onSubmit={handleSignUpInit} className="space-y-4">
                          {/* Name & Age Row */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="sm:col-span-2">
                              <label className="block text-xs font-display font-extrabold uppercase text-dark tracking-wider mb-1.5">
                                YOUR NAME / NICKNAME <span className="text-coral">*</span>
                              </label>
                              <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Joy or Rhea"
                                className="w-full px-4 py-3 rounded-2xl bg-[#FFF4DF] border-2 border-dark font-display font-bold text-dark placeholder:text-dark/40 focus:outline-none focus:ring-2 focus:ring-cobalt shadow-[2px_2px_0px_#171717]"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-display font-extrabold uppercase text-dark tracking-wider mb-1.5">
                                AGE (18+) <span className="text-coral">*</span>
                              </label>
                              <input
                                type="number"
                                min={18}
                                max={99}
                                required
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                className="w-full px-4 py-3 rounded-2xl bg-[#FFF4DF] border-2 border-dark font-mono font-bold text-dark focus:outline-none focus:ring-2 focus:ring-cobalt shadow-[2px_2px_0px_#171717]"
                              />
                            </div>
                          </div>

                          {/* Email Input */}
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <label className="block text-xs font-display font-extrabold uppercase text-dark tracking-wider">
                                EMAIL ADDRESS <span className="text-coral">*</span>
                              </label>
                              <span className="text-[11px] font-mono text-dark/60 font-semibold">
                                ✉️ Verified via OTP below
                              </span>
                            </div>
                            <div className="relative">
                              <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#FFF4DF] border-2 border-dark font-mono font-bold text-dark placeholder:text-dark/40 focus:outline-none focus:ring-2 focus:ring-cobalt shadow-[2px_2px_0px_#171717]"
                              />
                              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/50" />
                            </div>
                          </div>

                          {/* Password Input (Set during signup for future logins) */}
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <label className="block text-xs font-display font-extrabold uppercase text-dark tracking-wider">
                                CREATE PASSWORD <span className="text-coral">*</span>
                              </label>
                              <span className="text-[11px] font-mono text-dark/60">
                                Use for instant future logins
                              </span>
                            </div>
                            <div className="relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                required
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Minimum 6 characters"
                                className="w-full pl-11 pr-11 py-3 rounded-2xl bg-[#FFF4DF] border-2 border-dark font-mono font-bold text-dark placeholder:text-dark/40 focus:outline-none focus:ring-2 focus:ring-cobalt shadow-[2px_2px_0px_#171717]"
                              />
                              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/50" />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-dark/60 hover:text-dark p-1 cursor-pointer"
                              >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                          </div>

                          {/* ── COMPANION HOURLY RATE TEXT FIELD (Shown when role is 'companion') ── */}
                          {role === "companion" && (
                            <motion.div
                              initial={{ opacity: 0, y: -6 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-4 rounded-2xl bg-hotpink/10 border-3 border-dark shadow-[3px_3px_0px_#171717] space-y-2.5"
                            >
                              <div className="flex items-center justify-between">
                                <label className="block text-xs font-display font-black uppercase text-dark tracking-wider">
                                  YOUR HOURLY RATE (₹ / HOUR) <span className="text-coral">*</span>
                                </label>
                                <span className="text-[11px] font-mono font-black text-hotpink uppercase bg-white px-2 py-0.5 rounded border border-dark">
                                  YOU KEEP 100%
                                </span>
                              </div>

                              <div className="flex gap-2 items-center">
                                <div className="relative flex-1">
                                  <input
                                    type="number"
                                    min={100}
                                    step={50}
                                    required
                                    value={hourlyRate}
                                    onChange={(e) => setHourlyRate(e.target.value)}
                                    placeholder="599"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border-2 border-dark font-mono font-black text-lg text-dark focus:outline-none focus:ring-2 focus:ring-hotpink shadow-sm"
                                  />
                                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold font-mono text-dark text-base">
                                    ₹
                                  </span>
                                </div>

                                {/* Preset quick chips */}
                                <div className="flex gap-1">
                                  {PRESET_RATES.map((rate) => (
                                    <button
                                      key={rate}
                                      type="button"
                                      onClick={() => setHourlyRate(rate)}
                                      className={`px-2.5 py-3 rounded-xl text-xs font-mono font-black border border-dark transition-all cursor-pointer ${
                                        hourlyRate === rate
                                          ? "bg-hotpink text-white shadow-sm scale-105"
                                          : "bg-white text-dark hover:bg-cream"
                                      }`}
                                    >
                                      ₹{rate}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <p className="text-[11px] font-mono text-dark/70">
                                Kolkata companions typically set ₹400 – ₹1,500 / hr depending on experience and activities.
                              </p>
                            </motion.div>
                          )}

                          {/* City Selector */}
                          <div>
                            <label className="block text-xs font-display font-extrabold uppercase text-dark tracking-wider mb-1.5">
                              YOUR CITY <span className="text-coral">*</span>
                            </label>
                            <select
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              className="w-full px-4 py-3 rounded-2xl bg-[#FFF4DF] border-2 border-dark font-display font-bold text-dark focus:outline-none focus:ring-2 focus:ring-cobalt shadow-[2px_2px_0px_#171717] cursor-pointer"
                            >
                              <option value="Kolkata">🌆 Kolkata (Active Social Hub)</option>
                              <option value="Mumbai">🏙️ Mumbai (Expanding Soon)</option>
                              <option value="Bengaluru">☕ Bengaluru (Expanding Soon)</option>
                              <option value="Delhi">🏛️ Delhi NCR (Expanding Soon)</option>
                            </select>
                          </div>

                          {/* ── EXPANDED VIBES SELECTOR ── */}
                          <div className="pt-2 border-t-2 border-dark/10 space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <label className="block text-xs font-display font-extrabold uppercase text-dark tracking-wider">
                                  PICK YOUR VIBES ({selectedVibes.length} SELECTED)
                                </label>
                                <p className="text-[11px] font-mono text-dark/70">
                                  Matches you with companions who share your taste
                                </p>
                              </div>

                              {/* Dynamic Resonance Pill */}
                              <div className="px-3 py-1 rounded-full bg-cream border border-dark text-[11px] font-mono font-extrabold flex items-center gap-1.5 shadow-sm">
                                <Flame size={13} className="text-coral" />
                                <span className={match.color}>{match.percent}% MATCH</span>
                              </div>
                            </div>

                            {/* Vibe Category Filter Pills */}
                            <div className="flex flex-wrap gap-1.5">
                              {[
                                { id: "all", label: `ALL (${ALL_VIBES.length})` },
                                { id: "food", label: "☕ FOOD & CAFES" },
                                { id: "culture", label: "🎨 ARTS & FILM" },
                                { id: "music", label: "🎵 MUSIC & NIGHT" },
                                { id: "deep", label: "✨ DEEP & CHILL" },
                              ].map((cat) => (
                                <button
                                  key={cat.id}
                                  type="button"
                                  onClick={() => setActiveCategory(cat.id as VibeCategory)}
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-display font-bold uppercase transition-all cursor-pointer ${
                                    activeCategory === cat.id
                                      ? "bg-dark text-lime border border-dark"
                                      : "bg-cream text-dark/70 hover:bg-white hover:text-dark border border-dark/20"
                                  }`}
                                >
                                  {cat.label}
                                </button>
                              ))}
                            </div>

                            {/* Vibe Tags Grid */}
                            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1 py-1">
                              {filteredVibes.map((vibe) => {
                                const isSelected = selectedVibes.includes(vibe.id);
                                return (
                                  <button
                                    key={vibe.id}
                                    type="button"
                                    onClick={() => toggleVibe(vibe.id)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-display font-bold border-2 border-dark transition-all flex items-center gap-1.5 cursor-pointer ${
                                      isSelected
                                        ? `${vibe.color} scale-105 shadow-[2px_2px_0px_#171717]`
                                        : "bg-cream text-dark/80 hover:bg-white hover:translate-x-0.5"
                                    }`}
                                  >
                                    <span>{vibe.emoji}</span>
                                    <span>{vibe.label}</span>
                                    {isSelected && <Check size={12} className="stroke-[3]" />}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Vibe Meter Feedback */}
                            <div className="p-2.5 rounded-xl bg-lime/20 border border-dark text-[11px] font-mono font-bold text-dark flex items-center justify-between">
                              <span>{match.label}</span>
                              <span className="text-[10px] uppercase font-mono text-cobalt font-extrabold">
                                {selectedVibes.length} VIBES SAVED
                              </span>
                            </div>
                          </div>

                          {/* Submit CTA Button */}
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full mt-4 py-4 rounded-2xl bg-coral text-white font-display font-black text-sm uppercase tracking-wider border-3 border-dark shadow-[4px_4px_0px_#171717] hover:bg-dark hover:text-lime hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                          >
                            {isSubmitting ? (
                              <div className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>SENDING VERIFICATION CODE...</span>
                              </div>
                            ) : (
                              <>
                                <span>VERIFY EMAIL & CREATE ACCOUNT →</span>
                                <Zap size={16} />
                              </>
                            )}
                          </button>
                        </form>
                      ) : (
                        /* ══════════════════════════════════════════════
                           MODE 3: SIGN UP EMAIL OTP VERIFICATION STEP
                           ══════════════════════════════════════════════ */
                        <form onSubmit={handleVerifyOtpAndRegister} className="space-y-6 pt-2">
                          <div className="text-center space-y-1.5">
                            <span className="sticker bg-lime text-dark text-xs">
                              ✦ VERIFY EMAIL TO COMPLETE REGISTRATION
                            </span>
                            <h3 className="font-display text-2xl sm:text-3xl font-black text-dark uppercase">
                              ENTER 6-DIGIT EMAIL CODE
                            </h3>
                            <p className="font-mono text-xs text-dark/80">
                              We sent a verification code to <strong className="text-cobalt">{email}</strong>
                            </p>
                          </div>

                          {/* Development preview OTP badge for quick test */}
                          {previewOtp && (
                            <div className="p-2.5 rounded-xl bg-yellow-100 border-2 border-dark text-xs font-mono font-bold text-dark flex items-center justify-between shadow-sm">
                              <span>⚡ Dev Preview OTP: <strong>{previewOtp}</strong></span>
                              <button
                                type="button"
                                onClick={() => setOtpCode(previewOtp.split(""))}
                                className="px-2 py-0.5 rounded bg-dark text-lime text-[11px] font-mono uppercase cursor-pointer"
                              >
                                Auto-Fill
                              </button>
                            </div>
                          )}

                          {/* 6 Digit OTP Inputs */}
                          <div className="flex justify-center gap-2 sm:gap-3" onPaste={handleOtpPaste}>
                            {otpCode.map((digit, i) => (
                              <input
                                key={i}
                                id={`otp-${i}`}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(i, e.target.value)}
                                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                className="w-11 sm:w-13 h-14 text-center rounded-2xl bg-[#FFF4DF] border-3 border-dark font-display font-black text-xl text-dark focus:outline-none focus:ring-3 focus:ring-cobalt shadow-[3px_3px_0px_#171717]"
                              />
                            ))}
                          </div>

                          {/* Resend & Change Email Row */}
                          <div className="flex items-center justify-between text-xs font-mono">
                            <button
                              type="button"
                              onClick={() => {
                                setOtpSent(false);
                                setErrorMessage(null);
                              }}
                              className="text-dark/70 hover:text-coral underline font-bold cursor-pointer"
                            >
                              ← Edit registration details
                            </button>

                            {canResend ? (
                              <button
                                type="button"
                                onClick={handleSignUpInit}
                                className="text-cobalt hover:text-dark font-extrabold flex items-center gap-1 cursor-pointer"
                              >
                                <RotateCcw size={12} />
                                <span>Resend Code</span>
                              </button>
                            ) : (
                              <span className="text-dark/60 font-semibold">
                                Resend in {resendTimer}s
                              </span>
                            )}
                          </div>

                          {/* Final Confirm Button */}
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 rounded-2xl bg-lime text-dark font-display font-black text-sm uppercase tracking-wider border-3 border-dark shadow-[4px_4px_0px_#171717] hover:bg-dark hover:text-lime transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                          >
                            {isSubmitting ? (
                              <div className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-dark border-t-transparent rounded-full animate-spin" />
                                <span>ACTIVATING IN NEON...</span>
                              </div>
                            ) : (
                              <>
                                <span>VERIFY & FINALIZE ACCOUNT</span>
                                <ArrowRight size={16} />
                              </>
                            )}
                          </button>
                        </form>
                      )}

                      {/* One-Click Social Divider */}
                      <div className="pt-2">
                        <div className="relative flex py-2 items-center">
                          <div className="flex-grow border-t-2 border-dark/15"></div>
                          <span className="flex-shrink mx-4 text-[10px] font-mono uppercase tracking-widest text-dark/60 font-bold bg-white px-2">
                            OR ONE-CLICK SOCIAL ACCESS
                          </span>
                          <div className="flex-grow border-t-2 border-dark/15"></div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-3">
                          <button
                            type="button"
                            onClick={() => {
                              setName("Google User");
                              setEmail("google.user@example.com");
                              setSuccessHeadline("LOGGED IN WITH GOOGLE! 🚀");
                              setIsSuccess(true);
                            }}
                            className="py-3 px-4 rounded-2xl bg-cream hover:bg-[#FFF4DF] border-2 border-dark font-display font-bold text-xs uppercase flex items-center justify-center gap-2 shadow-[2px_2px_0px_#171717] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
                          >
                            <span>🔴 GOOGLE</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setName("Apple User");
                              setEmail("apple.user@example.com");
                              setSuccessHeadline("LOGGED IN WITH APPLE ID! 🍎");
                              setIsSuccess(true);
                            }}
                            className="py-3 px-4 rounded-2xl bg-cream hover:bg-[#FFF4DF] border-2 border-dark font-display font-bold text-xs uppercase flex items-center justify-center gap-2 shadow-[2px_2px_0px_#171717] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
                          >
                            <span> APPLE ID</span>
                          </button>
                        </div>
                      </div>

                      {/* Safety Microcopy Footer */}
                      <div className="pt-4 border-t-2 border-dark/10 text-center">
                        <p className="text-[11px] font-mono text-dark/70">
                          By proceeding, you verify you are 18+ and accept our{" "}
                          <span className="underline font-bold text-dark">Zero-Harassment Code</span> &{" "}
                          <span className="underline font-bold text-dark">Platonic Privacy Safeguards</span>.
                        </p>
                      </div>

                    </div>
                  )}
                </AnimatePresence>

              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Marquee Footer Band */}
      <div className="relative z-20 border-t-3 border-dark bg-lime py-2.5 overflow-hidden whitespace-nowrap shrink-0">
        <div className="animate-marquee font-display font-extrabold text-xs md:text-sm tracking-widest text-dark uppercase flex gap-8">
          <span>✦ 100% EMAIL OTP VERIFIED</span>
          <span>✦ NO DATING WEIRDNESS</span>
          <span>✦ REAL CONVERSATIONS</span>
          <span>✦ KOLKATA CULTURE FIRST</span>
          <span>✦ DIRECT PASSWORD LOGIN</span>
          <span>✦ 100% EMAIL OTP VERIFIED</span>
          <span>✦ NO DATING WEIRDNESS</span>
          <span>✦ REAL CONVERSATIONS</span>
          <span>✦ KOLKATA CULTURE FIRST</span>
        </div>
      </div>
    </main>
  );
}
