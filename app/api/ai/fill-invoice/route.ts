import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import OpenAI from "openai";
import { connectDB } from "@/lib/db";
import Customer from "@/models/Customer";
import Product from "@/models/Product";

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
    const { text } = body;

    if (!text) {
      return NextResponse.json(
        { error: "Text input is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Get existing customers and products for context
    const customers = await Customer.find({ userId: session.user.id }).select(
      "name email phone address gstin"
    );
    const products = await Product.find({ userId: session.user.id }).select(
      "name price gst hsnCode"
    );

    const systemPrompt = `You are an AI assistant that extracts structured invoice data from unstructured text.

Extract the following information:
1. Buyer/Customer information (name, email, phone, address, GSTIN)
2. Products (name, quantity, price, GST percentage, HSN code if mentioned)
3. Invoice details (date, notes)

Available customers: ${JSON.stringify(customers)}
Available products: ${JSON.stringify(products)}

If a customer name matches an existing customer, use their details. Otherwise, set needsNewCustomer: true.
If a product name matches an existing product, use its price and GST. Otherwise, extract from text.

Return ONLY valid JSON in this exact format:
{
  "buyer": {
    "name": "string",
    "email": "string or null",
    "phone": "string or null",
    "address": "string or null",
    "gstin": "string or null",
    "needsNewCustomer": boolean
  },
  "products": [
    {
      "name": "string",
      "quantity": number,
      "price": number,
      "gst": number,
      "hsnCode": "string or null"
    }
  ],
  "invoice": {
    "date": "YYYY-MM-DD or null",
    "notes": "string or null"
  }
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: text },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const responseText = completion.choices[0]?.message?.content;

    if (!responseText) {
      return NextResponse.json(
        { error: "Failed to generate response" },
        { status: 500 }
      );
    }

    const parsedData = JSON.parse(responseText);

    // Check if buyer matches existing customer
    if (parsedData.buyer?.name && !parsedData.buyer.needsNewCustomer) {
      const matchingCustomer = customers.find(
        (c) =>
          c.name.toLowerCase() === parsedData.buyer.name.toLowerCase()
      );
      if (matchingCustomer) {
        parsedData.buyer = {
          ...parsedData.buyer,
          email: matchingCustomer.email || parsedData.buyer.email,
          phone: matchingCustomer.phone || parsedData.buyer.phone,
          address: matchingCustomer.address || parsedData.buyer.address,
          gstin: matchingCustomer.gstin || parsedData.buyer.gstin,
          needsNewCustomer: false,
        };
      }
    }

    // Match products with existing products
    if (parsedData.products) {
      parsedData.products = parsedData.products.map((product: any) => {
        const matchingProduct = products.find(
          (p) => p.name.toLowerCase() === product.name.toLowerCase()
        );
        if (matchingProduct) {
          return {
            ...product,
            price: product.price || matchingProduct.price,
            gst: product.gst || matchingProduct.gst,
            hsnCode: product.hsnCode || matchingProduct.hsnCode || null,
          };
        }
        return product;
      });
    }

    return NextResponse.json(parsedData, { status: 200 });
  } catch (error: any) {
    console.error("AI fill-invoice error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

