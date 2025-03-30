import db from "../db";
import { Transaction } from "../types/Transaction";

class TransactionModel {
  // Get all transactions with pagination
  getTransactionsFromDB = async (offset: number, limit: number) => {
    return await db("transactions").select("*").offset(offset).limit(limit);
  };

  // Get total count of transactions
  getTransactionsCount = async (): Promise<number> => {
    const [{ count }] = await db("transactions").count("* as count");
    return Number(count);
  };

  // Create a new transaction
  createTransactionInDB = async (
    transactionData: Omit<Transaction, "id" | "createdAt" | "updatedAt" | "item_ids">
  ): Promise<Transaction> => {
    const [newTransaction] = await db("transactions").insert(transactionData).returning("*");
    return newTransaction;
  };

  // Add items to a transaction
  addItemsToTransaction = async (
    transactionId: string,
    itemIds: string[],
    quantities: number[] = []
  ): Promise<void> => {
    const items = itemIds.map((itemId, index) => ({
      transaction_id: transactionId,
      item_id: itemId,
      quantity: quantities[index] || 1,
    }));

    await db("transaction_items").insert(items);
  };

  // Get a transaction by ID with its items
  getTransactionByIdFromDB = async (id: string): Promise<Transaction | null> => {
    const transaction = await db("transactions").where({ id }).first();
    
    if (!transaction) {
      return null;
    }
    
    const items = await db("transaction_items")
      .where({ transaction_id: id })
      .select("item_id");
    
    const itemIds = items.map(item => item.item_id);
    
    return {
      ...transaction,
      item_ids: itemIds,
    };
  };

  // Update an existing transaction
  updateTransactionInDB = async (
    id: string,
    transactionData: Partial<Omit<Transaction, "id" | "createdAt" | "updatedAt" | "item_ids">>
  ): Promise<Transaction | null> => {
    const [updatedTransaction] = await db("transactions")
      .where({ id })
      .update(transactionData)
      .returning("*");
    
    if (!updatedTransaction) {
      return null;
    }
    
    const items = await db("transaction_items")
      .where({ transaction_id: id })
      .select("item_id");
    
    const itemIds = items.map(item => item.item_id);
    
    return {
      ...updatedTransaction,
      item_ids: itemIds,
    };
  };

  // Delete a transaction by ID
  deleteTransactionFromDB = async (id: string): Promise<void> => {
    // Transaction items will be deleted automatically due to CASCADE constraint
    await db("transactions").where({ id }).delete();
  };

  // Get transactions by user ID
  getTransactionsByUserIdFromDB = async (
    userId: string,
    offset: number,
    limit: number
  ): Promise<Transaction[]> => {
    const transactions = await db("transactions")
      .where({ user_id: userId })
      .orderBy("created_at", "desc")
      .offset(offset)
      .limit(limit);
    
    // For each transaction, get its items
    const transactionsWithItems = await Promise.all(
      transactions.map(async (transaction) => {
        const items = await db("transaction_items")
          .where({ transaction_id: transaction.id })
          .select("item_id");
        
        const itemIds = items.map(item => item.item_id);
        
        return {
          ...transaction,
          item_ids: itemIds,
        };
      })
    );
    
    return transactionsWithItems;
  };
}

export default new TransactionModel();
