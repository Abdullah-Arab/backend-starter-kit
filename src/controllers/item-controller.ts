import { Request, Response } from "express";
import itemService from "../services/item-service";
import asyncHandler from "express-async-handler";
import { formatResponse } from "../utils/fromat-response";
import { handleError } from "../utils/handle-error";

class ItemController {
  getItems = asyncHandler(async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;

      const { data, pagination } = await itemService.getAllItems(page, limit);

      res
        .status(200)
        .json(
          formatResponse(
            "success",
            "Items retrieved successfully",
            data,
            pagination
          )
        );
    } catch (error) {
      handleError(res, "Failed to retrieve items", error);
    }
  });
  
  createItem = asyncHandler(async (req: Request, res: Response) => {
    try {
      const item = await itemService.addItem(req.body);
      res
        .status(201)
        .json(formatResponse("success", "Item created successfully", item));
    } catch (error) {
      handleError(res, "Failed to create item", error);
    }
  });

  getItemById = asyncHandler(async (req: Request, res: Response) => {
    try {
      const item = await itemService.getItemById(req.params.id);

      if (!item) {
        res.status(404).json(formatResponse("error", "Item not found"));
        return;
      }

      res
        .status(200)
        .json(formatResponse("success", "Item retrieved successfully", item));
    } catch (error) {
      handleError(res, "Failed to retrieve item", error);
    }
  });

  updateItem = asyncHandler(async (req: Request, res: Response) => {
    try {
      const item = await itemService.updateItem(req.params.id, req.body);

      if (!item) {
        res.status(404).json(formatResponse("error", "Item not found"));
        return;
      }

      res
        .status(200)
        .json(formatResponse("success", "Item updated successfully", item));
    } catch (error) {
      handleError(res, "Failed to update item", error);
    }
  });

  deleteItem = asyncHandler(async (req: Request, res: Response) => {
    try {
      const item = await itemService.getItemById(req.params.id);

      if (!item) {
        res.status(404).json(formatResponse("error", "Item not found"));
        return;
      }

      await itemService.deleteItem(req.params.id);
      res
        .status(200)
        .json(formatResponse("success", "Item deleted successfully"));
    } catch (error) {
      handleError(res, "Failed to delete item", error);
    }
  });
}

export default new ItemController();
