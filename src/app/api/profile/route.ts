import { NextResponse } from "next/server";
import { HONO_API_URL } from "@/lib/apiConfig";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const res = await fetch(
      `${HONO_API_URL}/api/profiles?email=${encodeURIComponent(email.trim())}`,
      {
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: err.detail || "Profile not found" },
        { status: res.status }
      );
    }

    const profile = await res.json();
    return NextResponse.json({
      success: true,
      profile: profile.profile || profile,
    });
  } catch (err: unknown) {
    console.error("Error fetching profile from Hono:", err);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { email, name, bio, city, avatarUrl, hourlyRate, membership_tier } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const res = await fetch(
      `${HONO_API_URL}/api/profiles?email=${encodeURIComponent(email.trim())}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: name,
          display_name: name,
          bio,
          city,
          avatar_url: avatarUrl,
          hourly_rate: hourlyRate !== undefined ? Number(hourlyRate) : undefined,
          membership_tier,
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: err.detail || "Failed to update profile" },
        { status: res.status }
      );
    }

    const updated = await res.json();
    return NextResponse.json({
      success: true,
      profile: updated.profile || updated,
    });
  } catch (err: unknown) {
    console.error("Error updating profile via Hono:", err);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
