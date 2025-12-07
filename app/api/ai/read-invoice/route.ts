import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { ocrText } = body;

    if (!ocrText) {
      return NextResponse.json(
        { error: "OCR text is required" },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an AI assistant that extracts structured invoice data from OCR-extracted text.

Extract the following information from the invoice text:
1. Seller/Business information (name, address, GSTIN, phone, email)
2. Buyer/Customer information (name, email, phone, address, GSTIN)
3. Invoice number and date
4. Products/Items (name, quantity, price, GST amount or percentage, HSN code)
5. Totals (subtotal, GST total, grand total)
6. Payment terms, due date, notes

Return ONLY valid JSON in this exact format:
{
  "seller": {
    "businessName": "string or null",
    "address": "string or null",
    "gstin": "string or null",
    "phone": "string or null",
    "email": "string or null"
  },
  "buyer": {
    "name": "string",
    "email": "string or null",
    "phone": "string or null",
    "address": "string or null",
    "gstin": "string or null"
  },
  "invoice": {
    "invoiceNumber": "string or null",
    "date": "YYYY-MM-DD or null",
    "dueDate": "YYYY-MM-DD or null",
    "notes": "string or null"
  },
  "products": [
    {
      "name": "string",
      "quantity": number,
      "price": number,
      "gst": number,
      "total": number,
      "hsnCode": "string or null"
    }
  ],
  "totals": {
    "subtotal": number,
    "totalGst": number,
    "grandTotal": number
  }
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: ocrText },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const responseText = completion.choices[0]?.message?.content;

    if (!responseText) {
      return NextResponse.json(
        { error: "Failed to generate response" },
        { status: 500 }
      );
    }

    const parsedData = JSON.parse(responseText);

    return NextResponse.json(parsedData, { status: 200 });
    return NextResponse.json(parsedData, { status: 200 });
  } catch (error: unknown) {
    console.error("AI read-invoice error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

