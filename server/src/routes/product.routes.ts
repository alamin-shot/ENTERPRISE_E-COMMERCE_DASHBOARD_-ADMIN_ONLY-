import { Router } from "express";
import {
  getProducts,
  getProductStats,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller";
import { authenticate, requireManager } from "../middleware/auth.middleware";

const router = Router();

// All product routes require authentication
router.use(authenticate);

// GET /api/products/stats — must be before /:id to avoid conflict
router.get("/stats", getProductStats);
router.get("/", getProducts);
router.get("/:id", getProductById);

// Write operations require manager or admin
router.post("/", requireManager, createProduct);
router.patch("/:id", requireManager, updateProduct);
router.delete("/:id", requireManager, deleteProduct);

export default router;
