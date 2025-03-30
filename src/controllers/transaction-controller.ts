import { Request, Response } from "express";
import transactionService from "../services/transaction-service";
import asyncHandler from "express-async-handler";
import { formatResponse } from "../utils/fromat-response";
import { handleError } from "../utils/handle-error";

class TransactionController {
  getTransactions = asyncHandler(async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;

      const { data, pagination } = await transactionService.getAllTransactions(page, limit);

      res
        .status(200)
        .json(
          formatResponse(
            "success",
            "Transactions retrieved successfully",
            data,
            pagination
          )
        );
    } catch (error) {
      handleError(res, "Failed to retrieve transactions", error);
    }
  });
  
  createTransaction = asyncHandler(async (req: Request, res: Response) => {
    try {
      const { item_ids, ...transactionData } = req.body;
      const transaction = await transactionService.addTransaction(transactionData, item_ids);
      res
        .status(201)
        .json(formatResponse("success", "Transaction created successfully", transaction));
    } catch (error) {
      handleError(res, "Failed to create transaction", error);
    }
  });

  getTransactionById = asyncHandler(async (req: Request, res: Response) => {
    try {
      const transaction = await transactionService.getTransactionById(req.params.id);

      if (!transaction) {
        res.status(404).json(formatResponse("error", "Transaction not found"));
        return;
      }

      res
        .status(200)
        .json(formatResponse("success", "Transaction retrieved successfully", transaction));
    } catch (error) {
      handleError(res, "Failed to retrieve transaction", error);
    }
  });

  updateTransaction = asyncHandler(async (req: Request, res: Response) => {
    try {
      const { item_ids, ...transactionData } = req.body;
      const transaction = await transactionService.updateTransaction(
        req.params.id, 
        transactionData, 
        item_ids
      );

      if (!transaction) {
        res.status(404).json(formatResponse("error", "Transaction not found"));
        return;
      }

      res
        .status(200)
        .json(formatResponse("success", "Transaction updated successfully", transaction));
    } catch (error) {
      handleError(res, "Failed to update transaction", error);
    }
  });

  deleteTransaction = asyncHandler(async (req: Request, res: Response) => {
    try {
      const transaction = await transactionService.getTransactionById(req.params.id);

      if (!transaction) {
        res.status(404).json(formatResponse("error", "Transaction not found"));
        return;
      }

      await transactionService.deleteTransaction(req.params.id);
      res
        .status(200)
        .json(formatResponse("success", "Transaction deleted successfully"));
    } catch (error) {
      handleError(res, "Failed to delete transaction", error);
    }
  });

  getTransactionsByUserId = asyncHandler(async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const userId = req.params.userId;

      const { data, pagination } = await transactionService.getTransactionsByUserId(
        userId,
        page,
        limit
      );

      res
        .status(200)
        .json(
          formatResponse(
            "success",
            "User transactions retrieved successfully",
            data,
            pagination
          )
        );
    } catch (error) {
      handleError(res, "Failed to retrieve user transactions", error);
    }
  });
}

export default new TransactionController();
