import type { Request, Response } from "express";
import { User } from "../models/User.model";
import { hashPassword } from "../utils/bcrypt";
import {
  successResponse,
  paginatedResponse,
  errorResponse,
  buildPagination,
} from "../utils/response";

// GET /api/users
export async function getUsers(req: Request, res: Response): Promise<void> {
  const page = parseInt(String(req.query["page"] ?? "1"), 10);
  const limit = parseInt(String(req.query["limit"] ?? "10"), 10);
  const role = String(req.query["role"] ?? "");
  const status = String(req.query["status"] ?? "");
  const search = String(req.query["search"] ?? "");
  const sortBy = String(req.query["sortBy"] ?? "createdAt");
  const sortOrder = String(req.query["sortOrder"] ?? "desc");

  const filter: Record<string, unknown> = {};
  if (role) filter["role"] = role;
  if (status) filter["status"] = status;
  if (search)
    filter["$or"] = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];

  const sort: Record<string, 1 | -1> = {
    [sortBy]: sortOrder === "asc" ? 1 : -1,
  };

  const [data, total] = await Promise.all([
    User.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    User.countDocuments(filter),
  ]);

  const formatted = data.map((u) => ({
    ...u,
    id: String(u._id),
    password: undefined,
  }));
  paginatedResponse(res, formatted, buildPagination(page, limit, total));
}

// GET /api/users/stats
export async function getUserStats(
  _req: Request,
  res: Response,
): Promise<void> {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [total, active, suspended, newToday, newMonth] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ status: "active" }),
    User.countDocuments({ status: "suspended" }),
    User.countDocuments({ createdAt: { $gte: todayStart } }),
    User.countDocuments({ createdAt: { $gte: monthStart } }),
  ]);

  successResponse(
    res,
    {
      totalUsers: total,
      activeUsers: active,
      suspendedUsers: suspended,
      newUsersToday: newToday,
      newUsersThisMonth: newMonth,
    },
    "User stats fetched",
  );
}

// GET /api/users/:id
export async function getUserById(req: Request, res: Response): Promise<void> {
  const user = await User.findById(req.params["id"]).lean();
  if (!user) {
    errorResponse(res, "User not found", 404);
    return;
  }
  successResponse(
    res,
    { ...user, id: String(user._id), password: undefined },
    "User fetched",
  );
}

// POST /api/users
export async function createUser(req: Request, res: Response): Promise<void> {
  const { password, ...rest } = req.body as {
    password: string;
    [key: string]: unknown;
  };

  const existing = await User.findOne({ email: rest["email"] });
  if (existing) {
    errorResponse(res, "Email already registered", 409);
    return;
  }

  const hashed = await hashPassword(password);
  const user = await User.create({ ...rest, password: hashed });

  successResponse(
    res,
    { ...user.toObject(), id: String(user._id), password: undefined },
    "User created",
    201,
  );
}

// PATCH /api/users/:id
export async function updateUser(req: Request, res: Response): Promise<void> {
  const { password: _, ...update } = req.body as {
    password?: string;
    [key: string]: unknown;
  };

  const user = await User.findByIdAndUpdate(
    req.params["id"],
    { $set: update },
    { new: true, runValidators: true },
  ).lean();

  if (!user) {
    errorResponse(res, "User not found", 404);
    return;
  }
  successResponse(
    res,
    { ...user, id: String(user._id), password: undefined },
    "User updated",
  );
}

// DELETE /api/users/:id
export async function deleteUser(req: Request, res: Response): Promise<void> {
  const user = await User.findByIdAndDelete(req.params["id"]);
  if (!user) {
    errorResponse(res, "User not found", 404);
    return;
  }
  successResponse(res, null, "User deleted");
}
