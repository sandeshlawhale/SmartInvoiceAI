import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInvoiceItem {
  productId?: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
  gst: number;
  total: number;
  hsnCode?: string;
}

export interface IInvoice extends Document {
  userId: mongoose.Types.ObjectId;
  invoiceNumber: string;
  customerId?: mongoose.Types.ObjectId;
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
  items: IInvoiceItem[];
  subtotal: number;
  totalGst: number;
  grandTotal: number;
  invoiceDate: Date;
  dueDate?: Date;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  notes?: string;
  customField?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceItemSchema: Schema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    gst: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    hsnCode: {
      type: String,
    },
  },
  { _id: false }
);

const InvoiceSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
    },
    customerName: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
    },
    customerPhone: {
      type: String,
    },
    customerAddress: {
      type: String,
    },
    sellerDetails: {
      businessName: String,
      address: String,
      gstin: String,
      phone: String,
      email: String,
    },
    customerGstin: {
      type: String,
    },
    items: {
      type: [InvoiceItemSchema],
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    totalGst: {
      type: Number,
      required: true,
      min: 0,
    },
    grandTotal: {
      type: Number,
      required: true,
      min: 0,
    },
    invoiceDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dueDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["draft", "sent", "paid", "overdue", "cancelled"],
      default: "draft",
    },
    notes: {
      type: String,
    },
    customField: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

InvoiceSchema.index({ userId: 1, invoiceNumber: 1 });
InvoiceSchema.index({ userId: 1, invoiceDate: -1 });

const Invoice: Model<IInvoice> =
  mongoose.models.Invoice || mongoose.model<IInvoice>("Invoice", InvoiceSchema);

export default Invoice;

