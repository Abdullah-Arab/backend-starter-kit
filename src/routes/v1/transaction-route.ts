import express from "express";
import transactionController from "../../controllers/transaction-controller";
import { Type } from "@sinclair/typebox";
import { validate } from "../../middleware/validate-request";

const router = express.Router();

const GetTransactionsQuerySchema = Type.Object({
  page: Type.Optional(Type.Number({ minimum: 1 })),
  limit: Type.Optional(Type.Number({ minimum: 1 })),
});
router.get("/", validate(GetTransactionsQuerySchema), transactionController.getTransactions);

// Schema for ID validation
const TransactionIdSchema = Type.Object({
  id: Type.String(),
});
router.get(
  "/:id",
  validate(TransactionIdSchema, "params"),
  transactionController.getTransactionById
);
router.put(
  "/:id",
  validate(TransactionIdSchema, "params"),
  transactionController.updateTransaction
);
router.delete(
  "/:id",
  validate(TransactionIdSchema, "params"),
  transactionController.deleteTransaction
);

// Schema for creating a transaction
const AddTransactionSchema = Type.Object({
  user_id: Type.String(),
  item_ids: Type.Array(Type.String()),
  amount: Type.Number({ minimum: 0 }),
  status: Type.Optional(Type.String()),
  date: Type.String({ format: 'date' }),
});
router.post("/", validate(AddTransactionSchema), transactionController.createTransaction);

// Get transactions by user ID
const UserIdSchema = Type.Object({
  userId: Type.String(),
});
router.get(
  "/user/:userId",
  validate(UserIdSchema, "params"),
  validate(GetTransactionsQuerySchema),
  transactionController.getTransactionsByUserId
);

export default router;
