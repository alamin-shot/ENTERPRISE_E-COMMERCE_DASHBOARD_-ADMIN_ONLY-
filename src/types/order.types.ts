import type { QueryParams } from "./api.types";

// ─── Order Status Pipeline ────────────────────────────────────────────────────
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type PaymentMethod = "card" | "paypal" | "bank_transfer" | "cash";

// ─── Core Order ───────────────────────────────────────────────────────────────
export interface Order {
  id: string;
  orderNumber: string;
  customer: OrderCustomer;
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: Address;
  billingAddress: Address;
  notes: string | null;
  trackingNumber: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderCustomer {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string | null;
  sku: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Address {
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// ─── Order Stats (for dashboard) ─────────────────────────────────────────────
export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  revenueToday: number;
  revenueThisMonth: number;
}

// ─── Chart Data ───────────────────────────────────────────────────────────────
export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

// ─── Update Payload ───────────────────────────────────────────────────────────
export interface UpdateOrderStatusPayload {
  orderId: string;
  status: OrderStatus;
  trackingNumber?: string;
  notes?: string;
}

// ─── Filters ──────────────────────────────────────────────────────────────────
export interface OrderFilters extends QueryParams {
  status?: OrderStatus | undefined;
  paymentStatus?: PaymentStatus | undefined;
  paymentMethod?: PaymentMethod | undefined;
  dateFrom?: string | undefined;
  dateTo?: string | undefined;
  minTotal?: number | undefined;
  maxTotal?: number | undefined;
}

// ─── Redux State ──────────────────────────────────────────────────────────────
export interface OrderState {
  items: Order[];
  selectedOrderId: string | null;
  filters: OrderFilters;
}
