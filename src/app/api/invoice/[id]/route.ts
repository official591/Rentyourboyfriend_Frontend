import { NextRequest, NextResponse } from "next/server";
import { HONO_API_URL } from "@/lib/apiConfig";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Invoice ID required" }, { status: 400 });
    }

    const res = await fetch(`${HONO_API_URL}/api/invoices/${encodeURIComponent(id)}`, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: unknown) {
    console.error("Error fetching invoice via Hono:", err);
    return NextResponse.json(
      { error: "Failed to fetch invoice" },
      { status: 500 }
    );
  }
}
