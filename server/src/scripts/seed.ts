import "dotenv/config";
import mongoose from "mongoose";
import { User } from "../models/User.model";
import { Product } from "../models/Product.model";
import { Order } from "../models/Order.model";
import { hashPassword } from "../utils/bcrypt";
import { env } from "../config/env";

// ─── Seed Data (matches src/lib/mock exactly) ──────────────────────────────────
const USERS = [
  {
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice@example.com",
    role: "admin" as const,
    status: "active" as const,
    isEmailVerified: true,
    phone: "+1 (503) 555-0101",
  },
  {
    firstName: "Bob",
    lastName: "Smith",
    email: "bob@example.com",
    role: "manager" as const,
    status: "active" as const,
    isEmailVerified: true,
    phone: "+1 (206) 555-0202",
  },
  {
    firstName: "Carol",
    lastName: "White",
    email: "carol@example.com",
    role: "viewer" as const,
    status: "active" as const,
    isEmailVerified: true,
    phone: "+1 (212) 555-0303",
  },
  {
    firstName: "David",
    lastName: "Brown",
    email: "david@example.com",
    role: "viewer" as const,
    status: "inactive" as const,
    isEmailVerified: false,
    phone: null,
  },
  {
    firstName: "Eva",
    lastName: "Martinez",
    email: "eva@example.com",
    role: "viewer" as const,
    status: "active" as const,
    isEmailVerified: true,
    phone: "+1 (305) 555-0404",
  },
  {
    firstName: "Frank",
    lastName: "Wilson",
    email: "frank@example.com",
    role: "manager" as const,
    status: "suspended" as const,
    isEmailVerified: true,
    phone: "+1 (415) 555-0505",
  },
  {
    firstName: "Grace",
    lastName: "Davis",
    email: "grace@example.com",
    role: "viewer" as const,
    status: "active" as const,
    isEmailVerified: true,
    phone: "+33 1 55 55 06 06",
  },
  {
    firstName: "Henry",
    lastName: "Taylor",
    email: "henry@example.com",
    role: "viewer" as const,
    status: "active" as const,
    isEmailVerified: true,
    phone: "+44 20 7946 0707",
  },
  {
    firstName: "Iris",
    lastName: "Chen",
    email: "iris@example.com",
    role: "viewer" as const,
    status: "pending" as const,
    isEmailVerified: false,
    phone: null,
  },
  {
    firstName: "James",
    lastName: "Walker",
    email: "james@example.com",
    role: "viewer" as const,
    status: "active" as const,
    isEmailVerified: true,
    phone: "+1 (416) 555-0808",
  },
  {
    firstName: "Kelly",
    lastName: "Nakamura",
    email: "kelly@example.com",
    role: "admin" as const,
    status: "active" as const,
    isEmailVerified: true,
    phone: "+81 3 1234 0909",
  },
  {
    firstName: "Liam",
    lastName: "O'Brien",
    email: "liam@example.com",
    role: "viewer" as const,
    status: "inactive" as const,
    isEmailVerified: false,
    phone: null,
  },
];

const PRODUCTS = [
  {
    name: "Quantum Headphones",
    sku: "QHP-1001",
    price: 299.99,
    comparePrice: 349.99,
    stock: 45,
    category: "electronics" as const,
    status: "active" as const,
    description:
      "Active noise cancellation with 40-hour battery life and spatial audio support.",
    tags: ["premium", "bestseller"],
    weight: 0.25,
  },
  {
    name: "Nebula Smartwatch",
    sku: "NSW-2002",
    price: 449.0,
    comparePrice: null,
    stock: 3,
    category: "electronics" as const,
    status: "active" as const,
    description:
      "Health monitoring with AMOLED display, GPS, and 7-day battery.",
    tags: ["wearable", "new"],
    weight: 0.052,
  },
  {
    name: "AeroLite Running Shoes",
    sku: "ALS-3003",
    price: 189.99,
    comparePrice: 219.99,
    stock: 0,
    category: "sports" as const,
    status: "active" as const,
    description:
      "Carbon-fiber plate with responsive foam midsole for marathon performance.",
    tags: ["sale", "popular"],
    weight: 0.28,
  },
  {
    name: "Nordic Lounge Chair",
    sku: "NLC-4004",
    price: 1299.0,
    comparePrice: null,
    stock: 8,
    category: "furniture" as const,
    status: "active" as const,
    description:
      "Solid oak frame with wool-blend upholstery. Danish design heritage.",
    tags: ["premium", "handmade"],
    weight: 12.5,
  },
  {
    name: "Organic Matcha Set",
    sku: "OMS-5005",
    price: 54.99,
    comparePrice: 64.99,
    stock: 120,
    category: "food" as const,
    status: "active" as const,
    description:
      "Ceremonial grade matcha powder with bamboo whisk and ceramic bowl.",
    tags: ["organic", "bestseller"],
    weight: 0.45,
  },
  {
    name: "Serum Lumière",
    sku: "SRL-6006",
    price: 78.0,
    comparePrice: null,
    stock: 2,
    category: "beauty" as const,
    status: "active" as const,
    description:
      "Vitamin C and hyaluronic acid brightening serum. Dermatologist tested.",
    tags: ["skincare", "vegan"],
    weight: 0.03,
  },
  {
    name: "Titanium Camping Stove",
    sku: "TCS-7007",
    price: 89.99,
    comparePrice: 109.99,
    stock: 35,
    category: "sports" as const,
    status: "active" as const,
    description: "Ultralight wood-burning stove. Folds flat, weighs only 180g.",
    tags: ["outdoor", "lightweight"],
    weight: 0.18,
  },
  {
    name: "Merino Travel Blazer",
    sku: "MTB-8008",
    price: 349.0,
    comparePrice: null,
    stock: 0,
    category: "clothing" as const,
    status: "draft" as const,
    description:
      "Wrinkle-resistant merino wool blazer with hidden passport pocket.",
    tags: ["travel", "new"],
    weight: 0.65,
  },
  {
    name: "Carbon Fiber Desk",
    sku: "CFD-9009",
    price: 1899.0,
    comparePrice: 2199.0,
    stock: 6,
    category: "furniture" as const,
    status: "active" as const,
    description:
      "Standing desk with carbon fiber surface, dual motor lift, memory presets.",
    tags: ["premium", "ergonomic"],
    weight: 34.0,
  },
  {
    name: "Artisan Sourdough Kit",
    sku: "ASK-1010",
    price: 44.99,
    comparePrice: null,
    stock: 200,
    category: "food" as const,
    status: "active" as const,
    description:
      "Complete kit with starter culture, proofing basket, and lame. Bakes 12 loaves.",
    tags: ["kit", "popular"],
    weight: 1.2,
  },
  {
    name: "Retro Vinyl Player",
    sku: "RVP-1111",
    price: 249.99,
    comparePrice: 299.99,
    stock: 1,
    category: "electronics" as const,
    status: "archived" as const,
    description:
      "Belt-driven turntable with built-in speakers and Bluetooth 5.3 output.",
    tags: ["retro", "clearance"],
    weight: 4.8,
  },
  {
    name: "Silk Sleep Mask",
    sku: "SSM-1212",
    price: 34.99,
    comparePrice: null,
    stock: 85,
    category: "beauty" as const,
    status: "active" as const,
    description:
      "100% mulberry silk with adjustable strap. Blocks 99.9% of light.",
    tags: ["sleep", "vegan"],
    weight: 0.04,
  },
];

async function seed(): Promise<void> {
  console.log("🌱 Connecting to MongoDB...");
  await mongoose.connect(env.mongoUri, { dbName: "enterprise_dashboard" });

  console.log("🧹 Clearing existing data...");
  await Promise.all([
    User.deleteMany({}),
    Product.deleteMany({}),
    Order.deleteMany({}),
  ]);

  // ─── Seed Admin ──────────────────────────────────────────────────────────────
  console.log("👤 Seeding admin user...");
  const adminPassword = await hashPassword(env.seedAdminPassword);
  await User.create({
    firstName: "Admin",
    lastName: "User",
    email: env.seedAdminEmail,
    password: adminPassword,
    role: "admin",
    status: "active",
    isEmailVerified: true,
  });

  // ─── Seed Users ───────────────────────────────────────────────────────────────
  console.log("👥 Seeding users...");
  const defaultPassword = await hashPassword("Password@123");
  await User.insertMany(
    USERS.map((u) => ({ ...u, password: defaultPassword })),
  );

  // ─── Seed Products ────────────────────────────────────────────────────────────
  console.log("📦 Seeding products...");
  await Product.insertMany(
    PRODUCTS.map((p) => ({
      ...p,
      images: [
        {
          id: `img-${p.sku}`,
          url: `/mock/${p.sku.toLowerCase()}.svg`,
          alt: p.name,
          isPrimary: true,
        },
      ],
      dimensions: null,
    })),
  );

  console.log("✅ Seed complete!");
  console.log(`\n📧 Admin login: ${env.seedAdminEmail}`);
  console.log(`🔑 Password:    ${env.seedAdminPassword}`);

  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
