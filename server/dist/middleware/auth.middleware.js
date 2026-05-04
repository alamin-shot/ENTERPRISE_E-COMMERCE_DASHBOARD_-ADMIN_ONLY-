"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireManager = exports.requireAdmin = void 0;
exports.authenticate = authenticate;
exports.requireRole = requireRole;
const jwt_1 = require("../utils/jwt");
const User_model_1 = require("../models/User.model");
const response_1 = require("../utils/response");
async function authenticate(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            (0, response_1.errorResponse)(res, "No token provided", 401);
            return;
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            (0, response_1.errorResponse)(res, "No token provided", 401);
            return;
        }
        const payload = (0, jwt_1.verifyAccessToken)(token);
        const user = await User_model_1.User.findById(payload.sub).select("-password");
        if (!user) {
            (0, response_1.errorResponse)(res, "User not found", 401);
            return;
        }
        if (user.status === "suspended") {
            (0, response_1.errorResponse)(res, "Account suspended", 403);
            return;
        }
        req.user = user;
        next();
    }
    catch {
        (0, response_1.errorResponse)(res, "Invalid or expired token", 401);
    }
}
function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            (0, response_1.errorResponse)(res, "Unauthorized", 401);
            return;
        }
        if (!roles.includes(req.user.role)) {
            (0, response_1.errorResponse)(res, "Insufficient permissions", 403);
            return;
        }
        next();
    };
}
exports.requireAdmin = requireRole("admin");
exports.requireManager = requireRole("admin", "manager");
