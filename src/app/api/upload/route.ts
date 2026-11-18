import { NextRequest, NextResponse } from "next/server";
import { HONO_API_URL } from "@/lib/apiConfig";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const res = await fetch(`${HONO_API_URL}/api/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: unknown) {
    console.error("Neon object storage upload error via Hono:", err);
    const message = err instanceof Error ? err.message : "File upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
