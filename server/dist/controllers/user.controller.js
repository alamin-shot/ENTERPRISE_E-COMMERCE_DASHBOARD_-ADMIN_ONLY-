"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = getUsers;
exports.getUserStats = getUserStats;
exports.getUserById = getUserById;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
const User_model_1 = require("../models/User.model");
const bcrypt_1 = require("../utils/bcrypt");
const response_1 = require("../utils/response");
// GET /api/users
async function getUsers(req, res) {
    const page = parseInt(String(req.query["page"] ?? "1"), 10);
    const limit = parseInt(String(req.query["limit"] ?? "10"), 10);
    const role = String(req.query["role"] ?? "");
    const status = String(req.query["status"] ?? "");
    const search = String(req.query["search"] ?? "");
    const sortBy = String(req.query["sortBy"] ?? "createdAt");
    const sortOrder = String(req.query["sortOrder"] ?? "desc");
    const filter = {};
    if (role)
        filter["role"] = role;
    if (status)
        filter["status"] = status;
    if (search)
        filter["$or"] = [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
        ];
    const sort = {
        [sortBy]: sortOrder === "asc" ? 1 : -1,
    };
    const [data, total] = await Promise.all([
        User_model_1.User.find(filter)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit)
            .lean(),
        User_model_1.User.countDocuments(filter),
    ]);
    const formatted = data.map((u) => ({
        ...u,
        id: String(u._id),
        password: undefined,
    }));
    (0, response_1.paginatedResponse)(res, formatted, (0, response_1.buildPagination)(page, limit, total));
}
// GET /api/users/stats
async function getUserStats(_req, res) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const [total, active, suspended, newToday, newMonth] = await Promise.all([
        User_model_1.User.countDocuments(),
        User_model_1.User.countDocuments({ status: "active" }),
        User_model_1.User.countDocuments({ status: "suspended" }),
        User_model_1.User.countDocuments({ createdAt: { $gte: todayStart } }),
        User_model_1.User.countDocuments({ createdAt: { $gte: monthStart } }),
    ]);
    (0, response_1.successResponse)(res, {
        totalUsers: total,
        activeUsers: active,
        suspendedUsers: suspended,
        newUsersToday: newToday,
        newUsersThisMonth: newMonth,
    }, "User stats fetched");
}
// GET /api/users/:id
async function getUserById(req, res) {
    const user = await User_model_1.User.findById(req.params["id"]).lean();
    if (!user) {
        (0, response_1.errorResponse)(res, "User not found", 404);
        return;
    }
    (0, response_1.successResponse)(res, { ...user, id: String(user._id), password: undefined }, "User fetched");
}
// POST /api/users
async function createUser(req, res) {
    const { password, ...rest } = req.body;
    const existing = await User_model_1.User.findOne({ email: rest["email"] });
    if (existing) {
        (0, response_1.errorResponse)(res, "Email already registered", 409);
        return;
    }
    const hashed = await (0, bcrypt_1.hashPassword)(password);
    const user = await User_model_1.User.create({ ...rest, password: hashed });
    (0, response_1.successResponse)(res, { ...user.toObject(), id: String(user._id), password: undefined }, "User created", 201);
}
// PATCH /api/users/:id
async function updateUser(req, res) {
    const { password: _, ...update } = req.body;
    const user = await User_model_1.User.findByIdAndUpdate(req.params["id"], { $set: update }, { new: true, runValidators: true }).lean();
    if (!user) {
        (0, response_1.errorResponse)(res, "User not found", 404);
        return;
    }
    (0, response_1.successResponse)(res, { ...user, id: String(user._id), password: undefined }, "User updated");
}
// DELETE /api/users/:id
async function deleteUser(req, res) {
    const user = await User_model_1.User.findByIdAndDelete(req.params["id"]);
    if (!user) {
        (0, response_1.errorResponse)(res, "User not found", 404);
        return;
    }
    (0, response_1.successResponse)(res, null, "User deleted");
}
