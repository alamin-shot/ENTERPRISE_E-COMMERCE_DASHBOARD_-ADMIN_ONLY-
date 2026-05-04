"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successResponse = successResponse;
exports.paginatedResponse = paginatedResponse;
exports.errorResponse = errorResponse;
exports.buildPagination = buildPagination;
// ─── Response builders ────────────────────────────────────────────────────────
function successResponse(res, data, message = "Success", statusCode = 200) {
    const body = {
        success: true,
        message,
        data,
        timestamp: new Date().toISOString(),
    };
    return res.status(statusCode).json(body);
}
function paginatedResponse(res, data, pagination, message = "Success") {
    const body = {
        success: true,
        message,
        data,
        pagination,
        timestamp: new Date().toISOString(),
    };
    return res.status(200).json(body);
}
function errorResponse(res, message, statusCode = 400, errors) {
    return res.status(statusCode).json({
        success: false,
        message,
        errors,
        statusCode,
        timestamp: new Date().toISOString(),
    });
}
// ─── Pagination calculator ────────────────────────────────────────────────────
function buildPagination(page, limit, total) {
    const totalPages = Math.ceil(total / limit);
    return {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
    };
}
