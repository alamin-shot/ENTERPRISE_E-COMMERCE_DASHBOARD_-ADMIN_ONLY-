import type { Request, Response } from "express";
import { Order } from "../models/Order.model";
import {
  successResponse,
  paginatedResponse,
  errorResponse,
  buildPagination,
} from "../utils/response";

// GET /api/orders
export async function getOrders(req: Request, res: Response): Promise<void> {
  const page = parseInt(String(req.query["page"] ?? "1"), 10);
  const limit = parseInt(String(req.query["limit"] ?? "10"), 10);
  const status = String(req.query["status"] ?? "");
  const sortBy = String(req.query["sortBy"] ?? "createdAt");
  const sortOrder = String(req.query["sortOrder"] ?? "desc");
  const search = String(req.query["search"] ?? "");

  const filter: Record<string, unknown> = {};
  if (status) filter["status"] = status;
  if (search)
    filter["$or"] = [
      { orderNumber: { $regex: search, $options: "i" } },
      { "customer.name": { $regex: search, $options: "i" } },
      { "customer.email": { $regex: search, $options: "i" } },
    ];

  const sort: Record<string, 1 | -1> = {
    [sortBy]: sortOrder === "asc" ? 1 : -1,
  };

  const [data, total] = await Promise.all([
    Order.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Order.countDocuments(filter),
  ]);

  const formatted = data.map((o) => ({ ...o, id: String(o._id) }));
  paginatedResponse(res, formatted, buildPagination(page, limit, total));
}

// GET /api/orders/stats
export async function getOrderStats(
  _req: Request,
  res: Response,
): Promise<void> {
  const [total, pending, processing, delivered, cancelled, revenueResult] =
    await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: "pending" }),
      Order.countDocuments({ status: "processing" }),
      Order.countDocuments({ status: "delivered" }),
      Order.countDocuments({ status: "cancelled" }),
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
    ]);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [todayRevenue, monthRevenue] = await Promise.all([
    Order.aggregate([
      { $match: { paymentStatus: "paid", createdAt: { $gte: todayStart } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]),
    Order.aggregate([
      { $match: { paymentStatus: "paid", createdAt: { $gte: monthStart } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]),
  ]);

  successResponse(
    res,
    {
      totalOrders: total,
      pendingOrders: pending,
      processingOrders: processing,
      deliveredOrders: delivered,
      cancelledOrders: cancelled,
      totalRevenue: revenueResult[0]?.total ?? 0,
      revenueToday: todayRevenue[0]?.total ?? 0,
      revenueThisMonth: monthRevenue[0]?.total ?? 0,
    },
    "Order stats fetched",
  );
}

// GET /api/orders/revenue
export async function getRevenueData(
  _req: Request,
  res: Response,
): Promise<void> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const result = await Order.aggregate([
    { $match: { paymentStatus: "paid", createdAt: { $gte: thirtyDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        revenue: { $sum: "$total" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    { $project: { _id: 0, date: "$_id", revenue: 1, orders: 1 } },
  ]);

  successResponse(res, result, "Revenue data fetched");
}

// GET /api/orders/:id
export async function getOrderById(req: Request, res: Response): Promise<void> {
  const order = await Order.findById(req.params["id"]).lean();
  if (!order) {
    errorResponse(res, "Order not found", 404);
    return;
  }
  successResponse(res, { ...order, id: String(order._id) }, "Order fetched");
}

// PATCH /api/orders/:id/status
export async function updateOrderStatus(
  req: Request,
  res: Response,
): Promise<void> {
  const { status, trackingNumber, notes } = req.body as {
    status: string;
    trackingNumber?: string;
    notes?: string;
  };

  const update: Record<string, unknown> = { status };
  if (trackingNumber !== undefined) update["trackingNumber"] = trackingNumber;
  if (notes !== undefined) update["notes"] = notes;

  const order = await Order.findByIdAndUpdate(
    req.params["id"],
    { $set: update },
    { new: true },
  ).lean();

  if (!order) {
    errorResponse(res, "Order not found", 404);
    return;
  }
  successResponse(
    res,
    { ...order, id: String(order._id) },
    "Order status updated",
  );
}
