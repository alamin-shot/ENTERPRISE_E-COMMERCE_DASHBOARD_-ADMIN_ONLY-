"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// All product routes require authentication
router.use(auth_middleware_1.authenticate);
// GET /api/products/stats — must be before /:id to avoid conflict
router.get("/stats", product_controller_1.getProductStats);
router.get("/", product_controller_1.getProducts);
router.get("/:id", product_controller_1.getProductById);
// Write operations require manager or admin
router.post("/", auth_middleware_1.requireManager, product_controller_1.createProduct);
router.patch("/:id", auth_middleware_1.requireManager, product_controller_1.updateProduct);
router.delete("/:id", auth_middleware_1.requireManager, product_controller_1.deleteProduct);
exports.default = router;
