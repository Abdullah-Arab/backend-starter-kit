import { Request, Response } from "express";
import reservationsService from "../services/reservations-service";
import asyncHandler from "express-async-handler";
import { formatResponse } from "../utils/fromat-response";
import { handleError } from "../utils/handle-error";
import guestService from "../services/guest-service";
import roomService from "../services/room-service";

class ReservationsController {
  getReservationss = asyncHandler(async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;

      const { data, pagination } =
        await reservationsService.getAllReservationss(page, limit);

      res
        .status(200)
        .json(
          formatResponse(
            "success",
            "Reservationss retrieved successfully",
            data,
            pagination
          )
        );
    } catch (error) {
      handleError(res, "Failed to retrieve reservationss", error);
    }
  });

  createReservation = asyncHandler(async (req: Request, res: Response) => {
    const { guestId, roomIds, checkIn, checkOut } = req.body;

    // Check if guest exists
    const guestExists = await guestService.getGuestById(guestId);
    if (!guestExists) {
      res
        .status(404)
        .json(
          formatResponse("error", `Guest with ID ${guestId} does not exist.`)
        );
      return;
    }

    // Check if all rooms exist
    const invalidRooms = [];
    for (const roomId of roomIds) {
      const roomExists = await roomService.getRoomById(roomId);
      if (!roomExists) invalidRooms.push(roomId);
    }
    if (invalidRooms.length > 0) {
      res
        .status(404)
        .json(
          formatResponse(
            "error",
            `Rooms with IDs ${invalidRooms.join(", ")} do not exist.`
          )
        );
      return;
    }
    try {
      const reservation = await reservationsService.createReservation({
        guestId,
        roomIds,
        checkIn,
        checkOut,
      });
      res
        .status(201)
        .json(
          formatResponse(
            "success",
            "Reservation created successfully",
            reservation
          )
        );
    } catch (error: any) {
      res.status(400).json(formatResponse("error", error.message));
    }
  });

  getReservationsById = asyncHandler(async (req: Request, res: Response) => {
    try {
      const reservations = await reservationsService.getReservationsById(
        req.params.id
      );

      if (!reservations) {
        res.status(404).json(formatResponse("error", "Reservations not found"));
        return;
      }

      res
        .status(200)
        .json(
          formatResponse(
            "success",
            "Reservations retrieved successfully",
            reservations
          )
        );
    } catch (error) {
      handleError(res, "Failed to retrieve reservations", error);
    }
  });

  updateReservations = asyncHandler(async (req: Request, res: Response) => {
    try {
      const reservations = await reservationsService.updateReservations(
        req.params.id,
        req.body
      );

      if (!reservations) {
        res.status(404).json(formatResponse("error", "Reservations not found"));
        return;
      }

      res
        .status(200)
        .json(
          formatResponse(
            "success",
            "Reservations updated successfully",
            reservations
          )
        );
    } catch (error) {
      handleError(res, "Failed to update reservations", error);
    }
  });

  deleteReservations = asyncHandler(async (req: Request, res: Response) => {
    try {
      const reservations = await reservationsService.getReservationsById(
        req.params.id
      );

      if (!reservations) {
        res.status(404).json(formatResponse("error", "Reservations not found"));
      }

      await reservationsService.deleteReservations(req.params.id);
      res
        .status(200)
        .json(formatResponse("success", "Reservations deleted successfully"));
    } catch (error) {
      handleError(res, "Failed to delete reservations", error);
    }
  });

  getUpcomingReservations = asyncHandler(
    async (req: Request, res: Response) => {
      const { page = 1, limit = 10, guestId, roomId } = req.query;

      // Ensure at least one of guestId or roomId is provided
      if (!guestId && !roomId) {
        res
          .status(400)
          .json(
            formatResponse(
              "error",
              "At least one of 'guestId' or 'roomId' must be provided."
            )
          );
        return;
      }

      const result = await reservationsService.getUpcomingReservations(
        parseInt(page as string, 10),
        parseInt(limit as string, 10),
        guestId as string,
        roomId as string
      );

      res
        .status(200)
        .json(
          formatResponse(
            "success",
            "Upcoming reservations retrieved successfully",
            result.data,
            result.pagination
          )
        );
    }
  );

  getPastReservations = asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, guestId, roomId } = req.query;

    // Ensure at least one of guestId or roomId is provided
    if (!guestId && !roomId) {
      res
        .status(400)
        .json(
          formatResponse(
            "error",
            "At least one of 'guestId' or 'roomId' must be provided."
          )
        );
      return;
    }

    // Fetch past reservations
    const result = await reservationsService.getPastReservations(
      parseInt(page as string, 10),
      parseInt(limit as string, 10),
      guestId as string | undefined,
      roomId as string | undefined
    );

    res
      .status(200)
      .json(
        formatResponse(
          "success",
          "Past reservations retrieved successfully",
          result.data,
          result.pagination
        )
      );
  });

  getCurrentReservation = asyncHandler(async (req: Request, res: Response) => {
    const { guestId, roomId } = req.query;

    // Ensure at least one of guestId or roomId is provided
    if (!guestId && !roomId) {
      res
        .status(400)
        .json(
          formatResponse(
            "error",
            "At least one of 'guestId' or 'roomId' must be provided."
          )
        );
      return;
    }

    // Fetch current reservation
    const currentReservation = await reservationsService.getCurrentReservation(
      guestId as string | undefined,
      roomId as string | undefined
    );

    if (!currentReservation) {
      res
        .status(404)
        .json(formatResponse("error", "No current reservation found."));
      return;
    }

    res
      .status(200)
      .json(
        formatResponse(
          "success",
          "Current reservation retrieved successfully",
          currentReservation
        )
      );
  });

  cancelReservation = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      res
        .status(400)
        .json(formatResponse("error", "Reservation ID is required."));
      return;
    }

    try {
      await reservationsService.cancelReservation(id);
      res
        .status(200)
        .json(formatResponse("success", "Reservation canceled successfully."));
    } catch (error: any) {
      res.status(400).json(formatResponse("error", error.message));
    }
  });
}

export default new ReservationsController();
