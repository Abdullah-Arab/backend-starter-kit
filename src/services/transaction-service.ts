import transactionModel from "../models/transaction-model";
import { Transaction } from "../types/Transaction";

class TransactionService {
  getAllTransactions = async (page: number = 1, limit: number = 10) => {
    const offset = (page - 1) * limit;
    const transactions = await transactionModel.getTransactionsFromDB(offset, limit);
    const total = await transactionModel.getTransactionsCount(); 
    return {
      data: transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  };

  addTransaction = async (
    transactionData: Omit<Transaction, "id" | "createdAt" | "updatedAt" | "item_ids">,
    itemIds: string[]
  ): Promise<Transaction> => {
    const newTransaction = await transactionModel.createTransactionInDB(transactionData);
    await transactionModel.addItemsToTransaction(newTransaction.id, itemIds);
    
    return {
      ...newTransaction,
      item_ids: itemIds,
    };
  };

  getTransactionById = async (id: string): Promise<Transaction | null> => {
    return await transactionModel.getTransactionByIdFromDB(id);
  };

  updateTransaction = async (
    id: string,
    transactionData: Partial<Omit<Transaction, "id" | "createdAt" | "updatedAt" | "item_ids">>,
    itemIds?: string[]
  ): Promise<Transaction | null> => {
    const updatedTransaction = await transactionModel.updateTransactionInDB(id, transactionData);
    
    if (!updatedTransaction) {
      return null;
    }
    
    if (itemIds && itemIds.length > 0) {
      // Remove existing items and add new ones
      await transactionModel.deleteTransactionFromDB(id);
      await transactionModel.addItemsToTransaction(id, itemIds);
      
      return {
        ...updatedTransaction,
        item_ids: itemIds,
      };
    }
    
    return updatedTransaction;
  };

  deleteTransaction = async (id: string): Promise<void> => {
    await transactionModel.deleteTransactionFromDB(id);
  };

  getTransactionsByUserId = async (
    userId: string,
    page: number = 1,
    limit: number = 10
  ) => {
    const offset = (page - 1) * limit;
    const transactions = await transactionModel.getTransactionsByUserIdFromDB(userId, offset, limit);
    const total = await transactionModel.getTransactionsCount(); 
    
    return {
      data: transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  };
}

export default new TransactionService();
