"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("../controllers/order.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
// GET /api/orders/stats   — before /:id
// GET /api/orders/revenue — before /:id
router.get("/stats", order_controller_1.getOrderStats);
router.get("/revenue", order_controller_1.getRevenueData);
router.get("/", order_controller_1.getOrders);
router.get("/:id", order_controller_1.getOrderById);
// PATCH /api/orders/:id/status
router.patch("/:id/status", auth_middleware_1.requireManager, order_controller_1.updateOrderStatus);
exports.default = router;
