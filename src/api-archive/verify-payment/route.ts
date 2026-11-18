import { NextRequest, NextResponse } from "next/server";
import { HONO_API_URL } from "@/lib/apiConfig";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const res = await fetch(`${HONO_API_URL}/api/payments/verify-payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.detail || "Payment verification failed" },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    console.error("Payment verification error via Hono:", err);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
