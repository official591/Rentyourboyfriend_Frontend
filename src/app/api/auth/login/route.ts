import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const neonAuthBaseUrl = process.env.NEON_AUTH_BASE_URL || "https://ep-weathered-hat-b41374ao.neonauth.c-6.us-east-2.aws.neon.tech/neondb/auth";
    const databaseUrl = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
    const origin = req.headers.get("origin") || "http://localhost:3000";

    // 1. Attempt Neon Auth email+password sign in
    const neonRes = await fetch(`${neonAuthBaseUrl}/sign-in/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: origin,
      },
      body: JSON.stringify({ email: normalizedEmail, password }),
    });

    const neonData = await neonRes.json().catch(() => ({}));

    if (!neonRes.ok) {
      if (neonData.code === "EMAIL_NOT_VERIFIED") {
        return NextResponse.json({
          error: "Your email is not verified yet. Please sign up or verify your code.",
          code: "EMAIL_NOT_VERIFIED",
        }, { status: 403 });
      }
      return NextResponse.json({
        error: neonData.message || "Invalid email or password. Please try again.",
      }, { status: 401 });
    }

    // 2. Fetch full profile details from Neon Postgres
    let profileData: Record<string, unknown> | null = null;
    if (databaseUrl) {
      const sql = neon(databaseUrl);
      const rows = await sql`
        SELECT id, email, full_name, display_name, city, is_companion, hourly_rate, vibe_tags
        FROM public.profiles
        WHERE email = ${normalizedEmail}
        LIMIT 1
      `;
      if (rows.length > 0) {
        profileData = rows[0];
      }
    }

    return NextResponse.json({
      success: true,
      message: "Logged in successfully via Neon Auth!",
      user: {
        id: neonData.user?.id || profileData?.id,
        email: normalizedEmail,
        name: profileData?.full_name || neonData.user?.name || "Friend",
        city: profileData?.city || "Kolkata",
        isCompanion: profileData?.is_companion || false,
        hourlyRate: profileData?.hourly_rate || 0,
        vibes: profileData?.vibe_tags || [],
      },
    });
  } catch (err: unknown) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Authentication failed. Please try again." },
      { status: 500 }
    );
  }
}
