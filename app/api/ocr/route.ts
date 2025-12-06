import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Tesseract from "tesseract.js";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Check file type
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (!allowedTypes.includes(file.type) && !file.name.endsWith(".pdf")) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPG, PNG, and PDF are allowed." },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // For PDF files, we'll need to convert to image first
    // For now, let's handle images only
    if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
      return NextResponse.json(
        { error: "PDF support coming soon. Please use JPG or PNG images." },
        { status: 400 }
      );
    }

    // Perform OCR
    const {
      data: { text },
    } = await Tesseract.recognize(buffer, "eng", {
      logger: (m) => {
        if (m.status === "recognizing text") {
          // Progress can be logged here if needed
        }
      },
    });

    return NextResponse.json({ text }, { status: 200 });
  } catch (error: any) {
    console.error("OCR error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

