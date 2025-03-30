import express from "express";
import roomController from "../../controllers/room-controller";
import { Type } from "@sinclair/typebox";
import { validate } from "../../middleware/validate-request";

const router = express.Router();

const GetRoomsQuerySchema = Type.Object({
  page: Type.Optional(Type.Number({ minimum: 1 })),
  limit: Type.Optional(Type.Number({ minimum: 1 })),
});
router.get("/", validate(GetRoomsQuerySchema), roomController.getRooms); // GET /rooms : no input required
router.get("/count", roomController.getRoomsCount); // GET /rooms/count : no input required

// schema for input validation using typebox
const RoomIdSchema = Type.Object({
  id: Type.String(),
});
router.get(
  "/:id",
  validate(RoomIdSchema, "params"),
  roomController.getRoomById
); // GET /rooms/:id : requires input
router.put("/:id", validate(RoomIdSchema, "params"), roomController.updateRoom); // PUT /rooms/:id : requires input
router.delete(
  "/:id",
  validate(RoomIdSchema, "params"),
  roomController.deleteRoom
); // DELETE /rooms/:id : requires input

// schema for input validation using typebox
const AddRoomSchema = Type.Object({
  name: Type.Optional(Type.String()),
  room_number: Type.Number({ minimum: 100 }),
  capacity: Type.Number({ minimum: 1 }),
});
router.post("/", validate(AddRoomSchema), roomController.createRoom); // POST /rooms : requires input

export default router;
