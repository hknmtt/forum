import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { AppError } from "../api/error-handler";
import { StatusCodes } from "http-status-codes";

export type RequestSchema = {
  params?: z.ZodType<any, any, any>;
  query?: z.ZodType<any, any, any>;
  body?: z.ZodType<any, any, any>;
};

export function validateRequest(schema: RequestSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.params) {
        req.params = schema.params.parse(req.params);
      }
      if (schema.query) {
        req.query = schema.query.parse(req.query);
      }
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        // Sends a 422 Unprocessable Entity response with the first error path and message
        const path = err.errors[0].path.join(".");
        const message = err.errors[0].message;
        next(
          new AppError(
            StatusCodes.UNPROCESSABLE_ENTITY,
            `Validation error. ${message} at path ${path}.`
          )
        );
      } else {
        next(err);
      }
    }
  };
}
