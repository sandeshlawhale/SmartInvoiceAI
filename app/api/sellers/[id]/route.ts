import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Seller from "@/models/Seller";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const seller = await Seller.findOne({
      _id: params.id,
      userId: session.user.id,
    });

    if (!seller) {
      return NextResponse.json({ error: "Seller not found" }, { status: 404 });
    }

    return NextResponse.json(seller, { status: 200 });
  } catch (error: unknown) {
    console.error("Get seller error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      isDefault,
      customField,
    } = body;

    await connectDB();

    // If this is set as default, unset other defaults
    if (isDefault) {
      await Seller.updateMany(
        { userId: session.user.id, _id: { $ne: params.id } },
        { $set: { isDefault: false } }
      );
    }

    const seller = await Seller.findOneAndUpdate(
      { _id: params.id, userId: session.user.id },
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
        isDefault,
        customField,
      },
      { new: true, runValidators: true }
    );

    if (!seller) {
      return NextResponse.json({ error: "Seller not found" }, { status: 404 });
    }

    return NextResponse.json(seller, { status: 200 });
  } catch (error: unknown) {
    console.error("Update seller error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const seller = await Seller.findOneAndDelete({
      _id: params.id,
      userId: session.user.id,
    });

    if (!seller) {
      return NextResponse.json({ error: "Seller not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Seller deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Delete seller error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

