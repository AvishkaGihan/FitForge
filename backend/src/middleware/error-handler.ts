import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";
import { ZodError } from "zod";

interface CustomError extends Error {
  code?: string;
  statusCode?: number;
}

export const errorHandler = (
  err: Error | ZodError | CustomError | unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const errorObj = err as CustomError;

  logger.error("Error:", {
    message: errorObj instanceof Error ? errorObj.message : "Unknown error",
    stack:
      process.env.NODE_ENV === "development" && errorObj instanceof Error
        ? errorObj.stack
        : undefined,
    path: req.path,
    method: req.method,
  });

  // Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      error: "Validation Error",
      details: err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
    return;
  }

  // Supabase errors
  if (errorObj.code) {
    if (errorObj.code === "PGRST116") {
      res.status(404).json({ error: "Resource not found" });
      return;
    }
    if (errorObj.code === "23505") {
      res.status(409).json({ error: "Resource already exists" });
      return;
    }
  }

  // JWT errors
  if (errorObj.name === "JsonWebTokenError") {
    res.status(401).json({ error: "Invalid token" });
    return;
  }
  if (errorObj.name === "TokenExpiredError") {
    res.status(401).json({ error: "Token expired" });
    return;
  }

  // Default error
  const statusCode = errorObj.statusCode || 500;
  const message =
    errorObj instanceof Error ? errorObj.message : "Internal server error";
  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === "development" &&
      errorObj instanceof Error && { stack: errorObj.stack }),
  });
};
