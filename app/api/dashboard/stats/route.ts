import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Invoice from "@/models/Invoice";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const userId = new mongoose.Types.ObjectId(session.user.id);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Total invoices
    const totalInvoices = await Invoice.countDocuments({
      userId: session.user.id,
    });

    // Total sales (sum of all paid invoices)
    const totalSalesResult = await Invoice.aggregate([
      {
        $match: {
          userId: userId,
          status: "paid",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$grandTotal" },
        },
      },
    ]);
    const totalSales = totalSalesResult[0]?.total || 0;

    // Monthly sales
    const monthlySalesResult = await Invoice.aggregate([
      {
        $match: {
          userId: userId,
          invoiceDate: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$grandTotal" },
        },
      },
    ]);
    const monthlySales = monthlySalesResult[0]?.total || 0;

    // GST summary
    const gstSummary = await Invoice.aggregate([
      {
        $match: {
          userId: userId,
          invoiceDate: { $gte: startOfYear },
        },
      },
      {
        $group: {
          _id: null,
          totalGst: { $sum: "$totalGst" },
          totalSales: { $sum: "$grandTotal" },
        },
      },
    ]);

    // Monthly chart data (last 6 months)
    const monthlyChartData = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const monthData = await Invoice.aggregate([
        {
          $match: {
            userId: userId,
            invoiceDate: { $gte: monthStart, $lte: monthEnd },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$grandTotal" },
          },
        },
      ]);

      monthlyChartData.push({
        month: monthStart.toLocaleDateString("en-US", { month: "short" }),
        total: monthData[0]?.total || 0,
      });
    }

    // Last 5 invoices
    const lastInvoices = await Invoice.find({ userId: session.user.id })
      .sort({ invoiceDate: -1 })
      .limit(5)
      .select("invoiceNumber customerName grandTotal status invoiceDate");

    return NextResponse.json(
      {
        totalInvoices,
        totalSales,
        monthlySales,
        gstSummary: {
          totalGst: gstSummary[0]?.totalGst || 0,
          totalSales: gstSummary[0]?.totalSales || 0,
        },
        monthlyChartData,
        lastInvoices,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Get dashboard stats error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

