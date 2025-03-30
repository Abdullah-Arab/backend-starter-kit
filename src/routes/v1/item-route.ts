import express from "express";
import itemController from "../../controllers/item-controller";
import { Type } from "@sinclair/typebox";
import { validate } from "../../middleware/validate-request";

const router = express.Router();

const GetItemsQuerySchema = Type.Object({
  page: Type.Optional(Type.Number({ minimum: 1 })),
  limit: Type.Optional(Type.Number({ minimum: 1 })),
});
router.get("/", validate(GetItemsQuerySchema), itemController.getItems);

// Schema for ID validation
const ItemIdSchema = Type.Object({
  id: Type.String(),
});
router.get(
  "/:id",
  validate(ItemIdSchema, "params"),
  itemController.getItemById
);
router.put(
  "/:id",
  validate(ItemIdSchema, "params"),
  itemController.updateItem
);
router.delete(
  "/:id",
  validate(ItemIdSchema, "params"),
  itemController.deleteItem
);

// Schema for creating an item
const AddItemSchema = Type.Object({
  name: Type.String(),
  description: Type.Optional(Type.String()),
  price: Type.Optional(Type.Number({ minimum: 0 })),
});
router.post("/", validate(AddItemSchema), itemController.createItem);

export default router;
