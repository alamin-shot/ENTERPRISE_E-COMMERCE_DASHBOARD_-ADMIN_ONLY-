import type { Request, Response } from "express";
import { Product } from "../models/Product.model";
import {
  successResponse,
  paginatedResponse,
  errorResponse,
  buildPagination,
} from "../utils/response";

// GET /api/products
export async function getProducts(req: Request, res: Response): Promise<void> {
  const page = parseInt(String(req.query["page"] ?? "1"), 10);
  const limit = parseInt(String(req.query["limit"] ?? "10"), 10);
  const search = String(req.query["search"] ?? "");
  const status = String(req.query["status"] ?? "");
  const category = String(req.query["category"] ?? "");
  const sortBy = String(req.query["sortBy"] ?? "createdAt");
  const sortOrder = String(req.query["sortOrder"] ?? "desc");

  const filter: Record<string, unknown> = {};
  if (search) filter["$text"] = { $search: search };
  if (status) filter["status"] = status;
  if (category) filter["category"] = category;

  const sort: Record<string, 1 | -1> = {
    [sortBy]: sortOrder === "asc" ? 1 : -1,
  };

  const [data, total] = await Promise.all([
    Product.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  const formatted = data.map((p) => ({ ...p, id: String(p._id) }));
  paginatedResponse(res, formatted, buildPagination(page, limit, total));
}

// GET /api/products/stats
export async function getProductStats(
  _req: Request,
  res: Response,
): Promise<void> {
  const [total, active, outOfStock, lowStock, valueResult] = await Promise.all([
    Product.countDocuments(),
    Product.countDocuments({ status: "active" }),
    Product.countDocuments({ stock: 0 }),
    Product.countDocuments({ stock: { $gt: 0, $lte: 10 } }),
    Product.aggregate([{ $group: { _id: null, total: { $sum: "$price" } } }]),
  ]);

  successResponse(
    res,
    {
      totalProducts: total,
      activeProducts: active,
      outOfStock,
      lowStock,
      totalValue: valueResult[0]?.total ?? 0,
    },
    "Product stats fetched",
  );
}

// GET /api/products/:id
export async function getProductById(
  req: Request,
  res: Response,
): Promise<void> {
  const product = await Product.findById(req.params["id"]).lean();
  if (!product) {
    errorResponse(res, "Product not found", 404);
    return;
  }
  successResponse(
    res,
    { ...product, id: String(product._id) },
    "Product fetched",
  );
}

// POST /api/products
export async function createProduct(
  req: Request,
  res: Response,
): Promise<void> {
  const product = await Product.create(req.body);
  successResponse(
    res,
    { ...product.toObject(), id: String(product._id) },
    "Product created",
    201,
  );
}

// PATCH /api/products/:id
export async function updateProduct(
  req: Request,
  res: Response,
): Promise<void> {
  const product = await Product.findByIdAndUpdate(
    req.params["id"],
    { $set: req.body },
    { new: true, runValidators: true },
  ).lean();
  if (!product) {
    errorResponse(res, "Product not found", 404);
    return;
  }
  successResponse(
    res,
    { ...product, id: String(product._id) },
    "Product updated",
  );
}

// DELETE /api/products/:id
export async function deleteProduct(
  req: Request,
  res: Response,
): Promise<void> {
  const product = await Product.findByIdAndDelete(req.params["id"]);
  if (!product) {
    errorResponse(res, "Product not found", 404);
    return;
  }
  successResponse(res, null, "Product deleted");
}
