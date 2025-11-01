import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { logger } from "../utils/logger";

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      logger.warn("Validation error:", error);

      if (error instanceof ZodError) {
        res.status(400).json({
          error: "Validation Error",
          details: error.errors,
        });
      } else {
        res.status(400).json({
          error: "Validation Error",
          details:
            error instanceof Error ? error.message : "Unknown validation error",
        });
      }
    }
  };
};
