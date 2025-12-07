"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
  gst: number;
  total: number;
  hsnCode?: string;
}

interface InvoicePreviewProps {
  invoiceNumber?: string;
  invoiceDate?: string | Date;
  dueDate?: string | Date;
  seller?: {
    businessName?: string;
    address?: string;
    gstin?: string;
    phone?: string;
    email?: string;
  };
  buyer?: {
    name?: string;
    address?: string;
    gstin?: string;
    phone?: string;
    email?: string;
  };
  items?: InvoiceItem[];
  subtotal?: number;
  totalGst?: number;
  grandTotal?: number;
  notes?: string;
  customField?: string;
}

export function InvoicePreview({
  invoiceNumber = "INV-001",
  invoiceDate,
  dueDate,
  seller,
  buyer,
  items = [],
  subtotal = 0,
  totalGst = 0,
  grandTotal = 0,
  notes,
  customField,
}: InvoicePreviewProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
  });

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;

    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const imgData = canvas.toDataURL("image/png");

      // A5 dimensions in mm: 148 x 210
      const pdf = new jsPDF("p", "mm", "a5");
      const pdfWidth = pdf.internal.pageSize.getWidth();

      // Calculate dimensions to fit width while maintaining aspect ratio
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = pdfWidth / imgWidth;
      const finalHeight = imgHeight * ratio;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, finalHeight);
      pdf.save(`invoice-${invoiceNumber}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <Card className="w-full h-fit flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <CardTitle>Preview</CardTitle>
        <div className="flex gap-2 print:hidden">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handlePrint}>
                  <Printer className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Print Invoice</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleDownloadPDF}>
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download PDF</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="flex-1 bg-muted/50 p-4 overflow-auto flex justify-center items-start">
        {/* A5 Container - Responsive width, aspect ratio of A5 */}
        <div
          ref={invoiceRef}
          className="bg-white text-black p-6 shadow-lg flex flex-col w-full max-w-[148mm] min-h-[210mm] space-y-2"
          style={{
            boxSizing: 'border-box',
          }}
        >
          {/* Header Section: Invoice Name & ID */}
          <div className="">
            <h1 className="text-2xl font-bold tracking-wider uppercase">Invoice</h1>
            <p className="text-lg text-gray-600">#{invoiceNumber}</p>
          </div>

          {/* Customer & Seller Details */}
          <div className="grid grid-cols-2 gap-8 border-t">
            {/* Left: Customer (Bill To) */}
            <div className="text-left">
              <h3 className="text-sm font-bold uppercase mb-0 text-gray-400">Bill To</h3>
              <div className="space-y-0">
                {buyer?.name && <p className="font-semibold text-lg capitalize">{buyer.name}</p>}
                {buyer?.address && <p className="whitespace-pre-line">{buyer.address}</p>}
                {buyer?.gstin && <p>{buyer.gstin}</p>}
                {buyer?.phone && <p>{buyer.phone}</p>}
                {buyer?.email && <p>{buyer.email}</p>}
              </div>
            </div>

            {/* Right: Seller (From) */}
            <div className="text-right">
              <h3 className="text-sm font-bold uppercase mb-0 text-gray-400">From</h3>
              <div className="space-y-0">
                {seller?.businessName && <p className="font-semibold text-lg capitalize">{seller.businessName}</p>}
                {seller?.address && <p className="whitespace-pre-line">{seller.address}</p>}
                {seller?.gstin && <p>{seller.gstin}</p>}
                {seller?.phone && <p>{seller.phone}</p>}
                {seller?.email && <p>{seller.email}</p>}
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="flex justify-between border-y py-2 bg-gray-50 px-4">
            <div className="flex gap-8">
              {invoiceDate && (
                <div>
                  <span className="font-semibold text-gray-600">Invoice Date:</span>
                  <span className="ml-2">{formatDate(invoiceDate)}</span>
                </div>
              )}
              {dueDate && (
                <div>
                  <span className="font-semibold text-gray-600">Due Date:</span>
                  <span className="ml-2">{formatDate(dueDate)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Items Table - Takes available space */}
          <div className="flex-grow">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-800">
                  <th className="text-left py-3 font-bold uppercase text-sm">Item Description</th>
                  <th className="text-center py-3 font-bold uppercase text-sm w-24">Qty</th>
                  <th className="text-right py-3 font-bold uppercase text-sm w-32">Price</th>
                  <th className="text-right py-3 font-bold uppercase text-sm w-24">GST</th>
                  <th className="text-right py-3 font-bold uppercase text-sm w-32">Total</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-4 pr-4">
                      <p className="font-medium text-base">{item.name}</p>
                      {item.hsnCode && <p className="text-xs text-gray-500 mt-1">HSN: {item.hsnCode}</p>}
                    </td>
                    <td className="text-center py-4 align-top">{item.quantity}</td>
                    <td className="text-right py-4 align-top">{formatCurrency(item.price)}</td>
                    <td className="text-right py-4 align-top">{item.gst}%</td>
                    <td className="text-right py-4 align-top font-medium">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Section: Custom Field & Totals */}
          <div className="flex justify-between items-start border-t">
            {/* Left: Custom Field */}
            <div className="w-1/2 pr-12">
              {customField && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-bold text-sm uppercase text-gray-600 mb-2">Additional Details</h4>
                  <p className="whitespace-pre-wrap text-sm">{customField}</p>
                </div>
              )}
            </div>

            {/* Right: Totals */}
            <div className="w-1/3">
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST Total</span>
                  <span>{formatCurrency(totalGst)}</span>
                </div>
                <div className="border-t border-gray-800 pt-3 flex justify-between text-xl font-bold">
                  <span>Grand Total</span>
                  <span>{formatCurrency(grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer: Notes */}
          {notes && (
            <div className="border-t pt-2 mt-auto">
              <p className="text-sm text-gray-600 italic">
                <span className="font-bold not-italic mr-2">Note:</span>
                {notes}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
