import { Router } from "express";
import {
  getOrders,
  getOrderStats,
  getRevenueData,
  getOrderById,
  updateOrderStatus,
} from "../controllers/order.controller";
import { authenticate, requireManager } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

// GET /api/orders/stats   — before /:id
// GET /api/orders/revenue — before /:id
router.get("/stats", getOrderStats);
router.get("/revenue", getRevenueData);
router.get("/", getOrders);
router.get("/:id", getOrderById);

// PATCH /api/orders/:id/status
router.patch("/:id/status", requireManager, updateOrderStatus);

export default router;
