import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email address is required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const neonAuthBaseUrl = process.env.NEON_AUTH_BASE_URL || "https://ep-weathered-hat-b41374ao.neonauth.c-6.us-east-2.aws.neon.tech/neondb/auth";
    const origin = req.headers.get("origin") || "http://localhost:3000";

    // 1. Try registering user via Neon Auth /sign-up/email (this generates & dispatches the verification code!)
    const signUpResponse = await fetch(`${neonAuthBaseUrl}/sign-up/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: origin,
      },
      body: JSON.stringify({
        email: normalizedEmail,
        password: password || "DefaultPass123!",
        name: name || "Companion User",
      }),
    });

    const signUpData = await signUpResponse.json().catch(() => ({}));

    // If user already exists in Neon Auth, send a verification OTP
    if (!signUpResponse.ok && (signUpData.code === "USER_ALREADY_EXISTS" || signUpData.message?.includes("already exists"))) {
      const resendRes = await fetch(`${neonAuthBaseUrl}/email-otp/send-verification-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: origin,
        },
        body: JSON.stringify({
          email: normalizedEmail,
          type: "email-verification",
        }),
      });

      if (!resendRes.ok) {
        const resendErr = await resendRes.json().catch(() => ({}));
        return NextResponse.json({
          error: resendErr.message || "Failed to send verification code. Please check your details.",
        }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: `Verification code sent to ${normalizedEmail}`,
      });
    }

    if (!signUpResponse.ok) {
      return NextResponse.json({
        error: signUpData.message || "Failed to register with Neon Auth",
      }, { status: signUpResponse.status || 400 });
    }

    return NextResponse.json({
      success: true,
      message: `Verification code dispatched to ${normalizedEmail}`,
    });
  } catch (err: unknown) {
    console.error("Error in send-otp:", err);
    return NextResponse.json(
      { error: "Could not send verification code. Please try again." },
      { status: 500 }
    );
  }
}
