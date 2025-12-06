import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Invoice from "@/models/Invoice";

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

    const invoice = await Invoice.findOne({
      _id: params.id,
      userId: session.user.id,
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json(invoice, { status: 200 });
  } catch (error: any) {
    console.error("Get invoice error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
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
      invoiceNumber,
      customerId,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      customerGstin,
      items,
      invoiceDate,
      dueDate,
      status,
      notes,
    } = body;

    await connectDB();

    // Calculate totals if items are provided
    let subtotal = 0;
    let totalGst = 0;

    if (items && items.length > 0) {
      items.forEach((item: any) => {
        const itemTotal = item.price * item.quantity;
        const itemGst = (itemTotal * item.gst) / 100;
        subtotal += itemTotal;
        totalGst += itemGst;
      });
    }

    const grandTotal = subtotal + totalGst;

    const updateData: any = {
      invoiceNumber,
      customerId,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      customerGstin,
      invoiceDate: invoiceDate ? new Date(invoiceDate) : undefined,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      status,
      notes,
    };

    if (items) {
      updateData.items = items.map((item: any) => ({
        ...item,
        total: item.price * item.quantity + (item.price * item.quantity * item.gst) / 100,
      }));
      updateData.subtotal = subtotal;
      updateData.totalGst = totalGst;
      updateData.grandTotal = grandTotal;
    }

    const invoice = await Invoice.findOneAndUpdate(
      { _id: params.id, userId: session.user.id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json(invoice, { status: 200 });
  } catch (error: any) {
    console.error("Update invoice error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
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

    const invoice = await Invoice.findOneAndDelete({
      _id: params.id,
      userId: session.user.id,
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Invoice deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Delete invoice error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

