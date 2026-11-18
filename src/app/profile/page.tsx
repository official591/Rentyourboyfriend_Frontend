"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  ShieldAlert,
  Shield,
  Upload,
  Camera,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  AlertTriangle,
  User,
  Mail,
  MapPin,
  Calendar,
  IndianRupee,
  Star,
  Eye,
  FileText,
  Clock,
  Check,
  Flame,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  LogOut,
  X,
  Search,
  Filter,
  Trash2,
  Loader2,
  Crown,
} from "lucide-react";
import { useRazorpay, PaymentStatus } from "@/hooks/useRazorpay";
import TierBadge from "@/components/TierBadge";
import TierGate from "@/components/TierGate";
import InvoiceModal, { InvoiceData } from "@/components/InvoiceModal";
import { cachedFetch } from "@/lib/cache";
import { getApiUrl } from "@/lib/apiConfig";

interface ProfileData {
  id: string;
  email: string;
  full_name: string;
  display_name: string;
  age: number;
  city: string;
  bio?: string;
  avatar_url?: string;
  vibe_tags?: string[];
  is_companion?: boolean;
  hourly_rate?: number;
  verification_status?: "unverified" | "pending_review" | "verified" | "rejected";
  membership_tier?: "free" | "basic" | "premium" | "vip" | string;
  tier_started_at?: string;
  tier_expires_at?: string;
  id_document_path?: string;
  selfie_path?: string;
  rating?: number;
}

interface CompanionProfile {
  id: string;
  email: string;
  full_name: string;
  display_name: string;
  age: number;
  city: string;
  bio: string;
  avatar_url: string;
  vibe_tags: string[];
  hourly_rate: number;
  verification_status: string;
  rating: number;
}

interface ProfileUpdatePayload extends Partial<ProfileData> {
  avatarUrl?: string;
  hourlyRate?: number;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"profile" | "explore">("profile");
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [companions, setCompanions] = useState<CompanionProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Search & Filter for Explore Tab
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVibeFilter, setSelectedVibeFilter] = useState("all");

  // ID Upload State
  const [idType, setIdType] = useState<"aadhaar" | "dl" | "passport">("aadhaar");
  const [idFilePreview, setIdFilePreview] = useState<string | null>(null);
  const [idFileName, setIdFileName] = useState<string | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [selfieName, setSelfieName] = useState<string | null>(null);

  // Avatar Upload State
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const idFileInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);

  // Camera Live Capture Modal State
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [cameraTarget, setCameraTarget] = useState<"id" | "selfie" | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Booking Restriction Modal & Companion Detail Modal
  const [restrictionModalOpen, setRestrictionModalOpen] = useState(false);
  const [selectedCompanionForBooking, setSelectedCompanionForBooking] = useState<CompanionProfile | null>(null);
  const [viewCompanionModal, setViewCompanionModal] = useState<CompanionProfile | null>(null);
  const [bookingSuccessModal, setBookingSuccessModal] = useState(false);

  // Companion Booking Payment State (Razorpay)
  const [bookingLoadingId, setBookingLoadingId] = useState<string | null>(null);
  const [lastPaymentInfo, setLastPaymentInfo] = useState<{
    payment_id: string;
    order_id: string;
    amount: number;
    companionName: string;
  } | null>(null);
  const [bookingPaymentToast, setBookingPaymentToast] = useState<{
    status: PaymentStatus;
    message: string;
  } | null>(null);

  // Account Deletion State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string | null>(null);

  // Tax Invoice Modal State (Item 5)
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<InvoiceData | null>(null);
  const [invoiceLoading, setInvoiceLoading] = useState(false);

  const handleOpenLatestInvoice = async () => {
    if (!profile?.email) return;
    setInvoiceLoading(true);
    try {
      const res = await fetch(`/api/invoices?email=${encodeURIComponent(profile.email)}`);
      const data = await res.json();
      if (res.ok && data.invoices && data.invoices.length > 0) {
        setCurrentInvoice(data.invoices[0]);
        setInvoiceModalOpen(true);
      } else {
        // Fallback invoice constructed from current active tier
        const now = new Date();
        const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
        setCurrentInvoice({
          invoice_number: `INV-${dateStr}-ACT1`,
          user_email: profile.email,
          tier: profile.membership_tier || "basic",
          amount_paise:
            profile.membership_tier === "vip"
              ? 149900
              : profile.membership_tier === "premium"
                ? 69900
                : 29900,
          verified_at: profile.tier_started_at || new Date().toISOString(),
        });
        setInvoiceModalOpen(true);
      }
    } catch (e) {
      console.error("Failed to load invoice:", e);
    } finally {
      setInvoiceLoading(false);
    }
  };

  // Load user from localStorage or API
  useEffect(() => {
    async function loadData() {
      try {
        // Detect tab from URL parameter if present (?tab=explore)
        if (typeof window !== "undefined") {
          const params = new URLSearchParams(window.location.search);
          if (params.get("tab") === "explore") {
            setActiveTab("explore");
          }
        }

        const stored = typeof window !== "undefined" ? localStorage.getItem("companion_user") : null;
        let userEmail = "joy.companion@gmail.com";

        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed.email) userEmail = parsed.email;
          } catch (e) {
            console.error("Local storage parse error:", e);
          }
        }

        // Fetch user profile from Neon
        const profileRes = await fetch(`/api/profile?email=${encodeURIComponent(userEmail)}`);
        const profileData = await profileRes.json();

        if (profileRes.ok && profileData.profile) {
          const resolvedTier = (profileData.profile.membership_tier || "free").toLowerCase();
          // Sync localStorage so any previous stale VIP badge is removed immediately
          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              parsed.membership_tier = resolvedTier;
              localStorage.setItem("companion_user", JSON.stringify(parsed));
            } catch (e) {}
          }
          setProfile({
            ...profileData.profile,
            membership_tier: resolvedTier,
          });
          if (profileData.profile.avatar_url) setAvatarPreview(profileData.profile.avatar_url);
          if (profileData.profile.id_document_path) setIdFilePreview(profileData.profile.id_document_path);
          if (profileData.profile.selfie_path) setSelfiePreview(profileData.profile.selfie_path);
        } else {
          // Default fallback profile for new sessions - reset to free
          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              parsed.membership_tier = "free";
              localStorage.setItem("companion_user", JSON.stringify(parsed));
            } catch (e) {}
          }
          setProfile({
            id: "user_default",
            email: userEmail,
            full_name: "Joy Banerjee",
            display_name: "Joy",
            age: 23,
            city: "Kolkata",
            bio: "Film photography buff & coffee nerd. Looking for chill hangs in South Calcutta.",
            avatar_url: "/images/portrait-rohan.jpg",
            vibe_tags: ["flat-whites", "photo-walks", "deep-talks"],
            is_companion: false,
            hourly_rate: 0,
            verification_status: "unverified",
            membership_tier: "free",
            rating: 5.0,
          });
          setAvatarPreview("/images/portrait-rohan.jpg");
        }

        // Fetch other companion profiles from Neon with browser caching (SWR)
        const compData = await cachedFetch<{ success: boolean; companions: CompanionProfile[] }>(
          "/api/companions",
          120_000,
          (fresh) => {
            if (fresh?.companions) setCompanions(fresh.companions);
          }
        ).catch(() => null);

        if (compData && compData.companions) {
          setCompanions(compData.companions);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  // Handle Avatar Change
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setAvatarPreview(base64);
        saveProfileUpdate({ avatarUrl: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle ID Document Upload via File Picker
  const handleIdDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIdFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Selfie Upload via File Picker
  const handleSelfieChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelfieName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelfiePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Open Live Camera to Click Govt ID Proof or Selfie
  const openCameraCapture = async (target: "id" | "selfie") => {
    setCameraTarget(target);
    setCameraModalOpen(true);
    setCameraError(null);

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: target === "id" ? { ideal: "environment" } : "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCameraStream(stream);

      // Attach stream to video element
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch((e) => console.log("Video play error:", e));
        }
      }, 100);
    } catch (err: unknown) {
      console.error("Camera access error:", err);
      setCameraError(
        "Camera access was blocked or not supported on this browser. You can still upload your ID file using the attachment button below!"
      );
    }
  };

  // Close Live Camera
  const closeCameraCapture = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setCameraModalOpen(false);
    setCameraTarget(null);
    setCameraError(null);
  };

  // Snap Frame from Camera to Canvas
  const handleSnapPhoto = () => {
    if (!videoRef.current || !canvasRef.current || !cameraTarget) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);

    if (cameraTarget === "id") {
      setIdFilePreview(dataUrl);
      setIdFileName(`Govt_ID_${idType.toUpperCase()}_Snapped.jpg`);
      setSuccessMessage(`Snapped photo of your ${idType.toUpperCase()} successfully!`);
    } else {
      setSelfiePreview(dataUrl);
      setSelfieName("Live_Selfie_Snapped.jpg");
      setSuccessMessage("Snapped live verification selfie successfully!");
    }

    closeCameraCapture();
  };

  // Submit ID for Verification
  const handleSubmitVerification = async () => {
    if (!profile) return;
    setSaveLoading(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: profile.email,
          idDocumentPath: idFilePreview || "id_submitted.jpg",
          selfiePath: selfiePreview || "selfie_submitted.jpg",
          verificationStatus: "pending_review",
        }),
      });

      const data = await res.json();
      if (res.ok && data.profile) {
        setProfile(data.profile);
        setSuccessMessage("Govt ID & selfie submitted for review! Your status is now PENDING REVIEW.");
      }
    } catch (err) {
      console.error("Failed to submit verification:", err);
    } finally {
      setSaveLoading(false);
    }
  };

  // Quick Dev Toggle for testing Verified vs Unverified states
  const handleToggleVerificationDev = async () => {
    if (!profile) return;
    const nextStatus = profile.verification_status === "verified" ? "unverified" : "verified";
    setSaveLoading(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: profile.email,
          verificationStatus: nextStatus,
        }),
      });

      const data = await res.json();
      if (res.ok && data.profile) {
        setProfile(data.profile);
        setSuccessMessage(`Account status changed to: ${nextStatus.toUpperCase()}`);
      }
    } catch (err) {
      console.error("Failed to toggle verification:", err);
    } finally {
      setSaveLoading(false);
    }
  };

  // Permanently delete account and all records from database
  const handleDeleteAccount = async () => {
    if (!profile) return;
    if (deleteConfirmationText.trim().toUpperCase() !== "DELETE") {
      setDeleteErrorMessage("Please type DELETE to confirm account removal.");
      return;
    }

    setDeleteLoading(true);
    setDeleteErrorMessage(null);

    try {
      const res = await fetch("/api/profile", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: profile.email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete account");
      }

      // Clear session from browser
      if (typeof window !== "undefined") {
        localStorage.removeItem("companion_user");
      }

      alert("Your account and all associated records have been permanently deleted from the database.");
      window.location.href = "/";
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Deletion failed";
      setDeleteErrorMessage(message);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Save profile updates (bio, hourly rate, avatar, etc.)
  const saveProfileUpdate = async (updates: ProfileUpdatePayload) => {
    if (!profile) return;
    setSaveLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: profile.email,
          name: updates.full_name || updates.display_name,
          bio: updates.bio,
          avatarUrl: updates.avatarUrl || updates.avatar_url,
          hourlyRate: updates.hourlyRate ?? updates.hourly_rate,
          verificationStatus: updates.verification_status,
          idDocumentPath: updates.id_document_path,
          selfiePath: updates.selfie_path,
        }),
      });
      const data = await res.json();
      if (res.ok && data.profile) {
        setProfile(data.profile);
      }
    } catch (err) {
      console.error("Failed to save profile:", err);
    } finally {
      setSaveLoading(false);
    }
  };

  // Razorpay Checkout Hook for Companion Hang Bookings
  const {
    pay: triggerRazorpayPayment,
    status: paymentStatus,
    error: paymentError,
    reset: resetPayment,
  } = useRazorpay({
    name: "COMPANION HANGOUT",
    description: "Verified Companion Hang Booking",
    themeColor: "#171717",
    onSuccess: (data) => {
      if (selectedCompanionForBooking) {
        setLastPaymentInfo({
          payment_id: data.payment_id,
          order_id: data.order_id,
          amount: selectedCompanionForBooking.hourly_rate || 500,
          companionName: selectedCompanionForBooking.full_name || selectedCompanionForBooking.display_name,
        });
        setBookingSuccessModal(true);
      }
      setBookingLoadingId(null);
      setBookingPaymentToast({
        status: "success",
        message: `Payment verified! Outing scheduled with ${selectedCompanionForBooking?.display_name || "companion"}.`,
      });
    },
    onError: (err) => {
      setBookingLoadingId(null);
      setBookingPaymentToast({
        status: "error",
        message: err || "Payment failed or was cancelled.",
      });
    },
  });

  // Start Razorpay test checkout for companion hang
  const startCompanionBookingPayment = (companion: CompanionProfile) => {
    setSelectedCompanionForBooking(companion);
    setBookingLoadingId(companion.id);
    resetPayment();
    setBookingPaymentToast(null);

    // Amount in paise: e.g. ₹550/hr = 55,000 paise (min 100 paise)
    const amountInPaise = Math.max(100, (companion.hourly_rate || 500) * 100);

    triggerRazorpayPayment(
      amountInPaise,
      `hang_${companion.id}_${Date.now()}`,
      {
        name: `COMPANION // ${companion.display_name.toUpperCase()}`,
        description: `1-Hour Verified Social Hangout with ${companion.full_name} (${companion.city})`,
        prefill: {
          name: profile?.full_name || "Guest User",
          email: profile?.email || "guest@companion.com",
        },
        themeColor: "#C7F35B",
      }
    );
  };

  // Attempt to book a companion
  const handleBookCompanionClick = (companion: CompanionProfile) => {
    setSelectedCompanionForBooking(companion);
    if (!profile || profile.verification_status !== "verified") {
      // User is in Surf Mode! Show restriction modal (which includes test payment button)
      setRestrictionModalOpen(true);
    } else {
      // User is verified! Proceed to Razorpay test payment
      startCompanionBookingPayment(companion);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-dark border-t-lime rounded-full animate-spin" />
          <p className="font-display font-extrabold uppercase text-dark tracking-wider text-sm">
            Loading your companion portal...
          </p>
        </div>
      </main>
    );
  }

  const isVerified = profile?.verification_status === "verified";
  const isPending = profile?.verification_status === "pending_review";

  // Filter companions for exploration
  const filteredCompanions = companions.filter((comp) => {
    const matchesSearch =
      comp.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.vibe_tags.some((v) => v.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (selectedVibeFilter === "all") return true;
    return comp.vibe_tags.some((v) => v.toLowerCase().includes(selectedVibeFilter));
  });

  return (
    <main className="min-h-screen bg-cream text-dark relative selection:bg-lime selection:text-dark pb-20">
      {/* Background Aesthetic Blobs */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-coral/15 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute top-1/3 left-0 w-[450px] h-[450px] bg-lime/20 rounded-full blur-3xl pointer-events-none -translate-x-1/3" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-lavender/25 rounded-full blur-3xl pointer-events-none" />

      {/* Hidden Canvas for Camera Frame Capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Top Header */}
      <header className="relative z-30 px-6 md:px-12 py-4 max-w-7xl mx-auto w-full flex items-center justify-between border-b-2 border-dark/10">
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

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-full border-2 border-dark shadow-[3px_3px_0px_#171717]">
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-1.5 rounded-full text-xs font-display font-extrabold uppercase transition-all cursor-pointer ${activeTab === "profile"
                ? "bg-dark text-lime border border-dark shadow-sm"
                : "text-dark/70 hover:text-dark hover:bg-cream"
              }`}
          >
            👤 MY PROFILE & ID
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("explore")}
            className={`px-4 py-1.5 rounded-full text-xs font-display font-extrabold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === "explore"
                ? "bg-coral text-white border border-dark shadow-sm"
                : "text-dark/70 hover:text-dark hover:bg-cream"
              }`}
          >
            <span>EXPLORE PROFILES</span>
            <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {profile?.membership_tier && profile.membership_tier !== "free" && (
            <TierBadge tier={profile.membership_tier} size="sm" className="hidden md:inline-flex" />
          )}
          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cream hover:bg-white text-dark font-display font-bold text-xs uppercase tracking-wider border-2 border-dark shadow-[2px_2px_0px_#171717] transition-all"
          >
            <span>HOME</span>
          </Link>
          <Link
            href="/auth"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-100 hover:bg-red-200 text-red-800 font-mono font-bold text-xs border border-red-400"
          >
            <LogOut size={13} />
            <span>LOGOUT</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-6">

        {/* Success Alert Banner */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl bg-lime border-3 border-dark font-display font-bold text-xs uppercase flex items-center justify-between shadow-[4px_4px_0px_#171717]"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-dark" />
              <span>{successMessage}</span>
            </div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="px-2 py-0.5 rounded bg-dark text-lime text-xs font-mono cursor-pointer"
            >
              DISMISS
            </button>
          </motion.div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            GLOBAL RESTRICTION BANNER (SURF ONLY VS VERIFIED)
            Mandatory notice: account must be verified to book companion or be a companion, otherwise user can only surf
            ════════════════════════════════════════════════════════════════ */}
        <div
          className={`mb-8 p-5 sm:p-6 rounded-3xl border-3 border-dark shadow-[6px_6px_0px_#171717] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${isVerified
              ? "bg-lime/25 border-emerald-900"
              : isPending
                ? "bg-amber-100 border-amber-800"
                : "bg-[#FFF2F2] border-red-700"
            }`}
        >
          <div className="flex items-start gap-3.5">
            <div
              className={`w-12 h-12 rounded-2xl border-2 border-dark flex items-center justify-center shrink-0 shadow-sm ${isVerified ? "bg-lime text-dark" : isPending ? "bg-amber-300 text-dark" : "bg-red-500 text-white"
                }`}
            >
              {isVerified ? (
                <ShieldCheck size={28} />
              ) : isPending ? (
                <Clock size={26} />
              ) : (
                <ShieldAlert size={28} />
              )}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-display font-black text-lg uppercase tracking-tight text-dark">
                  {isVerified
                    ? "VERIFIED MEMBER ACCOUNT • FULL OUTING & COMPANION ACCESS UNLOCKED"
                    : isPending
                      ? "GOVT ID VERIFICATION PENDING • UNDER REVIEW IN NEON VAULT"
                      : "SURF MODE ONLY • GOVT ID VERIFICATION REQUIRED TO BOOK OR BE A COMPANION"}
                </span>
                <span
                  className={`text-[10px] font-mono font-black uppercase px-2.5 py-0.5 rounded-full border border-dark ${isVerified
                      ? "bg-lime text-dark"
                      : isPending
                        ? "bg-amber-400 text-dark"
                        : "bg-red-500 text-white"
                    }`}
                >
                  {isVerified ? "100% VERIFIED" : isPending ? "PENDING REVIEW" : "SURF ONLY"}
                </span>
              </div>
              <p className="font-editorial text-sm sm:text-base text-dark/85 max-w-3xl leading-snug">
                {isVerified
                  ? "Your government identity is verified. You can book any verified companion in Kolkata, schedule city outings, and offer companion services."
                  : isPending
                    ? "Your identity documents are securely encrypted in the Neon Vault. You can surf all companion profiles in Kolkata freely while manual clearance finishes."
                    : "NOTICE: You can freely surf and browse all companion profiles. However, to book a companion or offer companion services, your account must be verified with a Government ID proof."}
              </p>
            </div>
          </div>

          {/* Quick Action Button & Dev Mode Toggle */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto shrink-0">
            {!isVerified && (
              <button
                type="button"
                onClick={() => {
                  setActiveTab("profile");
                  const elem = document.getElementById("id-vault-section");
                  elem?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-dark text-lime font-display font-black text-xs uppercase tracking-wider border-2 border-dark shadow-[3px_3px_0px_#FF5C5C] hover:bg-coral hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>CLICK / UPLOAD GOVT ID</span>
                <ArrowRight size={14} />
              </button>
            )}

            {/* Test Simulation Toggle */}
            <button
              type="button"
              onClick={handleToggleVerificationDev}
              disabled={saveLoading}
              title="Dev Tool: Toggle between Verified and Unverified Surf Mode to test both user states"
              className="w-full sm:w-auto px-3.5 py-2 rounded-full bg-cream hover:bg-white text-dark font-mono font-extrabold text-[11px] border border-dark flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <RefreshCw size={12} className={saveLoading ? "animate-spin" : ""} />
              <span>TEST TOGGLE: {isVerified ? "MAKE UNVERIFIED" : "MAKE VERIFIED"}</span>
            </button>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            TAB 1: MY PROFILE & GOVT ID VERIFICATION VAULT
            ════════════════════════════════════════════════════════════════ */}
        {activeTab === "profile" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* ── Left Column: User Card & Photo Upload ── */}
            <div className="lg:col-span-5 space-y-6">

              {/* Profile Card */}
              <div className="bg-white rounded-[2.5rem] border-4 border-dark shadow-[8px_8px_0px_#171717] p-6 sm:p-8 space-y-6 relative overflow-hidden">
                <div className="absolute top-3 right-4 bg-lime text-dark px-3 py-0.5 text-[10px] font-mono font-black uppercase border border-dark rotate-[2deg]">
                  {profile?.is_companion ? "COMPANION ACCOUNT" : "SEEKER ACCOUNT"}
                </div>

                {/* Avatar with Upload Hover */}
                <div className="flex flex-col items-center text-center space-y-3 pt-2">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-full border-4 border-dark overflow-hidden bg-cream shadow-[4px_4px_0px_#171717] relative">
                      {avatarPreview ? (
                        <Image
                          src={avatarPreview}
                          alt={profile?.full_name || "User Avatar"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-lime/40 text-dark">
                          <User size={48} />
                        </div>
                      )}
                    </div>

                    {/* Upload Overlay Button */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 rounded-full bg-dark/70 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 cursor-pointer"
                    >
                      <Camera size={22} className="text-lime" />
                      <span className="font-mono text-[10px] font-extrabold uppercase">
                        Change Photo
                      </span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <h2 className="font-display text-2xl sm:text-3xl font-black uppercase text-dark">
                        {profile?.full_name}
                      </h2>
                      {profile?.membership_tier && profile.membership_tier !== "free" && (
                        <TierBadge tier={profile.membership_tier} size="sm" />
                      )}
                    </div>
                    <p className="font-mono text-xs text-dark/70 flex items-center justify-center gap-1 pt-0.5">
                      <Mail size={12} />
                      <span>{profile?.email}</span>
                    </p>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap justify-center gap-2 pt-1">
                    <span className="sticker bg-lime text-dark text-xs">
                      📍 {profile?.city || "Kolkata"}
                    </span>
                    <span className="sticker bg-lavender text-dark text-xs">
                      🎂 {profile?.age || 22} YRS
                    </span>
                    {profile?.is_companion && (
                      <span className="sticker bg-hotpink text-white text-xs">
                        ₹{profile?.hourly_rate || 599}/HR
                      </span>
                    )}
                  </div>

                  {/* Active Membership Tier Card & Upgrade CTA */}
                  <div className="w-full mt-3 p-3.5 rounded-2xl bg-cream border-2 border-dark text-left space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-dark/60 uppercase">
                        ACTIVE MEMBERSHIP
                      </span>
                      <TierBadge tier={profile?.membership_tier || "free"} size="sm" />
                    </div>
                    <p className="text-xs font-editorial text-dark/80">
                      {profile?.membership_tier === "vip"
                        ? "👑 VIP Bespoke tier active. Unlocks all Basic & Premium features + Dedicated 1-on-1 human curator, custom secret itineraries & private chef dinners."
                        : profile?.membership_tier === "premium"
                          ? "⭐ Premium Club tier active. Unlocks all Basic features + Priority companion booking queue & concierge cafe reservations."
                          : profile?.membership_tier === "basic"
                            ? "🔰 Basic Member tier active. Unlimited companion chats & direct in-app coordination unlocked."
                            : "⚪ Free Starter tier active. Up to 3 intro pings & curated profile browsing."}
                    </p>

                    {/* Expiration date for paid tiers (Item 2) */}
                    {profile?.tier_expires_at && profile?.membership_tier !== "free" && (
                      <div className="flex items-center gap-1.5 pt-0.5 text-[11px] font-mono text-dark/70">
                        <Clock size={12} className="text-coral shrink-0" />
                        <span>
                          Valid until:{" "}
                          <strong>
                            {new Date(profile.tier_expires_at).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </strong>
                        </span>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-dark/15">
                      {profile?.membership_tier !== "vip" ? (
                        <Link
                          href="/#membership"
                          className="inline-flex items-center gap-1 text-[11px] font-display font-extrabold text-coral hover:underline uppercase"
                        >
                          <span>UPGRADE PLAN →</span>
                        </Link>
                      ) : (
                        <span className="text-[11px] font-mono text-green-700 font-bold">
                          ✓ HIGHEST TIER UNLOCKED
                        </span>
                      )}

                      {/* Download / View GST Tax Invoice (Item 5) */}
                      {profile?.membership_tier && profile.membership_tier !== "free" && (
                        <button
                          type="button"
                          onClick={handleOpenLatestInvoice}
                          disabled={invoiceLoading}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white hover:bg-dark hover:text-white text-dark font-mono text-[10px] font-bold border border-dark transition-all cursor-pointer shadow-[1px_1px_0px_#171717]"
                        >
                          <FileText size={11} />
                          <span>{invoiceLoading ? "LOADING…" : "TAX INVOICE"}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* TierGate Feature Showcase (Item 6) */}
                  <div className="w-full mt-3 space-y-2">
                    <span className="text-[10px] font-mono font-bold text-dark/60 uppercase block text-left">
                      EXCLUSIVE PERKS
                    </span>

                    <TierGate
                      requiredTier="vip"
                      mode="lock-card"
                      featureLabel="VIP Curator & Secret Itineraries"
                    >
                      <div className="p-3.5 rounded-2xl bg-coral/10 border-2 border-dark text-left space-y-1">
                        <div className="flex items-center gap-2">
                          <Crown size={16} className="text-coral" />
                          <span className="font-display font-black text-xs uppercase text-dark">
                            Secret City Itineraries & Private Chef Dinners
                          </span>
                        </div>
                        <p className="text-[11px] text-dark/80 font-editorial">
                          Unlocked! Your personal curator has prepared private South Calcutta jazz & coffee crawl passes.
                        </p>
                      </div>
                    </TierGate>
                  </div>
                </div>

                {/* Companion verification callout */}
                {profile?.is_companion && !isVerified && (
                  <div className="p-3.5 rounded-2xl bg-red-100 border-2 border-red-500 text-xs text-red-900 font-mono space-y-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      <AlertTriangle size={15} />
                      <span>COMPANION LISTING INACTIVE</span>
                    </div>
                    <p className="text-[11px] leading-snug">
                      Your companion profile cannot be booked by others until your Government ID is verified. You can only surf profiles right now.
                    </p>
                  </div>
                )}

                {/* Bio & Details */}
                <div className="p-4 rounded-2xl bg-[#FFF4DF] border-2 border-dark text-xs space-y-2">
                  <span className="font-display font-extrabold text-dark uppercase block">
                    ABOUT ME:
                  </span>
                  <p className="font-editorial text-sm text-dark/90 leading-relaxed">
                    {profile?.bio || "Exploring cool cafes, heritage spots, and underground gigs in Calcutta."}
                  </p>
                </div>

                {/* Vibe Tags */}
                <div className="space-y-2">
                  <span className="font-display font-extrabold text-xs uppercase text-dark block tracking-wider">
                    MY SAVED VIBES:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(profile?.vibe_tags && profile.vibe_tags.length > 0
                      ? profile.vibe_tags
                      : ["flat-whites", "photo-walks", "deep-talks"]
                    ).map((tag, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-full bg-cream border border-dark text-xs font-mono font-bold text-dark uppercase"
                      >
                        ✦ {tag.replace("-", " ")}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Companion Rate Setting (If Companion) */}
                {profile?.is_companion && (
                  <div className="pt-2 border-t-2 border-dark/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-display font-black uppercase text-dark">
                        SERVICE HOURLY RATE:
                      </span>
                      <span className="font-mono font-extrabold text-xs text-coral">
                        ₹{profile.hourly_rate}/hr
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min={100}
                        step={50}
                        value={profile.hourly_rate || 599}
                        onChange={(e) =>
                          setProfile({ ...profile, hourly_rate: Number(e.target.value) })
                        }
                        className="flex-1 px-3 py-2 rounded-xl bg-cream border-2 border-dark font-mono font-bold text-dark text-sm"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          saveProfileUpdate({ hourlyRate: profile.hourly_rate })
                        }
                        className="px-4 py-2 rounded-xl bg-dark text-lime font-display font-bold text-xs uppercase border-2 border-dark hover:bg-coral hover:text-white transition-all cursor-pointer"
                      >
                        SAVE RATE
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Danger Zone: Account Deletion */}
              <div className="bg-[#FFF2F2] rounded-[2rem] border-3 border-red-600 shadow-[6px_6px_0px_#171717] p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="sticker bg-red-600 text-white text-[10px]">
                    DANGER ZONE
                  </span>
                  <span className="text-xs font-mono font-black text-red-900 uppercase">
                    PERMANENT DELETION
                  </span>
                </div>
                <div className="space-y-1">
                  <h4 className="font-display font-black text-base uppercase text-red-950">
                    DELETE ACCOUNT FROM DATABASE
                  </h4>
                  <p className="font-editorial text-xs text-red-900/90 leading-snug">
                    Permanently wipe your profile, photos, Govt ID records, and authentication credentials from the entire database. This action is irreversible.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setDeleteConfirmationText("");
                    setDeleteErrorMessage(null);
                    setDeleteModalOpen(true);
                  }}
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-dark text-white font-display font-black text-xs uppercase border-2 border-dark shadow-[3px_3px_0px_#171717] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Trash2 size={15} />
                  <span>DELETE MY ACCOUNT</span>
                </button>
              </div>

            </div>

            {/* ── Right Column: Government ID Verification Vault ── */}
            <div id="id-vault-section" className="lg:col-span-7 space-y-6">

              <div className="bg-white rounded-[2.5rem] border-4 border-dark shadow-[8px_8px_0px_#171717] p-6 sm:p-8 md:p-10 space-y-6 relative overflow-hidden">

                <div className="space-y-2 border-b-2 border-dark/10 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="sticker bg-coral text-white text-xs">
                      TRUST & SAFETY VAULT
                    </span>
                    <span className="text-xs font-mono font-extrabold text-dark/60">
                      NEON PRIVATE S3 BUCKET
                    </span>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-black uppercase text-dark">
                    GOVERNMENT ID & LIVE SELFIE VERIFICATION
                  </h3>
                  <p className="font-editorial text-base text-dark/80 leading-snug">
                    To maintain zero-harassment outings and safe companion hangs, all companions and bookers must verify their identity. Click a photo with your camera or attach an image. Documents are AES-256 encrypted.
                  </p>
                </div>

                {/* ID Type Selection */}
                <div className="space-y-3">
                  <label className="block text-xs font-display font-extrabold uppercase text-dark tracking-wider">
                    1. SELECT ID PROOF DOCUMENT TYPE <span className="text-coral">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { id: "aadhaar", label: "🇮🇳 AADHAAR CARD" },
                      { id: "dl", label: "🚗 DRIVING LICENSE" },
                      { id: "passport", label: "✈️ PASSPORT" },
                    ].map((doc) => (
                      <button
                        key={doc.id}
                        type="button"
                        onClick={() => setIdType(doc.id as "aadhaar" | "dl" | "passport")}
                        className={`py-2.5 px-2 rounded-xl text-xs font-display font-black uppercase border-2 border-dark transition-all cursor-pointer text-center ${idType === doc.id
                            ? "bg-dark text-lime shadow-[3px_3px_0px_#171717] scale-102"
                            : "bg-cream text-dark/80 hover:bg-white"
                          }`}
                      >
                        {doc.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* File Upload Dropzones + Camera Click Triggers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  {/* Document Front Upload / Camera Snap */}
                  <div className="space-y-2">
                    <label className="block text-xs font-display font-extrabold uppercase text-dark tracking-wider">
                      2. CLICK OR UPLOAD {idType.toUpperCase()} <span className="text-coral">*</span>
                    </label>

                    <div className="border-3 border-dark rounded-2xl p-4 bg-[#FFF4DF] flex flex-col justify-between min-h-[190px]">
                      {idFilePreview ? (
                        <div className="space-y-2 text-center my-auto">
                          <div className="w-16 h-16 mx-auto rounded-xl bg-lime border-2 border-dark flex items-center justify-center shadow-sm">
                            <CheckCircle2 size={32} className="text-dark" />
                          </div>
                          <span className="font-mono text-xs font-extrabold text-dark block truncate max-w-[200px] mx-auto">
                            {idFileName || "Govt ID Attached"}
                          </span>
                          <span className="text-[10px] text-emerald-800 font-bold uppercase block">
                            ✓ Ready for review
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-1.5 text-center my-auto">
                          <div className="w-12 h-12 mx-auto rounded-full bg-cream border-2 border-dark flex items-center justify-center">
                            <FileText size={22} className="text-dark" />
                          </div>
                          <span className="font-display font-bold text-xs uppercase text-dark block">
                            Attach or Click {idType.toUpperCase()}
                          </span>
                          <span className="font-mono text-[10px] text-dark/60 block">
                            Original physical card or e-copy
                          </span>
                        </div>
                      )}

                      {/* Action Buttons: Camera Snap vs Attach */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t-2 border-dark/10">
                        <button
                          type="button"
                          onClick={() => openCameraCapture("id")}
                          className="py-2 px-2 rounded-xl bg-coral text-white font-display font-black text-[11px] uppercase border-2 border-dark hover:bg-dark hover:text-white transition-all flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                        >
                          <Camera size={13} />
                          <span>CLICK ID</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => idFileInputRef.current?.click()}
                          className="py-2 px-2 rounded-xl bg-white text-dark font-display font-black text-[11px] uppercase border-2 border-dark hover:bg-cream transition-all flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                        >
                          <Upload size={13} />
                          <span>ATTACH FILE</span>
                        </button>
                      </div>
                    </div>

                    <input
                      ref={idFileInputRef}
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleIdDocChange}
                      className="hidden"
                    />
                  </div>

                  {/* Live Selfie Upload / Camera Snap */}
                  <div className="space-y-2">
                    <label className="block text-xs font-display font-extrabold uppercase text-dark tracking-wider">
                      3. CLICK OR UPLOAD LIVE SELFIE <span className="text-coral">*</span>
                    </label>

                    <div className="border-3 border-dark rounded-2xl p-4 bg-[#FFF4DF] flex flex-col justify-between min-h-[190px]">
                      {selfiePreview ? (
                        <div className="space-y-2 text-center my-auto">
                          <div className="w-16 h-16 mx-auto rounded-xl bg-lime border-2 border-dark flex items-center justify-center shadow-sm">
                            <CheckCircle2 size={32} className="text-dark" />
                          </div>
                          <span className="font-mono text-xs font-extrabold text-dark block truncate max-w-[200px] mx-auto">
                            {selfieName || "Selfie Captured"}
                          </span>
                          <span className="text-[10px] text-emerald-800 font-bold uppercase block">
                            ✓ Face selfie ready
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-1.5 text-center my-auto">
                          <div className="w-12 h-12 mx-auto rounded-full bg-cream border-2 border-dark flex items-center justify-center">
                            <Camera size={22} className="text-dark" />
                          </div>
                          <span className="font-display font-bold text-xs uppercase text-dark block">
                            Live Face Photo
                          </span>
                          <span className="font-mono text-[10px] text-dark/60 block">
                            Must match ID document photo
                          </span>
                        </div>
                      )}

                      {/* Action Buttons: Camera Snap vs Attach */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t-2 border-dark/10">
                        <button
                          type="button"
                          onClick={() => openCameraCapture("selfie")}
                          className="py-2 px-2 rounded-xl bg-lime text-dark font-display font-black text-[11px] uppercase border-2 border-dark hover:bg-dark hover:text-lime transition-all flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                        >
                          <Camera size={13} />
                          <span>CLICK SELFIE</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => selfieInputRef.current?.click()}
                          className="py-2 px-2 rounded-xl bg-white text-dark font-display font-black text-[11px] uppercase border-2 border-dark hover:bg-cream transition-all flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                        >
                          <Upload size={13} />
                          <span>ATTACH FILE</span>
                        </button>
                      </div>
                    </div>

                    <input
                      ref={selfieInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleSelfieChange}
                      className="hidden"
                    />
                  </div>

                </div>

                {/* Security Guarantee Note */}
                <div className="p-4 rounded-2xl bg-lavender/30 border-2 border-dark flex items-start gap-3">
                  <Lock size={18} className="text-dark shrink-0 mt-0.5" />
                  <div className="text-xs space-y-0.5">
                    <span className="font-display font-extrabold uppercase text-dark block">
                      ZERO-COST TRUST ARCHITECTURE (NEON VAULT)
                    </span>
                    <p className="font-mono text-[11px] text-dark/80">
                      Uploaded IDs are saved directly to the private S3 bucket <code className="bg-white px-1 py-0.5 rounded border border-dark">verification-vault</code>. Only admins have signed temporary access for manual clearance.
                    </p>
                  </div>
                </div>

                {/* Submit Verification CTA */}
                <button
                  type="button"
                  onClick={handleSubmitVerification}
                  disabled={saveLoading || !idFilePreview || !selfiePreview}
                  className="w-full py-4 rounded-2xl bg-coral text-white font-display font-black text-sm uppercase tracking-wider border-3 border-dark shadow-[4px_4px_0px_#171717] hover:bg-dark hover:text-lime transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saveLoading ? (
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>SUBMITTING TO NEON VAULT...</span>
                    </div>
                  ) : (
                    <>
                      <span>SUBMIT DOCUMENTS FOR VERIFICATION</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

              </div>

            </div>

          </div>
        ) : (
          /* ════════════════════════════════════════════════════════════════
             TAB 2: EXPLORE COMPANIONS & BROWSE PROFILES
             User can see other profiles after logging in!
             ════════════════════════════════════════════════════════════════ */
          <div className="space-y-6">

            {/* Exploration Header & Surf Mode Notice */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border-3 border-dark shadow-[6px_6px_0px_#171717]">
              <div>
                <span className="sticker bg-lime text-dark text-xs">
                  ✦ REAL HUMANS • ZERO DATING WEIRDNESS
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-dark pt-1">
                  KOLKATA VERIFIED COMPANION PROFILES
                </h2>
                <p className="font-editorial text-base sm:text-lg text-dark/80 pt-0.5">
                  Browse verified companions for coffee hops, art exhibitions, street food runs, and deep conversations.
                </p>
              </div>

              {/* Mode indicator badge */}
              <div className="p-3.5 rounded-2xl bg-cream border-2 border-dark shadow-[3px_3px_0px_#171717] flex items-center gap-3 shrink-0">
                <span
                  className={`w-3.5 h-3.5 rounded-full border border-dark ${isVerified ? "bg-lime animate-pulse" : "bg-red-500"
                    }`}
                />
                <div className="text-xs">
                  <span className="font-mono font-black uppercase text-dark block">
                    {isVerified ? "BOOKING STATUS: UNLOCKED" : "SURF MODE ONLY: BOOKINGS LOCKED"}
                  </span>
                  <span className="font-mono text-[10px] text-dark/70">
                    {isVerified ? "100% ID Verified Member" : "Verify Govt ID to book companions"}
                  </span>
                </div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-cream/60 p-4 rounded-2xl border-2 border-dark flex flex-col sm:flex-row items-center gap-3 justify-between">

              {/* Search input */}
              <div className="relative w-full sm:w-80">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark/60" />
                <input
                  type="text"
                  placeholder="Search companion name, vibe, or area..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full bg-white border-2 border-dark font-mono text-xs text-dark placeholder:text-dark/50 focus:outline-none focus:ring-2 focus:ring-lime"
                />
              </div>

              {/* Vibe filter pills */}
              <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                {[
                  { id: "all", label: "ALL PROFILES" },
                  { id: "coffee", label: "☕ CAFES" },
                  { id: "photo", label: "📸 FILM WALKS" },
                  { id: "music", label: "🎵 INDIE GIGS" },
                  { id: "talks", label: "✨ DEEP TALKS" },
                ].map((filter) => (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => setSelectedVibeFilter(filter.id)}
                    className={`px-3 py-1 rounded-full text-xs font-mono font-extrabold uppercase border border-dark transition-all cursor-pointer ${selectedVibeFilter === filter.id
                        ? "bg-dark text-lime shadow-sm"
                        : "bg-white text-dark hover:bg-cream"
                      }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

            </div>

            {/* Companions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
              {filteredCompanions.map((comp) => (
                <div
                  key={comp.id}
                  className="bg-white rounded-3xl border-3 border-dark shadow-[6px_6px_0px_#171717] overflow-hidden flex flex-col justify-between hover:-translate-y-1 transition-transform group"
                >
                  <div>
                    {/* Portrait Photo */}
                    <div className="relative h-64 w-full bg-cream overflow-hidden border-b-3 border-dark">
                      <Image
                        src={comp.avatar_url || "/images/portrait-maya.jpg"}
                        alt={comp.full_name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 bg-white text-dark px-2.5 py-1 rounded-full font-mono font-bold text-[11px] border border-dark flex items-center gap-1 shadow-sm">
                        <Star size={12} className="text-amber-500 fill-amber-500" />
                        <span>{comp.rating || 5.0}</span>
                      </div>

                      <div className="absolute top-3 right-3 bg-lime text-dark px-2.5 py-1 rounded-full font-mono font-black text-[10px] uppercase border border-dark shadow-sm">
                        100% ID VERIFIED
                      </div>

                      <div className="absolute bottom-3 left-3 bg-dark/90 text-white px-3 py-1 rounded-full font-display font-extrabold text-xs tracking-wider border border-white/20">
                        ₹{comp.hourly_rate}/HR
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="font-display font-black text-xl uppercase text-dark">
                            {comp.full_name}
                          </h3>
                          <span className="text-xs font-mono font-bold text-dark/60">
                            {comp.age} YRS
                          </span>
                        </div>
                        <p className="font-mono text-xs text-dark/70 pt-0.5">
                          📍 {comp.city}
                        </p>
                      </div>

                      <p className="font-editorial text-sm text-dark/85 line-clamp-2 leading-snug">
                        {comp.bio}
                      </p>

                      {/* Vibe Tags */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {comp.vibe_tags.slice(0, 3).map((vibe, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-full bg-cream border border-dark text-[10px] font-mono font-bold uppercase text-dark"
                          >
                            #{vibe.replace("-", " ")}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions: View Profile & Book Button */}
                  <div className="p-5 pt-0 space-y-2">
                    <button
                      type="button"
                      onClick={() => setViewCompanionModal(comp)}
                      className="w-full py-2 rounded-xl bg-cream hover:bg-white text-dark font-display font-extrabold text-xs uppercase border-2 border-dark transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Eye size={13} />
                      <span>VIEW FULL PROFILE</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleBookCompanionClick(comp)}
                      disabled={paymentStatus === "loading" && bookingLoadingId === comp.id}
                      className={`w-full py-3 rounded-2xl font-display font-black text-xs uppercase tracking-wider border-2 border-dark transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_#171717] ${isVerified
                          ? "bg-lime text-dark hover:bg-dark hover:text-lime"
                          : "bg-coral text-white hover:bg-dark hover:text-white"
                        } disabled:opacity-75 disabled:cursor-wait`}
                    >
                      {paymentStatus === "loading" && bookingLoadingId === comp.id ? (
                        <>
                          <Loader2 size={14} className="animate-spin text-dark" />
                          <span>OPENING RAZORPAY...</span>
                        </>
                      ) : isVerified ? (
                        <>
                          <span>BOOK HANG WITH {comp.display_name.toUpperCase()}</span>
                          <ArrowRight size={14} />
                        </>
                      ) : (
                        <>
                          <Lock size={14} />
                          <span>SURF ONLY • VERIFY ID TO BOOK</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredCompanions.length === 0 && (
              <div className="bg-white p-12 rounded-3xl border-3 border-dark text-center space-y-3">
                <span className="text-3xl">🔍</span>
                <h4 className="font-display font-black text-xl uppercase text-dark">
                  No companion profiles matched your search
                </h4>
                <p className="font-editorial text-sm text-dark/70">
                  Try clearing your search query or switching to all vibes to see all Calcutta companions.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedVibeFilter("all");
                  }}
                  className="px-4 py-2 rounded-full bg-dark text-lime font-display font-bold text-xs uppercase cursor-pointer"
                >
                  RESET FILTERS
                </button>
              </div>
            )}

          </div>
        )}

      </div>

      {/* ════════════════════════════════════════════════════════════════
          MODAL: LIVE CAMERA SNAPSHOT (CLICK GOVT ID OR LIVE SELFIE)
          ════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {cameraModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2.5rem] border-4 border-dark shadow-[12px_12px_0px_#171717] p-6 max-w-xl w-full space-y-4 text-center relative overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={closeCameraCapture}
                className="absolute top-4 right-4 p-2 rounded-full bg-cream hover:bg-red-100 border-2 border-dark cursor-pointer text-dark transition-all"
              >
                <X size={18} />
              </button>

              <div className="space-y-1">
                <span className="sticker bg-coral text-white text-[10px]">
                  LIVE CAMERA SNAPPER
                </span>
                <h3 className="font-display text-2xl font-black uppercase text-dark">
                  {cameraTarget === "id"
                    ? `CLICK ${idType.toUpperCase()} PHOTO`
                    : "CLICK LIVE FACE SELFIE"}
                </h3>
                <p className="font-editorial text-xs text-dark/80">
                  {cameraTarget === "id"
                    ? "Align your physical ID card clearly inside the frame and click capture."
                    : "Look directly into the camera with good lighting and click capture."}
                </p>
              </div>

              {/* Viewport Stream or Error Fallback */}
              {cameraError ? (
                <div className="p-8 rounded-2xl bg-amber-50 border-3 border-dark text-center space-y-3">
                  <AlertTriangle size={36} className="mx-auto text-coral" />
                  <p className="font-mono text-xs text-dark/80 max-w-sm mx-auto">
                    {cameraError}
                  </p>
                  <button
                    onClick={() => {
                      closeCameraCapture();
                      if (cameraTarget === "id") idFileInputRef.current?.click();
                      else selfieInputRef.current?.click();
                    }}
                    className="px-5 py-2.5 rounded-full bg-dark text-lime font-display font-bold text-xs uppercase border-2 border-dark cursor-pointer"
                  >
                    SELECT PHOTO FROM DEVICE INSTEAD
                  </button>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border-3 border-dark bg-black aspect-video flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />

                  {/* Viewfinder Bounding Box Guides */}
                  {cameraTarget === "id" ? (
                    <div className="absolute inset-6 sm:inset-10 border-2 border-dashed border-lime rounded-xl pointer-events-none flex flex-col justify-between p-3">
                      <span className="font-mono text-[10px] text-lime font-bold uppercase text-left bg-dark/70 px-2 py-0.5 rounded w-fit">
                        [ ID CARD BOUNDARY ]
                      </span>
                      <span className="font-mono text-[10px] text-lime font-bold uppercase text-right bg-dark/70 px-2 py-0.5 rounded w-fit self-end">
                        KEEP TEXT CLEAR
                      </span>
                    </div>
                  ) : (
                    <div className="absolute w-44 h-56 border-2 border-dashed border-coral rounded-full pointer-events-none flex items-center justify-center">
                      <span className="font-mono text-[10px] text-coral font-bold uppercase bg-dark/70 px-2 py-0.5 rounded">
                        CENTER FACE HERE
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Shutter Button */}
              {!cameraError && (
                <div className="pt-2 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleSnapPhoto}
                    className="px-8 py-3.5 rounded-full bg-lime text-dark font-display font-black text-sm uppercase tracking-wider border-3 border-dark shadow-[4px_4px_0px_#171717] hover:bg-dark hover:text-lime transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Camera size={18} />
                    <span>CAPTURE PHOTO NOW</span>
                  </button>

                  <button
                    type="button"
                    onClick={closeCameraCapture}
                    className="px-5 py-3 rounded-full bg-cream text-dark font-display font-bold text-xs uppercase border-2 border-dark hover:bg-white transition-all cursor-pointer"
                  >
                    CANCEL
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════════════════════════════
          MODAL: COMPANION DETAILED PROFILE VIEW
          ════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {viewCompanionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2.5rem] border-4 border-dark shadow-[12px_12px_0px_#171717] p-6 sm:p-8 max-w-xl w-full space-y-5 relative max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setViewCompanionModal(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-cream hover:bg-red-100 border-2 border-dark cursor-pointer text-dark transition-all z-20"
              >
                <X size={18} />
              </button>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pt-2">
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl border-3 border-dark overflow-hidden shrink-0 shadow-sm bg-cream">
                  <Image
                    src={viewCompanionModal.avatar_url || "/images/portrait-maya.jpg"}
                    alt={viewCompanionModal.full_name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="space-y-2 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="sticker bg-lime text-dark text-[10px]">
                      100% ID VERIFIED
                    </span>
                    <span className="sticker bg-lavender text-dark text-[10px]">
                      ★ {viewCompanionModal.rating || 5.0} RATING
                    </span>
                  </div>
                  <h3 className="font-display font-black text-3xl uppercase text-dark">
                    {viewCompanionModal.full_name}
                  </h3>
                  <div className="font-mono text-xs text-dark/70 space-x-2">
                    <span>🎂 {viewCompanionModal.age} YRS</span>
                    <span>•</span>
                    <span>📍 {viewCompanionModal.city}</span>
                    <span>•</span>
                    <span className="text-coral font-bold">₹{viewCompanionModal.hourly_rate}/HR</span>
                  </div>
                </div>
              </div>

              {/* Bio & Outings */}
              <div className="p-4 rounded-2xl bg-[#FFF4DF] border-2 border-dark space-y-2 text-xs">
                <span className="font-display font-extrabold text-dark uppercase block">
                  ABOUT THIS COMPANION:
                </span>
                <p className="font-editorial text-sm text-dark/90 leading-relaxed">
                  {viewCompanionModal.bio}
                </p>
              </div>

              {/* Vibe Chips */}
              <div className="space-y-1.5">
                <span className="font-display font-extrabold text-xs uppercase text-dark block">
                  FAVORITE HANG VIBES:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {viewCompanionModal.vibe_tags.map((vibe, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-full bg-cream border border-dark text-xs font-mono font-bold uppercase text-dark"
                    >
                      ✦ {vibe.replace("-", " ")}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Action */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const comp = viewCompanionModal;
                    setViewCompanionModal(null);
                    handleBookCompanionClick(comp);
                  }}
                  disabled={paymentStatus === "loading" && bookingLoadingId === viewCompanionModal.id}
                  className={`flex-1 py-3.5 rounded-2xl font-display font-black text-xs uppercase tracking-wider border-2 border-dark transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_#171717] ${isVerified
                      ? "bg-lime text-dark hover:bg-dark hover:text-lime"
                      : "bg-coral text-white hover:bg-dark hover:text-white"
                    } disabled:opacity-75 disabled:cursor-wait`}
                >
                  {paymentStatus === "loading" && bookingLoadingId === viewCompanionModal.id ? (
                    <>
                      <Loader2 size={14} className="animate-spin text-dark" />
                      <span>OPENING RAZORPAY...</span>
                    </>
                  ) : isVerified ? (
                    <>
                      <span>BOOK HANG WITH {viewCompanionModal.display_name.toUpperCase()}</span>
                      <ArrowRight size={14} />
                    </>
                  ) : (
                    <>
                      <Lock size={14} />
                      <span>SURF ONLY • VERIFY ID TO BOOK</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setViewCompanionModal(null)}
                  className="py-3 px-5 rounded-2xl bg-cream text-dark font-display font-bold text-xs uppercase border-2 border-dark hover:bg-white transition-all cursor-pointer"
                >
                  CLOSE
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════════════════════════════
          MODAL: RESTRICTION ALERT (WHEN UNVERIFIED USER TRIES TO BOOK)
          ════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {restrictionModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2.5rem] border-4 border-dark shadow-[10px_10px_0px_#171717] p-6 sm:p-8 max-w-lg w-full space-y-5 text-center relative"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-red-100 border-3 border-dark flex items-center justify-center text-red-600 shadow-[4px_4px_0px_#171717]">
                <ShieldAlert size={40} />
              </div>

              <div className="space-y-2">
                <span className="sticker bg-coral text-white text-xs">
                  BOOKING RESTRICTION ACTIVE
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-black uppercase text-dark">
                  ID VERIFICATION REQUIRED
                </h3>
                <p className="font-editorial text-base text-dark/80 leading-snug">
                  Your account is currently in <strong>Surf / Browse Mode</strong>. To book <strong>{selectedCompanionForBooking?.full_name}</strong> or offer companion services, you must upload or click a photo of your Government ID and a live selfie.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFF4DF] border-2 border-dark text-left text-xs font-mono space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-700" />
                  <span>Surfing & browsing profiles: <strong>ALLOWED</strong></span>
                </div>
                <div className="flex items-center gap-2 text-red-700 font-bold">
                  <Lock size={16} />
                  <span>Booking companions or being a companion: <strong>LOCKED</strong></span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setRestrictionModalOpen(false);
                    if (selectedCompanionForBooking) {
                      startCompanionBookingPayment(selectedCompanionForBooking);
                    }
                  }}
                  className="flex-1 py-3.5 px-4 rounded-full bg-lime text-dark font-display font-black text-xs uppercase border-2 border-dark shadow-[3px_3px_0px_#171717] hover:bg-dark hover:text-lime transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles size={14} />
                  <span>TEST BOOKING PAYMENT (₹{selectedCompanionForBooking?.hourly_rate || 500}) →</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRestrictionModalOpen(false);
                    setActiveTab("profile");
                    const elem = document.getElementById("id-vault-section");
                    elem?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="py-3.5 px-5 rounded-full bg-dark text-white font-display font-black text-xs uppercase border-2 border-dark shadow-[3px_3px_0px_#171717] hover:bg-coral hover:text-white transition-all cursor-pointer"
                >
                  UPLOAD ID
                </button>
                <button
                  type="button"
                  onClick={() => setRestrictionModalOpen(false)}
                  className="py-3.5 px-4 rounded-full bg-cream text-dark font-display font-bold text-xs uppercase border-2 border-dark hover:bg-white transition-all cursor-pointer"
                >
                  CLOSE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════════════════════════════
          MODAL: BOOKING SUCCESS (WHEN VERIFIED USER BOOKS)
          ════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {bookingSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2.5rem] border-4 border-dark shadow-[10px_10px_0px_#171717] p-6 sm:p-8 max-w-lg w-full space-y-5 text-center relative"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-lime border-3 border-dark flex items-center justify-center text-dark shadow-[4px_4px_0px_#171717]">
                <Sparkles size={40} className="animate-bounce" />
              </div>

              <div className="space-y-2">
                <span className="sticker bg-lime text-dark text-xs">
                  VERIFIED OUTING SCHEDULED
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-black uppercase text-dark">
                  HANG REQUEST SENT TO {selectedCompanionForBooking?.display_name.toUpperCase()}! 🎉
                </h3>
                <p className="font-editorial text-base text-dark/80 leading-snug">
                  Because you are 100% ID verified, your booking request has been confirmed with highest priority.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-cream border-2 border-dark text-left text-xs font-mono space-y-2">
                <div className="flex justify-between">
                  <span>Companion:</span>
                  <span className="font-bold text-dark">{selectedCompanionForBooking?.full_name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Hourly Rate:</span>
                  <span className="font-bold text-coral">₹{selectedCompanionForBooking?.hourly_rate}/hr</span>
                </div>
                {lastPaymentInfo && (
                  <>
                    <div className="flex justify-between items-center">
                      <span>Payment Status:</span>
                      <span className="font-bold text-dark bg-lime px-2 py-0.5 rounded text-[10px] border border-dark">
                        ✓ PAID & VERIFIED (TEST MODE)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amount Paid:</span>
                      <span className="font-bold text-dark">₹{lastPaymentInfo.amount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Payment ID:</span>
                      <span className="font-mono text-[10px] text-dark/70 break-all">
                        {lastPaymentInfo.payment_id}
                      </span>
                    </div>
                  </>
                )}
                <div className="flex justify-between items-center pt-1 border-t border-dark/20">
                  <span>In-App Safety PIN:</span>
                  <span className="font-bold text-cobalt tracking-widest bg-white px-2 py-0.5 rounded border border-dark">
                    4912
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setBookingSuccessModal(false)}
                className="w-full py-3.5 rounded-full bg-dark text-lime font-display font-black text-xs uppercase border-2 border-dark shadow-[3px_3px_0px_#171717] hover:bg-coral hover:text-white transition-all cursor-pointer"
              >
                AWESOME, GOT IT!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════════════════════════════
          MODAL: PERMANENT ACCOUNT DELETION CONFIRMATION
          ════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {deleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2.5rem] border-4 border-dark shadow-[12px_12px_0px_#171717] p-6 sm:p-8 max-w-lg w-full space-y-5 text-center relative overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-cream hover:bg-red-100 border-2 border-dark cursor-pointer text-dark transition-all"
              >
                <X size={18} />
              </button>

              <div className="w-20 h-20 mx-auto rounded-full bg-red-100 border-3 border-dark flex items-center justify-center text-red-600 shadow-[4px_4px_0px_#171717]">
                <Trash2 size={38} />
              </div>

              <div className="space-y-1.5">
                <span className="sticker bg-red-600 text-white text-xs">
                  IRREVERSIBLE ACTION
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-black uppercase text-dark">
                  PERMANENTLY DELETE ACCOUNT?
                </h3>
                <p className="font-editorial text-sm text-dark/80 leading-snug">
                  This will completely wipe your account from the entire Neon database. This action is irreversible.
                </p>
              </div>

              {/* Data Wiping Checklist */}
              <div className="p-4 rounded-2xl bg-[#FFF2F2] border-2 border-dark text-left text-xs font-mono space-y-2">
                <div className="font-bold text-red-900 uppercase">
                  Data that will be permanently removed from the entire DB:
                </div>
                <div className="space-y-1 text-dark/85">
                  <div className="flex items-center gap-2">
                    <span className="text-red-600 font-bold">✕</span>
                    <span>Profile record, photos & vibes in <code>public.profiles</code></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-600 font-bold">✕</span>
                    <span>Govt ID proof & selfies stored in Neon Vault</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-600 font-bold">✕</span>
                    <span>All companion listings & outing requests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-600 font-bold">✕</span>
                    <span>Auth credentials, sessions & account in <code>neon_auth</code></span>
                  </div>
                </div>
              </div>

              {deleteErrorMessage && (
                <div className="p-3 rounded-xl bg-red-100 border border-red-500 text-red-800 text-xs font-mono font-bold">
                  {deleteErrorMessage}
                </div>
              )}

              {/* Confirmation Input */}
              <div className="space-y-2 text-left">
                <label className="block text-xs font-display font-extrabold uppercase text-dark tracking-wider">
                  Type <span className="text-red-600 font-mono font-black">DELETE</span> to confirm:
                </label>
                <input
                  type="text"
                  placeholder="DELETE"
                  value={deleteConfirmationText}
                  onChange={(e) => setDeleteConfirmationText(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-cream border-2 border-dark font-mono font-bold text-dark text-sm focus:outline-none focus:ring-2 focus:ring-red-500 uppercase"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading || deleteConfirmationText.trim().toUpperCase() !== "DELETE"}
                  className="flex-1 py-3.5 rounded-full bg-red-600 text-white font-display font-black text-xs uppercase border-2 border-dark shadow-[3px_3px_0px_#171717] hover:bg-dark hover:text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {deleteLoading ? (
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>DELETING FROM DB...</span>
                    </div>
                  ) : (
                    <>
                      <Trash2 size={14} />
                      <span>PERMANENTLY DELETE FROM DB</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteModalOpen(false)}
                  disabled={deleteLoading}
                  className="py-3.5 px-6 rounded-full bg-cream text-dark font-display font-bold text-xs uppercase border-2 border-dark hover:bg-white transition-all cursor-pointer"
                >
                  KEEP ACCOUNT
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Payment Status Toast */}
      <AnimatePresence>
        {bookingPaymentToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-2xl border-3 shadow-[4px_4px_0px_#171717] max-w-md text-center ${bookingPaymentToast.status === "success"
                ? "bg-lime border-dark text-dark"
                : "bg-coral border-dark text-white"
              }`}
          >
            <p className="font-display font-bold text-sm">{bookingPaymentToast.message}</p>
            <button
              onClick={() => setBookingPaymentToast(null)}
              className="mt-2 text-xs font-bold underline opacity-80 hover:opacity-100 cursor-pointer"
            >
              DISMISS
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tax Invoice Modal (Item 5) */}
      <InvoiceModal
        isOpen={invoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
        invoice={currentInvoice}
      />

    </main>
  );
}
