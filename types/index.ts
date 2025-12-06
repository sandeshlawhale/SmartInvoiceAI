export interface Customer {
  _id?: string;
  userId: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  gstin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  _id?: string;
  userId: string;
  name: string;
  price: number;
  gst: number;
  hsnCode?: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface InvoiceItem {
  productId?: string;
  name: string;
  quantity: number;
  price: number;
  gst: number;
  total: number;
  hsnCode?: string;
}

export interface Invoice {
  _id?: string;
  userId: string;
  invoiceNumber: string;
  customerId?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  customerGstin?: string;
  sellerDetails?: {
    businessName: string;
    address?: string;
    gstin?: string;
    phone?: string;
    email?: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  totalGst: number;
  grandTotal: number;
  invoiceDate: string | Date;
  dueDate?: string | Date;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  notes?: string;
  customField?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CompanyProfile {
  _id?: string;
  userId: string;
  businessName: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  gstin?: string;
  phone?: string;
  email?: string;
  logo?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Seller {
  _id?: string;
  userId: string;
  businessName: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  gstin?: string;
  phone?: string;
  email?: string;
  logo?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  isDefault?: boolean;
  customField?: string;
  createdAt?: string;
  updatedAt?: string;
}

