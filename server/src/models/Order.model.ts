import mongoose, { type Document, type Model, Schema } from "mongoose";

interface OrderCustomer {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
}

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string | null;
  sku: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Address {
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;
  orderNumber: string;
  customer: OrderCustomer;
  items: OrderItem[];
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "refunded";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod: "card" | "paypal" | "bank_transfer" | "cash";
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: Address;
  billingAddress: Address;
  notes: string | null;
  trackingNumber: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema<Address>(
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

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    customer: {
      id: String,
      name: String,
      email: String,
      avatar: { type: String, default: null },
    },
    items: [
      {
        id: String,
        productId: String,
        productName: String,
        productImage: { type: String, default: null },
        sku: String,
        quantity: Number,
        unitPrice: Number,
        total: Number,
      },
    ],
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
      ],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["card", "paypal", "bank_transfer", "cash"],
      required: true,
    },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    total: { type: Number, required: true },
    shippingAddress: { type: addressSchema, required: true },
    billingAddress: { type: addressSchema, required: true },
    notes: { type: String, default: null },
    trackingNumber: { type: String, default: null },
  },
  { timestamps: true },
);

orderSchema.index({ "customer.id": 1 });
orderSchema.index({ status: 1, createdAt: -1 });

export const Order: Model<IOrder> = mongoose.model<IOrder>(
  "Order",
  orderSchema,
);
