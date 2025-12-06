import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Seller from "@/models/Seller";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    const query: any = { userId: session.user.id };
    if (search) {
      query.businessName = { $regex: search, $options: "i" };
    }

    const sellers = await Seller.find(query).sort({
      isDefault: -1,
      createdAt: -1,
    });

    return NextResponse.json(sellers, { status: 200 });
  } catch (error: any) {
    console.error("Get sellers error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
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

    await connectDB();

    const body = await request.json();
    const {
      businessName,
      address,
      city,
      state,
      pincode,
      gstin,
      phone,
      email,
      logo,
      bankName,
      accountNumber,
      ifscCode,
      isDefault,
      customField,
    } = body;

    if (!businessName) {
      return NextResponse.json(
        { error: "Business name is required" },
        { status: 400 }
      );
    }

    // If this is the first seller or set as default, handle default logic
    if (isDefault) {
      await Seller.updateMany(
        { userId: session.user.id },
        { $set: { isDefault: false } }
      );
    }

    const seller = await Seller.create({
      userId: session.user.id,
      businessName,
      address,
      city,
      state,
      pincode,
      gstin,
      phone,
      email,
      logo,
      bankName,
      accountNumber,
      ifscCode,
      isDefault: isDefault || false,
      customField,
    });

    return NextResponse.json(seller, { status: 201 });
  } catch (error: any) {
    console.error("Create seller error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
