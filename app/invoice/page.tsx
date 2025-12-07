"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Eye, Edit, Trash2, Download } from "lucide-react";
import type { Invoice, Seller } from "@/types";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InvoicePreview } from "@/components/invoice-preview";

export default function InvoiceTrackerPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null);
  const [downloadingInvoice, setDownloadingInvoice] = useState<Invoice | null>(null);
  const [defaultSeller, setDefaultSeller] = useState<Seller | null>(null);
  const downloadRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchInvoices();
    fetchDefaultSeller();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  useEffect(() => {
    if (downloadingInvoice && downloadRef.current) {
      generatePDF();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downloadingInvoice]);

  const fetchDefaultSeller = async () => {
    try {
      const response = await fetch("/api/sellers");
      if (response.ok) {
        const sellers = await response.json();
        const defaultS = sellers.find((s: Seller) => s.isDefault) || sellers[0];
        setDefaultSeller(defaultS);
      }
    } catch (error) {
      console.error("Error fetching sellers:", error);
    }
  };

  const fetchInvoices = async () => {
    try {
      const url =
        statusFilter === "all"
          ? "/api/invoices"
          : `/api/invoices?status=${statusFilter}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setInvoices(data);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setInvoiceToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!invoiceToDelete) return;

    try {
      const response = await fetch(`/api/invoices/${invoiceToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Invoice deleted successfully",
        });
        fetchInvoices();
      } else {
        throw new Error("Failed to delete invoice");
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete invoice",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setInvoiceToDelete(null);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/invoice/generator?invoiceId=${id}`);
  };

  const handleDownload = (invoice: Invoice) => {
    setDownloadingInvoice(invoice);
  };

  const generatePDF = async () => {
    if (!downloadRef.current || !downloadingInvoice) return;

    try {
      const canvas = await html2canvas(downloadRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a5");
      const pdfWidth = pdf.internal.pageSize.getWidth();

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = pdfWidth / imgWidth;
      const finalHeight = imgHeight * ratio;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, finalHeight);
      pdf.save(`invoice-${downloadingInvoice.invoiceNumber}.pdf`);

      toast({
        title: "Success",
        description: "Invoice downloaded successfully",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive",
      });
    } finally {
      setDownloadingInvoice(null);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      // Optimistic update
      setInvoices(invoices.map(inv => inv._id === id ? { ...inv, status: newStatus as Invoice['status'] } : inv));

      const response = await fetch(`/api/invoices/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      toast({
        title: "Success",
        description: "Status updated successfully",
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
      fetchInvoices(); // Revert on error
    }
  };

  const handlePreview = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsPreviewOpen(true);
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-48" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Invoice Tracker</h1>
            <p className="text-muted-foreground">View and manage all your invoices</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Search by invoice number or customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>GST</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map((invoice) => (
                    <TableRow key={invoice._id}>
                      <TableCell className="font-medium">
                        {invoice.invoiceNumber}
                      </TableCell>
                      <TableCell>{invoice.customerName}</TableCell>
                      <TableCell>{formatDate(invoice.invoiceDate)}</TableCell>
                      <TableCell>{formatCurrency(invoice.grandTotal)}</TableCell>
                      <TableCell>{formatCurrency(invoice.totalGst)}</TableCell>
                      <TableCell>
                        <Select
                          value={invoice.status}
                          onValueChange={(val) => handleStatusChange(invoice._id!, val)}
                        >
                          <SelectTrigger className={`h-8 w-32 border-0 ${invoice.status === "paid"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : invoice.status === "sent"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                              : invoice.status === "overdue"
                                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                            }`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="sent">Sent</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="overdue">Overdue</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handlePreview(invoice)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Preview Invoice</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEdit(invoice._id!)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Edit Invoice</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDownload(invoice)}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Download PDF</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteClick(invoice._id!)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete Invoice</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No invoices found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Preview Dialog */}
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Invoice Preview</DialogTitle>
            </DialogHeader>
            {selectedInvoice && (
              <InvoicePreview
                invoiceNumber={selectedInvoice.invoiceNumber}
                invoiceDate={selectedInvoice.invoiceDate}
                dueDate={selectedInvoice.dueDate}
                seller={selectedInvoice.sellerDetails || defaultSeller || {}}
                buyer={{
                  name: selectedInvoice.customerName,
                  email: selectedInvoice.customerEmail,
                  phone: selectedInvoice.customerPhone,
                  address: selectedInvoice.customerAddress,
                  gstin: selectedInvoice.customerGstin,
                }}
                items={selectedInvoice.items}
                subtotal={selectedInvoice.subtotal}
                totalGst={selectedInvoice.totalGst}
                grandTotal={selectedInvoice.grandTotal}
                notes={selectedInvoice.notes}
                customField={selectedInvoice.customField}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Invoice</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this invoice? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Hidden Invoice for Download */}
        <div className="fixed left-[-9999px] top-0">
          {downloadingInvoice && (
            <div ref={downloadRef}>
              <InvoicePreview
                invoiceNumber={downloadingInvoice.invoiceNumber}
                invoiceDate={downloadingInvoice.invoiceDate}
                dueDate={downloadingInvoice.dueDate}
                seller={downloadingInvoice.sellerDetails || defaultSeller || {}}
                buyer={{
                  name: downloadingInvoice.customerName,
                  email: downloadingInvoice.customerEmail,
                  phone: downloadingInvoice.customerPhone,
                  address: downloadingInvoice.customerAddress,
                  gstin: downloadingInvoice.customerGstin,
                }}
                items={downloadingInvoice.items}
                subtotal={downloadingInvoice.subtotal}
                totalGst={downloadingInvoice.totalGst}
                grandTotal={downloadingInvoice.grandTotal}
                notes={downloadingInvoice.notes}
                customField={downloadingInvoice.customField}
              />
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
