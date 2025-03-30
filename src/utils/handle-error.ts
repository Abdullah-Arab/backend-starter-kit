import { Response } from "express";
import { formatResponse } from "./fromat-response";

/**
 * A utility function to handle errors and send consistent error responses.
 * @param res - The Express Response object.
 * @param message - The message to include in the response.
 * @param error - The error object (can be of type unknown).
 * @param statusCode - The HTTP status code (default: 500).
 */
export const handleError = (
  res: Response,
  message: string,
  error: unknown,
  statusCode: number = 500
): void => {
  const errorMessage = error instanceof Error ? error.message : "Unknown error";
  res
    .status(statusCode)
    .json(formatResponse("error", message, undefined, undefined, errorMessage));
};
