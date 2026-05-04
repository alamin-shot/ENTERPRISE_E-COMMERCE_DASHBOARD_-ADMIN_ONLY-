import mongoose, { type Document, type Model, Schema } from "mongoose";

interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
}

interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  unit: "cm" | "in";
}

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  comparePrice: number | null;
  sku: string;
  stock: number;
  category:
    | "electronics"
    | "clothing"
    | "food"
    | "furniture"
    | "sports"
    | "beauty"
    | "other";
  status: "active" | "inactive" | "draft" | "archived";
  images: ProductImage[];
  tags: string[];
  weight: number | null;
  dimensions: ProductDimensions | null;
  createdAt: Date;
  updatedAt: Date;
}

const imageSchema = new Schema<ProductImage>(
  {
    id: { type: String, required: true },
    url: { type: String, required: true },
    alt: { type: String, default: "" },
    isPrimary: { type: Boolean, default: false },
  },
  { _id: false },
);

const dimensionsSchema = new Schema<ProductDimensions>(
  {
    length: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    unit: { type: String, enum: ["cm", "in"], default: "cm" },
  },
  { _id: false },
);

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    comparePrice: { type: Number, default: null },
    sku: { type: String, required: true, unique: true, uppercase: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    category: {
      type: String,
      enum: [
        "electronics",
        "clothing",
        "food",
        "furniture",
        "sports",
        "beauty",
        "other",
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "draft", "archived"],
      default: "draft",
    },
    images: { type: [imageSchema], default: [] },
    tags: { type: [String], default: [] },
    weight: { type: Number, default: null },
    dimensions: { type: dimensionsSchema, default: null },
  },
  { timestamps: true },
);

productSchema.index({ category: 1, status: 1 });
productSchema.index({ name: "text", description: "text" });

export const Product: Model<IProduct> = mongoose.model<IProduct>(
  "Product",
  productSchema,
);
