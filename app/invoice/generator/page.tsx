"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { InvoicePreview } from "@/components/invoice-preview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { Plus, Trash2, Sparkles } from "lucide-react";
import type { Customer, Product, InvoiceItem, Seller } from "@/types";
import { AsyncCombobox } from "@/components/ui/async-combobox";
import { SellerDialog } from "@/components/sellers/seller-dialog";
import { CustomerDialog } from "@/components/customers/customer-dialog";
import { ProductDialog } from "@/components/products/product-dialog";
import { useModalStore } from "@/store/useModalStore";

export default function InvoiceGeneratorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InvoiceGeneratorContent />
    </Suspense>
  );
}

function InvoiceGeneratorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get("invoiceId");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [selectedSellerId, setSelectedSellerId] = useState<string>("");
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const { onOpenSellerModal, onOpenCustomerModal, onOpenProductModal } = useModalStore();
  const { toast } = useToast();

  // Invoice form state
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [aiInput, setAiInput] = useState("");
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newProductName, setNewProductName] = useState("");
  const [customField, setCustomField] = useState("");
  const [status, setStatus] = useState<string>("draft");

  useEffect(() => {
    fetchData();
    if (invoiceId) {
      fetchInvoiceDetails(invoiceId);
    } else {
      generateInvoiceNumber();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceId]);

  const fetchInvoiceDetails = async (id: string) => {
    try {
      const res = await fetch(`/api/invoices/${id}`);
      if (res.ok) {
        const invoice = await res.json();
        setInvoiceNumber(invoice.invoiceNumber);
        setInvoiceDate(new Date(invoice.invoiceDate).toISOString().split("T")[0]);
        if (invoice.dueDate) setDueDate(new Date(invoice.dueDate).toISOString().split("T")[0]);
        setNotes(invoice.notes || "");
        setCustomField(invoice.customField || "");
        setStatus(invoice.status || "draft");
        setItems(invoice.items);

        // Set customer
        if (invoice.customerId) {
          setSelectedCustomerId(invoice.customerId);
          const customerRes = await fetch(`/api/customers/${invoice.customerId}`);
          if (customerRes.ok) {
            const customer = await customerRes.json();
            setSelectedCustomer(customer);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching invoice:", error);
      toast({
        title: "Error",
        description: "Failed to load invoice details",
        variant: "destructive",
      });
    }
  };

  const fetchData = async () => {
    try {
      const [productsRes] = await Promise.all([
        fetch("/api/products"),
      ]);

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData);
      }

      // Initial fetch for default seller
      const sellersRes = await fetch("/api/sellers");
      if (sellersRes.ok) {
        const sellersData = await sellersRes.json();
        setSellers(sellersData);
        if (sellersData.length > 0) {
          const defaultSeller = sellersData.find((s: Seller) => s.isDefault) || sellersData[0];
          if (defaultSeller._id) {
            setSelectedSellerId(defaultSeller._id);
            setSelectedSeller(defaultSeller);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchSellers = async (query: string) => {
    const res = await fetch(`/api/sellers?search=${encodeURIComponent(query)}`);
    const data = await res.json();
    return data.map((s: Seller) => ({
      value: s._id,
      label: s.businessName,
    }));
  };

  const searchCustomers = async (query: string) => {
    const res = await fetch(`/api/customers?search=${encodeURIComponent(query)}`);
    const data = await res.json();
    return data.map((c: Customer) => ({
      value: c._id,
      label: c.name,
      phone: c.phone
    }));
  };

  const searchProducts = async (query: string) => {
    const res = await fetch(`/api/products?search=${encodeURIComponent(query)}`);
    const data = await res.json();
    return data.map((p: Product) => ({
      value: p._id,
      label: p.name,
      original: p, // Pass full object to handle selection
    }));
  };

  const generateInvoiceNumber = () => {
    const timestamp = Date.now();
    setInvoiceNumber(`INV-${timestamp}`);
  };

  const handleCustomerSelect = async (customerId: string) => {
    setSelectedCustomerId(customerId);
    if (customerId) {
      const res = await fetch(`/api/customers/${customerId}`);
      if (res.ok) {
        const customer = await res.json();
        setSelectedCustomer(customer);
      }
    } else {
      setSelectedCustomer(null);
    }
  };

  const handleSellerSelect = async (sellerId: string) => {
    setSelectedSellerId(sellerId);
    if (sellerId) {
      const existing = sellers.find(s => s._id === sellerId);
      if (existing) {
        setSelectedSeller(existing);
      } else {
        const res = await fetch(`/api/sellers/${sellerId}`);
        if (res.ok) {
          const seller = await res.json();
          setSelectedSeller(seller);
          if (seller.customField) {
            setCustomField(seller.customField);
          }
        }
      }
    } else {
      setSelectedSeller(null);
      setCustomField("");
    }
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        name: "",
        quantity: 1,
        price: 0,
        gst: 0,
        total: 0,
      },
    ]);
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    // Recalculate total
    if (field === "quantity" || field === "price" || field === "gst") {
      const item = newItems[index];
      const itemTotal = item.price * item.quantity;
      const itemGst = (itemTotal * item.gst) / 100;
      newItems[index].total = itemTotal + itemGst;
    }

    setItems(newItems);
  };

  const handleProductSelect = async (index: number, productId: string) => {
    if (!productId) return;

    // Try to find in local products first
    let product = products.find(p => p._id === productId);

    // If not found, fetch it
    if (!product) {
      const res = await fetch(`/api/products/${productId}`);
      if (res.ok) {
        product = await res.json();
      }
    }

    if (product) {
      const newItems = [...items];
      newItems[index] = {
        ...newItems[index],
        name: product.name,
        price: product.price,
        gst: product.gst,
        hsnCode: product.hsnCode,
      };

      // Recalculate total
      const itemTotal = product.price * newItems[index].quantity;
      const itemGst = (itemTotal * product.gst) / 100;
      newItems[index].total = itemTotal + itemGst;

      setItems(newItems);
    }
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalGst = items.reduce(
      (sum, item) => sum + (item.price * item.quantity * item.gst) / 100,
      0
    );
    const grandTotal = subtotal + totalGst;
    return { subtotal, totalGst, grandTotal };
  };

  const handleAiFill = async () => {
    if (!aiInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text for AI to process",
        variant: "destructive",
      });
      return;
    }

    setAiLoading(true);
    try {
      const response = await fetch("/api/ai/fill-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: aiInput }),
      });

      if (!response.ok) {
        throw new Error("AI processing failed");
      }

      const data = await response.json();

      // Fill buyer information
      if (data.buyer) {
        if (data.buyer.needsNewCustomer) {
          // Create new customer
          const customerRes = await fetch("/api/customers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data.buyer),
          });
          if (customerRes.ok) {
            const newCustomer = await customerRes.json();
            setCustomers([...customers, newCustomer]);
            if (newCustomer._id) {
              setSelectedCustomerId(newCustomer._id);
              setSelectedCustomer(newCustomer);
            }
          }
        } else {
          // Find existing customer
          const existingCustomer = customers.find(
            (c) => c.name.toLowerCase() === data.buyer.name.toLowerCase()
          );
          if (existingCustomer && existingCustomer._id) {
            setSelectedCustomerId(existingCustomer._id);
            setSelectedCustomer(existingCustomer);
          }
        }
      }

      // Fill products
      if (data.products && data.products.length > 0) {
        setItems(
          data.products.map((product: { name: string; quantity?: number; price?: number; gst?: number; hsnCode?: string }) => ({
            name: product.name,
            quantity: product.quantity || 1,
            price: product.price || 0,
            gst: product.gst || 0,
            hsnCode: product.hsnCode || "",
            total: (product.price || 0) * (product.quantity || 1) * (1 + (product.gst || 0) / 100),
          }))
        );
      }

      // Fill invoice date if provided
      if (data.invoice?.date) {
        setInvoiceDate(data.invoice.date);
      }

      if (data.invoice?.notes) {
        setNotes(data.invoice.notes);
      }

      toast({
        title: "Success",
        description: "Invoice form filled successfully!",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to process AI input",
        variant: "destructive",
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedCustomer) {
      toast({
        title: "Error",
        description: "Please select a customer",
        variant: "destructive",
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one item",
        variant: "destructive",
      });
      return;
    }

    const { subtotal, totalGst, grandTotal } = calculateTotals();

    try {
      const url = invoiceId ? `/api/invoices/${invoiceId}` : "/api/invoices";
      const method = invoiceId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceNumber,
          customerId: selectedCustomerId,
          customerName: selectedCustomer.name,
          customerEmail: selectedCustomer.email,
          customerPhone: selectedCustomer.phone,
          customerAddress: selectedCustomer.address,
          customerGstin: selectedCustomer.gstin,
          subtotal,
          totalGst,
          grandTotal,
          items,
          invoiceDate,
          dueDate,
          status,
          notes,
          customField,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Invoice saved successfully!",
        });

        if (!invoiceId) {
          // Reset form only if creating new
          setItems([]);
          setSelectedCustomerId("");
          setSelectedCustomer(null);
          generateInvoiceNumber();
          setStatus("draft");
        } else {
          router.push("/invoice"); // Redirect to tracker after edit
        }
      } else {
        throw new Error("Failed to save invoice");
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to save invoice",
        variant: "destructive",
      });
    }
  };

  const { subtotal, totalGst, grandTotal } = calculateTotals();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-[600px] w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Invoice Generator</h1>
          <p className="text-muted-foreground">Create and manage invoices</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-1 space-y-4">
            {/* TOP: AI Input */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    AI Auto Fill
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Enter invoice details in natural language</Label>
                    <Textarea
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      placeholder="Example: Add 2 jeans worth 1500 each for Rohan Gupta GSTIN 27XXXXX"
                      rows={8}
                    />
                  </div>
                  <Button
                    onClick={handleAiFill}
                    disabled={aiLoading}
                    className="w-full"
                  >
                    {aiLoading ? "Processing..." : "AI Auto Fill"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* BOTTOM: Form */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Invoice Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Invoice Number</Label>
                    <Input
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Seller</Label>

                    <AsyncCombobox
                      label="Seller"
                      fetcher={searchSellers}
                      value={selectedSellerId}
                      onSelect={handleSellerSelect}
                      onCreate={() => onOpenSellerModal()}
                      placeholder="Select or add seller..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Customer</Label>

                    <AsyncCombobox
                      label="Customer"
                      fetcher={searchCustomers}
                      value={selectedCustomerId}
                      onSelect={handleCustomerSelect}
                      onCreate={(query) => {
                        setNewCustomerName(query);
                        onOpenCustomerModal();
                      }}
                      placeholder="Select or add customer..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Invoice Date</Label>
                      <Input
                        type="date"
                        value={invoiceDate}
                        onChange={(e) => setInvoiceDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Due Date</Label>
                      <Input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Items</Label>
                    <div className="space-y-2">
                      {items.map((item, index) => (
                        <div key={index} className="flex gap-2 items-end border p-2 rounded">
                          <div className="flex-1 space-y-1">
                            <AsyncCombobox
                              label="Product"
                              fetcher={searchProducts}
                              value={item.name}
                              onSelect={(val) => handleProductSelect(index, val)}
                              onCreate={(query) => {
                                setNewProductName(query);
                                onOpenProductModal();
                              }}
                              placeholder="Select or add product..."
                              className="w-full"
                            />

                            <div className="grid grid-cols-3 gap-2 mt-2">
                              <Input
                                type="number"
                                placeholder="Qty"
                                value={item.quantity}
                                onChange={(e) =>
                                  updateItem(index, "quantity", Number(e.target.value))
                                }
                              />
                              <Input
                                type="number"
                                placeholder="Price"
                                value={item.price}
                                onChange={(e) =>
                                  updateItem(index, "price", Number(e.target.value))
                                }
                              />
                              <Input
                                type="number"
                                placeholder="GST %"
                                value={item.gst}
                                onChange={(e) =>
                                  updateItem(index, "gst", Number(e.target.value))
                                }
                              />
                            </div>
                          </div>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => removeItem(index)}
                            className="mb-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button variant="outline" onClick={addItem} className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Item
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Custom Field</Label>
                    <Textarea
                      value={customField}
                      onChange={(e) => setCustomField(e.target.value)}
                      placeholder="Bank Details, Terms, etc."
                    />
                  </div>

                  <div className="space-y-0">
                    <Label>Notes</Label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Additional notes..."
                    />
                  </div>

                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST:</span>
                      <span>{formatCurrency(totalGst)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Grand Total:</span>
                      <span>{formatCurrency(grandTotal)}</span>
                    </div>
                  </div>

                  <Button onClick={handleSave} className="w-full">
                    Save Invoice
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* RIght: Invoice Preview */}
          <div className="lg:col-span-1">
            <InvoicePreview
              invoiceNumber={invoiceNumber}
              invoiceDate={invoiceDate}
              dueDate={dueDate}
              seller={selectedSeller || undefined}
              buyer={selectedCustomer || undefined}
              items={items}
              subtotal={subtotal}
              totalGst={totalGst}
              grandTotal={grandTotal}
              notes={notes}
              customField={customField}
            />
          </div>
        </div>

        <SellerDialog
          onSuccess={(seller) => {
            setSellers([...sellers, seller]);
            handleSellerSelect(seller._id!);
          }}
        />

        <CustomerDialog
          initialName={newCustomerName}
          onSuccess={(customer) => {
            handleCustomerSelect(customer._id!);
          }}
        />

        <ProductDialog
          initialName={newProductName}
          onSuccess={(product) => {
            setProducts([...products, product]);
          }}
        />
      </div>
    </DashboardLayout>
  );
}
