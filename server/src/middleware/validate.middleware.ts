import type { Request, Response, NextFunction } from "express";
import type { ZodSchema, ZodError } from "zod";
import { errorResponse } from "../utils/response";

function formatZodErrors(err: ZodError): { field: string; message: string }[] {
  return err.errors.map((e) => ({
    field: e.path.join("."),
    message: e.message,
  }));
}

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      errorResponse(
        res,
        "Validation failed",
        422,
        formatZodErrors(result.error),
      );
      return;
    }
    req.body = result.data;
    next();
  };
}

export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      errorResponse(
        res,
        "Invalid query parameters",
        422,
        formatZodErrors(result.error),
      );
      return;
    }
    req.query = result.data as typeof req.query;
    next();
  };
}
