import { Request, Response, NextFunction } from "express";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { Type, Static } from "@sinclair/typebox";
import { formatResponse } from "../utils/fromat-response";

// Configure Ajv
const ajv = new Ajv({ allErrors: true });
addFormats(ajv); // Add support for date-time and other formats

// Validation middleware
export function validate(
  schema: any,
  source: "body" | "query" | "params" = "body"
) {
  const validateFn = ajv.compile(schema); // Compile the schema for validation

  return (req: Request, res: Response, next: NextFunction) => {
    const data = req[source];

    if (!validateFn(data)) {
      res.status(400).json(
        formatResponse(
          "error",
          "Invalid request: ",
          undefined,
          undefined,
          validateFn.errors?.map((err) => ({
            path: err.instancePath,
            message: err.message,
          }))
        )
      );
    }

    next();
  };
}
