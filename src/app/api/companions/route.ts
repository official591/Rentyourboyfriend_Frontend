import { NextResponse } from "next/server";
import { HONO_API_URL } from "@/lib/apiConfig";

export async function GET() {
  try {
    const res = await fetch(`${HONO_API_URL}/api/companions`, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`Hono backend returned ${res.status}`);
    }

    const data = await res.json();
    const companions = Array.isArray(data) ? data : data.companions || [];

    return NextResponse.json(
      {
        success: true,
        companions,
      },
      {
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=120, stale-while-revalidate=600",
        },
      }
    );
  } catch (err: unknown) {
    console.error("Error fetching companions from Hono backend:", err);
    return NextResponse.json({ error: "Failed to load companions" }, { status: 500 });
  }
}
