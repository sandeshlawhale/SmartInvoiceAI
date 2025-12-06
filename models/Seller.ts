import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISeller extends Document {
  userId: mongoose.Types.ObjectId;
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
  createdAt: Date;
  updatedAt: Date;
}

const SellerSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    pincode: {
      type: String,
      trim: true,
    },
    gstin: {
      type: String,
      trim: true,
      uppercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    logo: {
      type: String,
    },
    bankName: {
      type: String,
      trim: true,
    },
    accountNumber: {
      type: String,
      trim: true,
    },
    ifscCode: {
      type: String,
      trim: true,
      uppercase: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    customField: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

SellerSchema.index({ userId: 1 });
SellerSchema.index({ userId: 1, isDefault: 1 });

const Seller: Model<ISeller> =
  mongoose.models.Seller || mongoose.model<ISeller>("Seller", SellerSchema);

export default Seller;

