import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    const query: { userId: string; name?: { $regex: string; $options: string } } = { userId: session.user.id };

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const products = await Product.find(query).sort({
      createdAt: -1,
    });

    return NextResponse.json(products, { status: 200 });
  } catch (error: unknown) {
    console.error("Get products error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, price, gst, hsnCode, category } = body;

    if (!name || price === undefined || gst === undefined) {
      return NextResponse.json(
        { error: "Name, price, and GST are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const product = await Product.create({
      userId: session.user.id,
      name,
      price: Number(price),
      gst: Number(gst),
      hsnCode,
      category,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: unknown) {
    console.error("Create product error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

