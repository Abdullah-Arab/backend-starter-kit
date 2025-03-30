import express from "express";
import reservationsController from "../../controllers/reservations-controller";
import { Type } from "@sinclair/typebox";
import { validate } from "../../middleware/validate-request";

const router = express.Router();

const GetReservationssQuerySchema = Type.Object({
  page: Type.Optional(Type.Number({ minimum: 1 })),
  limit: Type.Optional(Type.Number({ minimum: 1 })),
});
router.get(
  "/",
  validate(GetReservationssQuerySchema),
  reservationsController.getReservationss
); // GET /reservationss : no input required

const reservationByRoomOrGuestSchema = Type.Object({
  page: Type.Optional(Type.Integer({ minimum: 1 })), // Default: 1
  limit: Type.Optional(Type.Integer({ minimum: 1 })), // Default: 10
  guestId: Type.Optional(Type.String()), // Optional guest ID
  roomId: Type.Optional(Type.String()), // Optional room ID
});
router.get(
  "/upcoming",
  validate(reservationByRoomOrGuestSchema, "query"),
  reservationsController.getUpcomingReservations
  
); // GET /reservations/upcoming

// Route to get past reservations
router.get(
  "/past",
  validate(reservationByRoomOrGuestSchema, "query"),
  reservationsController.getPastReservations
);

router.get(
  "/current",
  validate(reservationByRoomOrGuestSchema, "query"),
  reservationsController.getCurrentReservation
);
// schema for input validation using typebox
const ReservationsIdSchema = Type.Object({
  id: Type.String(),
});
router.get(
  "/:id",
  validate(ReservationsIdSchema, "params"),
  reservationsController.getReservationsById
); // GET /reservationss/:id : requires input
router.put(
  "/:id",
  validate(ReservationsIdSchema, "params"),
  reservationsController.updateReservations
); // PUT /reservationss/:id : requires input
router.delete(
  "/:id",
  validate(ReservationsIdSchema, "params"),
  reservationsController.cancelReservation
); // DELETE /reservationss/:id : requires input

// schema for input validation using typebox
const CreateReservationSchema = Type.Object({
  guestId: Type.String(),
  roomIds: Type.Array(Type.String({ minLength: 1 })), // At least one room
  checkIn: Type.String({ format: "date-time" }), // Must be a valid ISO 8601 datetime
  checkOut: Type.String({ format: "date-time" }), // Must be a valid ISO 8601 datetime
});
router.post(
  "/",
  validate(CreateReservationSchema),
  reservationsController.createReservation
); // POST /reservationss : requires input

export default router;
