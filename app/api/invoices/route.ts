import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Invoice from "@/models/Invoice";
import Seller from "@/models/Seller";

interface InvoiceRequestBody {
  invoiceNumber: string;
  customerId?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  status?: string;
  notes?: string;
  items: any[];
  subtotal: number;
  totalGst: number;
  grandTotal: number;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const limit = searchParams.get("limit");

    const query: any = { userId: session.user.id };
    if (status) {
      query.status = status;
    }

    let invoicesQuery = Invoice.find(query).sort({ invoiceDate: -1 });

    if (limit) {
      invoicesQuery = invoicesQuery.limit(Number(limit));
    }

    const invoices = await invoicesQuery;

    return NextResponse.json(invoices, { status: 200 });
  } catch (error: any) {
    console.error("Get invoices error:", error);
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

    const body: InvoiceRequestBody = await request.json();
    const {
      invoiceNumber,
      customerId,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      status = "draft",
      notes,
      items,
      subtotal,
      totalGst,
      grandTotal,
    } = body;

    const seller = await Seller.findOne({
      userId: session.user.id,
      isDefault: true,
    }).sort({ createdAt: -1 });

    const fallbackSeller = await Seller.findOne({
      userId: session.user.id,
    }).sort({ createdAt: -1 });

    const selectedSeller = seller || fallbackSeller;

    const invoice = await Invoice.create({
      invoiceNumber,
      userId: session.user.id,
      customerId,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      status,
      notes,
      items,
      subtotal,
      totalGst,
      grandTotal,
      sellerDetails: selectedSeller
        ? {
          businessName: selectedSeller.businessName,
          address: selectedSeller.address,
          gstin: selectedSeller.gstin,
          phone: selectedSeller.phone,
          email: selectedSeller.email,
        }
        : undefined,
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error: any) {
    console.error("Create invoice error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

