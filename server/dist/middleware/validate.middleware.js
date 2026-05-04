"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = validateBody;
exports.validateQuery = validateQuery;
const response_1 = require("../utils/response");
function formatZodErrors(err) {
    return err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
    }));
}
function validateBody(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            (0, response_1.errorResponse)(res, "Validation failed", 422, formatZodErrors(result.error));
            return;
        }
        req.body = result.data;
        next();
    };
}
function validateQuery(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.query);
        if (!result.success) {
            (0, response_1.errorResponse)(res, "Invalid query parameters", 422, formatZodErrors(result.error));
            return;
        }
        req.query = result.data;
        next();
    };
}
