import { NextRequest, NextResponse } from "next/server";
import { createDocument } from "@/lib/supabase";

const VALID_ID_PATTERN = /^[a-zA-Z0-9_-]{1,128}$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, description, url } = body;

    if (!id || !title || !url) {
      return NextResponse.json(
        { error: "Thieu truong bat buoc: id, title, url" },
        { status: 400 }
      );
    }

    if (!VALID_ID_PATTERN.test(id)) {
      return NextResponse.json(
        { error: "ID chi cho phep a-z, 0-9, gach ngang, gach duoi (toi da 128 ky tu)" },
        { status: 400 }
      );
    }

    const doc = await createDocument({
      id,
      title,
      description: description || "",
      url,
    });

    return NextResponse.json(doc, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    const isDuplicate = message.includes("duplicate") || message.includes("already exists");
    return NextResponse.json(
      { error: isDuplicate ? "Document ID da ton tai" : message },
      { status: isDuplicate ? 409 : 500 }
    );
  }
}
