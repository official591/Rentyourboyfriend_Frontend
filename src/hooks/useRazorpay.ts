"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getApiUrl } from "@/lib/apiConfig";

// Extend Window to include Razorpay constructor
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpaySuccessResponse) => void;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: (response: RazorpayFailResponse) => void) => void;
}

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayFailResponse {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: { order_id: string; payment_id: string };
  };
}

export type PaymentStatus = "idle" | "loading" | "success" | "error" | "cancelled";

export interface PayCustomOptions {
  name?: string;
  description?: string;
  prefill?: { name?: string; email?: string; contact?: string };
  themeColor?: string;
  tier?: string;
  userEmail?: string;
}

interface UseRazorpayOptions {
  name?: string;
  description?: string;
  prefill?: { name?: string; email?: string; contact?: string };
  themeColor?: string;
  onSuccess?: (data: { payment_id: string; order_id: string; upgraded_tier?: string }) => void;
  onError?: (error: string) => void;
}

export function useRazorpay(options: UseRazorpayOptions = {}) {
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const scriptLoaded = useRef(false);

  // Load Razorpay checkout script
  useEffect(() => {
    if (scriptLoaded.current || typeof window === "undefined") return;
    if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      scriptLoaded.current = true;
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      scriptLoaded.current = true;
    };
    document.body.appendChild(script);
  }, []);

  const pay = useCallback(
    async (amountInPaise: number, receipt?: string, customOptions?: PayCustomOptions) => {
      setStatus("loading");
      setError(null);

      try {
        const userEmail = customOptions?.userEmail || customOptions?.prefill?.email || options.prefill?.email;

        // Step 1: Create order on backend
        const orderRes = await fetch(getApiUrl("/api/create-order"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: amountInPaise,
            currency: "INR",
            receipt: receipt || `membership_${Date.now()}`,
            notes: {
              tier: customOptions?.tier || "",
              user_email: userEmail || "",
            },
          }),
        });

        if (!orderRes.ok) {
          const data = await orderRes.json().catch(() => ({}));
          throw new Error(data.error || "Failed to create order");
        }

        const { order_id, amount, currency } = await orderRes.json();

        // Step 2: Open Razorpay checkout modal
        if (!window.Razorpay) {
          throw new Error("Payment SDK not loaded. Please refresh and try again.");
        }

        const rzpOptions: RazorpayOptions = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_Tub0386WrovOZF",
          amount,
          currency,
          name: customOptions?.name || options.name || "COMPANION",
          description: customOptions?.description || options.description || "Membership Payment",
          order_id,
          handler: async (response: RazorpaySuccessResponse) => {
            // Step 3: Verify payment on backend
            try {
              const verifyRes = await fetch(getApiUrl("/api/verify-payment"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  tier: customOptions?.tier,
                  user_email: customOptions?.userEmail || customOptions?.prefill?.email || options.prefill?.email,
                  amount_paise: amountInPaise,
                }),
              });

              if (!verifyRes.ok) {
                const data = await verifyRes.json().catch(() => ({}));
                throw new Error(data.error || "Payment verification failed");
              }

              const verifyData = await verifyRes.json().catch(() => ({}));

              setStatus("success");
              options.onSuccess?.({
                payment_id: response.razorpay_payment_id,
                order_id: response.razorpay_order_id,
                upgraded_tier: verifyData.upgraded_tier || customOptions?.tier,
              });
            } catch (verifyErr) {
              const msg =
                verifyErr instanceof Error ? verifyErr.message : "Verification failed";
              setError(msg);
              setStatus("error");
              options.onError?.(msg);
            }
          },
          prefill: {
            name: customOptions?.prefill?.name || options.prefill?.name || "Test User",
            email: customOptions?.prefill?.email || options.prefill?.email || "test@example.com",
            contact: customOptions?.prefill?.contact || options.prefill?.contact || "9876543210",
          },
          theme: { color: customOptions?.themeColor || options.themeColor || "#3155FF" },
          modal: {
            ondismiss: () => {
              setStatus("cancelled");
            },
          },
        };

        const rzp = new window.Razorpay(rzpOptions);

        rzp.on("payment.failed", (failResponse: RazorpayFailResponse) => {
          const msg = failResponse.error.description || "Payment failed";
          setError(msg);
          setStatus("error");
          options.onError?.(msg);
        });

        rzp.open();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Payment initiation failed";
        setError(msg);
        setStatus("error");
        options.onError?.(msg);
      }
    },
    [options]
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setError(null);
  }, []);

  return { pay, status, error, reset };
}

