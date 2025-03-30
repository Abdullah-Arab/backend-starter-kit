import db from "../db";
import { Item } from "../types/Item";

class ItemModel {
  // Get all items with pagination
  getItemsFromDB = async (offset: number, limit: number) => {
    return await db("items").select("*").offset(offset).limit(limit);
  };

  // Get total count of items
  getItemsCount = async (): Promise<number> => {
    const [{ count }] = await db("items").count("* as count");
    return Number(count);
  };

  // Create a new item
  createItemInDB = async (
    itemData: Omit<Item, "id" | "createdAt" | "updatedAt">
  ): Promise<Item> => {
    const [newItem] = await db("items").insert(itemData).returning("*");
    return newItem;
  };

  // Get an item by ID
  getItemByIdFromDB = async (id: string): Promise<Item | null> => {
    return await db("items").where({ id }).first();
  };

  // Update an existing item
  updateItemInDB = async (
    id: string,
    itemData: Partial<Omit<Item, "id" | "createdAt" | "updatedAt">>
  ): Promise<Item | null> => {
    const [updatedItem] = await db("items")
      .where({ id })
      .update(itemData)
      .returning("*");
    return updatedItem;
  };

  // Delete an item by ID
  deleteItemFromDB = async (id: string): Promise<void> => {
    await db("items").where({ id }).delete();
  };
}

export default new ItemModel();
