"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrders = getOrders;
exports.getOrderStats = getOrderStats;
exports.getRevenueData = getRevenueData;
exports.getOrderById = getOrderById;
exports.updateOrderStatus = updateOrderStatus;
const Order_model_1 = require("../models/Order.model");
const response_1 = require("../utils/response");
// GET /api/orders
async function getOrders(req, res) {
    const page = parseInt(String(req.query["page"] ?? "1"), 10);
    const limit = parseInt(String(req.query["limit"] ?? "10"), 10);
    const status = String(req.query["status"] ?? "");
    const sortBy = String(req.query["sortBy"] ?? "createdAt");
    const sortOrder = String(req.query["sortOrder"] ?? "desc");
    const search = String(req.query["search"] ?? "");
    const filter = {};
    if (status)
        filter["status"] = status;
    if (search)
        filter["$or"] = [
            { orderNumber: { $regex: search, $options: "i" } },
            { "customer.name": { $regex: search, $options: "i" } },
            { "customer.email": { $regex: search, $options: "i" } },
        ];
    const sort = {
        [sortBy]: sortOrder === "asc" ? 1 : -1,
    };
    const [data, total] = await Promise.all([
        Order_model_1.Order.find(filter)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit)
            .lean(),
        Order_model_1.Order.countDocuments(filter),
    ]);
    const formatted = data.map((o) => ({ ...o, id: String(o._id) }));
    (0, response_1.paginatedResponse)(res, formatted, (0, response_1.buildPagination)(page, limit, total));
}
// GET /api/orders/stats
async function getOrderStats(_req, res) {
    const [total, pending, processing, delivered, cancelled, revenueResult] = await Promise.all([
        Order_model_1.Order.countDocuments(),
        Order_model_1.Order.countDocuments({ status: "pending" }),
        Order_model_1.Order.countDocuments({ status: "processing" }),
        Order_model_1.Order.countDocuments({ status: "delivered" }),
        Order_model_1.Order.countDocuments({ status: "cancelled" }),
        Order_model_1.Order.aggregate([
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
        Order_model_1.Order.aggregate([
            { $match: { paymentStatus: "paid", createdAt: { $gte: todayStart } } },
            { $group: { _id: null, total: { $sum: "$total" } } },
        ]),
        Order_model_1.Order.aggregate([
            { $match: { paymentStatus: "paid", createdAt: { $gte: monthStart } } },
            { $group: { _id: null, total: { $sum: "$total" } } },
        ]),
    ]);
    (0, response_1.successResponse)(res, {
        totalOrders: total,
        pendingOrders: pending,
        processingOrders: processing,
        deliveredOrders: delivered,
        cancelledOrders: cancelled,
        totalRevenue: revenueResult[0]?.total ?? 0,
        revenueToday: todayRevenue[0]?.total ?? 0,
        revenueThisMonth: monthRevenue[0]?.total ?? 0,
    }, "Order stats fetched");
}
// GET /api/orders/revenue
async function getRevenueData(_req, res) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const result = await Order_model_1.Order.aggregate([
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
    (0, response_1.successResponse)(res, result, "Revenue data fetched");
}
// GET /api/orders/:id
async function getOrderById(req, res) {
    const order = await Order_model_1.Order.findById(req.params["id"]).lean();
    if (!order) {
        (0, response_1.errorResponse)(res, "Order not found", 404);
        return;
    }
    (0, response_1.successResponse)(res, { ...order, id: String(order._id) }, "Order fetched");
}
// PATCH /api/orders/:id/status
async function updateOrderStatus(req, res) {
    const { status, trackingNumber, notes } = req.body;
    const update = { status };
    if (trackingNumber !== undefined)
        update["trackingNumber"] = trackingNumber;
    if (notes !== undefined)
        update["notes"] = notes;
    const order = await Order_model_1.Order.findByIdAndUpdate(req.params["id"], { $set: update }, { new: true }).lean();
    if (!order) {
        (0, response_1.errorResponse)(res, "Order not found", 404);
        return;
    }
    (0, response_1.successResponse)(res, { ...order, id: String(order._id) }, "Order status updated");
}
