import mongoose, { type Document, type Model, Schema } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "admin" | "manager" | "viewer";
  status: "active" | "inactive" | "suspended" | "pending";
  avatar: string | null;
  isEmailVerified: boolean;
  phone: string | null;
  address: UserAddress | null;
  lastLoginAt: Date | null;
  totalOrders: number;
  totalSpent: number;
  createdAt: Date;
  updatedAt: Date;
}

interface UserAddress {
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

const addressSchema = new Schema<UserAddress>(
  {
    line1: { type: String, required: true },
    line2: { type: String, default: null },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false },
);

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["admin", "manager", "viewer"],
      default: "viewer",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended", "pending"],
      default: "pending",
    },
    avatar: { type: String, default: null },
    isEmailVerified: { type: Boolean, default: false },
    phone: { type: String, default: null },
    address: { type: addressSchema, default: null },
    lastLoginAt: { type: Date, default: null },
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
  },
  { timestamps: true },
);

userSchema.index({ role: 1, status: 1 });

export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
