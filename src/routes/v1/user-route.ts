import express from "express";
import userController from "../../controllers/user-controller";
import { Type } from "@sinclair/typebox";
import { validate } from "../../middleware/validate-request";

const router = express.Router();

const GetUsersQuerySchema = Type.Object({
  page: Type.Optional(Type.Number({ minimum: 1 })),
  limit: Type.Optional(Type.Number({ minimum: 1 })),
});
router.get("/", validate(GetUsersQuerySchema), userController.getUsers);

// Schema for ID validation
const UserIdSchema = Type.Object({
  id: Type.String(),
});
router.get(
  "/:id",
  validate(UserIdSchema, "params"),
  userController.getUserById
);
router.put(
  "/:id",
  validate(UserIdSchema, "params"),
  userController.updateUser
);
router.delete(
  "/:id",
  validate(UserIdSchema, "params"),
  userController.deleteUser
);

// Schema for creating a user
const AddUserSchema = Type.Object({
  name: Type.String(),
  email: Type.String({ format: 'email' }),
  phone: Type.String(),
});
router.post("/", validate(AddUserSchema), userController.createUser);

export default router;
