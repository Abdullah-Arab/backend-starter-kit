import express from "express";
import guestController from "../../controllers/guest-controller";
import { Type } from "@sinclair/typebox";
import { validate } from "../../middleware/validate-request";

const router = express.Router();

const GetGuestsQuerySchema = Type.Object({
  page: Type.Optional(Type.Number({ minimum: 1 })),
  limit: Type.Optional(Type.Number({ minimum: 1 })),
});
router.get("/", validate(GetGuestsQuerySchema), guestController.getGuests); // GET /guests : no input required

// schema for input validation using typebox
const GuestIdSchema = Type.Object({
  id: Type.String(),
});
router.get(
  "/:id",
  validate(GuestIdSchema, "params"),
  guestController.getGuestById
); // GET /guests/:id : requires input
router.put(
  "/:id",
  validate(GuestIdSchema, "params"),
  guestController.updateGuest
); // PUT /guests/:id : requires input
router.delete(
  "/:id",
  validate(GuestIdSchema, "params"),
  guestController.deleteGuest
); // DELETE /guests/:id : requires input

// schema for input validation using typebox
const AddGuestSchema = Type.Object({
  name: Type.String(),
  email: Type.String(),
  phone: Type.String(),
});
router.post("/", validate(AddGuestSchema), guestController.createGuest); // POST /guests : requires input

export default router;
