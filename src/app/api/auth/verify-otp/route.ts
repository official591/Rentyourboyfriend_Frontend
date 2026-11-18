import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function POST(req: Request) {
  try {
    const { email, otp, password, name, age, city, vibes, role, hourlyRate } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and verification code are required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const neonAuthBaseUrl = process.env.NEON_AUTH_BASE_URL || "https://ep-weathered-hat-b41374ao.neonauth.c-6.us-east-2.aws.neon.tech/neondb/auth";
    const databaseUrl = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
    const origin = req.headers.get("origin") || "http://localhost:3000";

    // 1. Verify code with Neon Auth
    const verifyRes = await fetch(`${neonAuthBaseUrl}/email-otp/verify-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: origin,
      },
      body: JSON.stringify({ email: normalizedEmail, otp: otp.trim() }),
    });

    const verifyData = await verifyRes.json().catch(() => ({}));

    if (!verifyRes.ok) {
      return NextResponse.json({
        error: verifyData.message || "Invalid or expired verification code. Please check and try again.",
      }, { status: 400 });
    }

    // 2. Save / update companion profile in Neon Postgres
    if (databaseUrl) {
      const sql = neon(databaseUrl);
      const userId = verifyData.user?.id || ("user_" + Math.random().toString(36).substring(2, 12));
      const userAge = parseInt(age, 10) || 21;
      const isCompanion = role === "companion";
      const parsedRate = isCompanion ? (parseInt(hourlyRate, 10) || 499) : 0;
      const vibeArray = Array.isArray(vibes) ? vibes : [];

      const existingProfiles = await sql`
        SELECT id FROM public.profiles WHERE email = ${normalizedEmail} LIMIT 1
      `;

      if (existingProfiles.length > 0) {
        await sql`
          UPDATE public.profiles
          SET email_verified = true,
              password_hash = COALESCE(${password || null}, password_hash),
              full_name = COALESCE(${name || null}, full_name),
              display_name = COALESCE(${name || null}, display_name),
              city = COALESCE(${city || null}, city),
              is_companion = ${isCompanion},
              hourly_rate = ${parsedRate},
              vibe_tags = ${vibeArray},
              updated_at = NOW()
          WHERE email = ${normalizedEmail}
        `;
      } else {
        await sql`
          INSERT INTO public.profiles (
            id, email, password_hash, full_name, display_name, age, city,
            vibe_tags, is_companion, hourly_rate, email_verified, verification_status
          ) VALUES (
            ${userId}, ${normalizedEmail}, ${password || null}, ${name || "User"}, ${name || "User"},
            ${userAge}, ${city || "Kolkata"}, ${vibeArray}, ${isCompanion}, ${parsedRate}, true, 'unverified'
          )
        `;

        // If companion, create initial companion listing
        if (isCompanion) {
          await sql`
            INSERT INTO public.companion_listings (
              companion_id, title, category, spots_highlight, hourly_rate, is_active
            ) VALUES (
              ${userId},
              ${(name || "Companion") + "'s Curated Hangs"},
              ${vibeArray[0] || "coffee"},
              ${city || "Kolkata"},
              ${parsedRate},
              true
            )
          `;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Email verified & account activated successfully via Neon Auth!",
      user: {
        email: normalizedEmail,
        name: name || "User",
        city: city || "Kolkata",
        vibes: vibes || [],
        role: role || "seeker",
        hourlyRate: role === "companion" ? hourlyRate : 0,
      },
    });
  } catch (err: unknown) {
    console.error("Error in verify-otp:", err);
    return NextResponse.json(
      { error: "Verification failed. Please try again." },
      { status: 500 }
    );
  }
}
