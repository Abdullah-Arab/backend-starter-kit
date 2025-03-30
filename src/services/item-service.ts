import itemModel from "../models/item-model";
import { Item } from "../types/Item";

class ItemService {
  getAllItems = async (page: number = 1, limit: number = 10) => {
    const offset = (page - 1) * limit;
    const items = await itemModel.getItemsFromDB(offset, limit);
    const total = await itemModel.getItemsCount(); 
    return {
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  };

  addItem = async (
    itemData: Omit<Item, "id" | "createdAt" | "updatedAt">
  ): Promise<Item> => {
    return await itemModel.createItemInDB(itemData);
  };

  getItemById = async (id: string): Promise<Item | null> => {
    return await itemModel.getItemByIdFromDB(id);
  };

  updateItem = async (
    id: string,
    itemData: Partial<Omit<Item, "id" | "createdAt" | "updatedAt">>
  ): Promise<Item | null> => {
    return await itemModel.updateItemInDB(id, itemData);
  };

  deleteItem = async (id: string): Promise<void> => {
    await itemModel.deleteItemFromDB(id);
  };
}

export default new ItemService();
