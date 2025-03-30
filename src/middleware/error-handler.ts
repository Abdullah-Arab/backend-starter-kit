// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { formatResponse } from "../utils/fromat-response";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  res
    .status(500)
    .json(
      formatResponse(
        "error",
        "Internal server error",
        undefined,
        undefined,
        err.message
      )
    );
};
