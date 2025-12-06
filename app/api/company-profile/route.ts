import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import CompanyProfile from "@/models/CompanyProfile";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const profile = await CompanyProfile.findOne({ userId: session.user.id });

    return NextResponse.json(profile || null, { status: 200 });
  } catch (error: any) {
    console.error("Get company profile error:", error);
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
    } = body;

    if (!businessName) {
      return NextResponse.json(
        { error: "Business name is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const profile = await CompanyProfile.findOneAndUpdate(
      { userId: session.user.id },
      {
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
      },
      { upsert: true, new: true, runValidators: true }
    );

    return NextResponse.json(profile, { status: 200 });
  } catch (error: any) {
    console.error("Update company profile error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

