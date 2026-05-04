"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = errorMiddleware;
exports.notFoundMiddleware = notFoundMiddleware;
const env_1 = require("../config/env");
function errorMiddleware(err, req, res, _next) {
    const statusCode = err.statusCode ?? 500;
    const message = err.message ?? "Internal server error";
    console.error(`[${req.method}] ${req.path} — ${statusCode}: ${message}`);
    res.status(statusCode).json({
        success: false,
        message,
        statusCode,
        ...(env_1.env.isDev && { stack: err.stack }),
        timestamp: new Date().toISOString(),
    });
}
function notFoundMiddleware(req, res) {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
        statusCode: 404,
        timestamp: new Date().toISOString(),
    });
}
