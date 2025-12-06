"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { InvoicePreview } from "@/components/invoice-preview";
import { FileUploader } from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ScanLine, FileText } from "lucide-react";

export default function InvoiceReaderPage() {
  const [file, setFile] = useState<File | null>(null);
  const [ocrText, setOcrText] = useState("");
  const [processing, setProcessing] = useState(false);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const { toast } = useToast();

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setOcrText("");
    setInvoiceData(null);
  };

  const handleOCR = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file first",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const ocrResponse = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      });

      if (!ocrResponse.ok) {
        throw new Error("OCR failed");
      }

      const ocrResult = await ocrResponse.json();
      setOcrText(ocrResult.text);

      // Now process with AI
      const aiResponse = await fetch("/api/ai/read-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ocrText: ocrResult.text }),
      });

      if (!aiResponse.ok) {
        throw new Error("AI processing failed");
      }

      const aiResult = await aiResponse.json();
      setInvoiceData(aiResult);

      toast({
        title: "Success",
        description: "Invoice processed successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process invoice",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleCreateInvoice = async () => {
    if (!invoiceData) return;

    try {
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceNumber: invoiceData.invoice?.invoiceNumber || `INV-${Date.now()}`,
          customerName: invoiceData.buyer?.name || "",
          customerEmail: invoiceData.buyer?.email,
          customerPhone: invoiceData.buyer?.phone,
          customerAddress: invoiceData.buyer?.address,
          customerGstin: invoiceData.buyer?.gstin,
          items: invoiceData.products || [],
          invoiceDate: invoiceData.invoice?.date || new Date().toISOString(),
          dueDate: invoiceData.invoice?.dueDate,
          status: "draft",
          notes: invoiceData.invoice?.notes,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Invoice created successfully!",
        });
      } else {
        throw new Error("Failed to create invoice");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create invoice",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 relative">
        {/* Coming Soon Overlay */}
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm rounded-lg">
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-bold tracking-tight">Coming Soon</h2>
            <p className="text-muted-foreground text-lg">
              We are working hard to bring you this feature.
            </p>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold">Invoice Reader</h1>
          <p className="text-muted-foreground">Upload and extract invoice data using OCR + AI</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 opacity-50 pointer-events-none select-none">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ScanLine className="h-5 w-5" />
                Upload Invoice
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FileUploader
                onFileSelect={handleFileSelect}
                accept="image/*,.pdf"
              />
              {file && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    File: {file.name}
                  </p>
                  <Button
                    onClick={handleOCR}
                    disabled={processing}
                    className="w-full"
                  >
                    {processing ? "Processing..." : "Extract Invoice Data"}
                  </Button>
                </div>
              )}

              {ocrText && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Extracted Text</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs whitespace-pre-wrap max-h-64 overflow-y-auto">
                      {ocrText}
                    </pre>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          <div className="space-y-4">
            {invoiceData && (
              <>
                <InvoicePreview
                  invoiceNumber={invoiceData.invoice?.invoiceNumber || "INV-001"}
                  invoiceDate={invoiceData.invoice?.date}
                  dueDate={invoiceData.invoice?.dueDate}
                  seller={invoiceData.seller}
                  buyer={invoiceData.buyer}
                  items={invoiceData.products || []}
                  subtotal={invoiceData.totals?.subtotal || 0}
                  totalGst={invoiceData.totals?.totalGst || 0}
                  grandTotal={invoiceData.totals?.grandTotal || 0}
                  notes={invoiceData.invoice?.notes}
                />
                <Button onClick={handleCreateInvoice} className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Create Invoice
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

