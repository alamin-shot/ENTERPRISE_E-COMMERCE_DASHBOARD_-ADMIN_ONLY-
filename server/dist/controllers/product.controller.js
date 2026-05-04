"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducts = getProducts;
exports.getProductStats = getProductStats;
exports.getProductById = getProductById;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
const Product_model_1 = require("../models/Product.model");
const response_1 = require("../utils/response");
// GET /api/products
async function getProducts(req, res) {
    const page = parseInt(String(req.query["page"] ?? "1"), 10);
    const limit = parseInt(String(req.query["limit"] ?? "10"), 10);
    const search = String(req.query["search"] ?? "");
    const status = String(req.query["status"] ?? "");
    const category = String(req.query["category"] ?? "");
    const sortBy = String(req.query["sortBy"] ?? "createdAt");
    const sortOrder = String(req.query["sortOrder"] ?? "desc");
    const filter = {};
    if (search)
        filter["$text"] = { $search: search };
    if (status)
        filter["status"] = status;
    if (category)
        filter["category"] = category;
    const sort = {
        [sortBy]: sortOrder === "asc" ? 1 : -1,
    };
    const [data, total] = await Promise.all([
        Product_model_1.Product.find(filter)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit)
            .lean(),
        Product_model_1.Product.countDocuments(filter),
    ]);
    const formatted = data.map((p) => ({ ...p, id: String(p._id) }));
    (0, response_1.paginatedResponse)(res, formatted, (0, response_1.buildPagination)(page, limit, total));
}
// GET /api/products/stats
async function getProductStats(_req, res) {
    const [total, active, outOfStock, lowStock, valueResult] = await Promise.all([
        Product_model_1.Product.countDocuments(),
        Product_model_1.Product.countDocuments({ status: "active" }),
        Product_model_1.Product.countDocuments({ stock: 0 }),
        Product_model_1.Product.countDocuments({ stock: { $gt: 0, $lte: 10 } }),
        Product_model_1.Product.aggregate([{ $group: { _id: null, total: { $sum: "$price" } } }]),
    ]);
    (0, response_1.successResponse)(res, {
        totalProducts: total,
        activeProducts: active,
        outOfStock,
        lowStock,
        totalValue: valueResult[0]?.total ?? 0,
    }, "Product stats fetched");
}
// GET /api/products/:id
async function getProductById(req, res) {
    const product = await Product_model_1.Product.findById(req.params["id"]).lean();
    if (!product) {
        (0, response_1.errorResponse)(res, "Product not found", 404);
        return;
    }
    (0, response_1.successResponse)(res, { ...product, id: String(product._id) }, "Product fetched");
}
// POST /api/products
async function createProduct(req, res) {
    const product = await Product_model_1.Product.create(req.body);
    (0, response_1.successResponse)(res, { ...product.toObject(), id: String(product._id) }, "Product created", 201);
}
// PATCH /api/products/:id
async function updateProduct(req, res) {
    const product = await Product_model_1.Product.findByIdAndUpdate(req.params["id"], { $set: req.body }, { new: true, runValidators: true }).lean();
    if (!product) {
        (0, response_1.errorResponse)(res, "Product not found", 404);
        return;
    }
    (0, response_1.successResponse)(res, { ...product, id: String(product._id) }, "Product updated");
}
// DELETE /api/products/:id
async function deleteProduct(req, res) {
    const product = await Product_model_1.Product.findByIdAndDelete(req.params["id"]);
    if (!product) {
        (0, response_1.errorResponse)(res, "Product not found", 404);
        return;
    }
    (0, response_1.successResponse)(res, null, "Product deleted");
}
