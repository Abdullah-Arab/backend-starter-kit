import { Request, Response } from "express";
import roomService from "../services/room-service";
import asyncHandler from "express-async-handler";
import { formatResponse } from "../utils/fromat-response";
import { handleError } from "../utils/handle-error";

class RoomController {
  getRooms = asyncHandler(async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;

      const { data, pagination } = await roomService.getAllRooms(page, limit);

      res
        .status(200)
        .json(
          formatResponse(
            "success",
            "Rooms retrieved successfully",
            data,
            pagination
          )
        );
    } catch (error) {
      handleError(res, "Failed to retrieve rooms", error);
    }
  });

  getRoomsCount = asyncHandler(async (req: Request, res: Response) => {
    try {
      const count = await roomService.getRoomsCount();

      res
        .status(200)
        .json(formatResponse("success", "Rooms count retrieved successfully", count));
    } catch (error) {
      handleError(res, "Failed to retrieve rooms count", error);
    }
  });

  createRoom = asyncHandler(async (req: Request, res: Response) => {
    try {
      const room = await roomService.addRoom(req.body);
      res
        .status(201)
        .json(formatResponse("success", "Room created successfully", room));
    } catch (error) {
      handleError(res, "Failed to create room", error);
    }
  });

  getRoomById = asyncHandler(async (req: Request, res: Response) => {
    try {
      const room = await roomService.getRoomById(req.params.id);

      if (!room) {
        res.status(404).json(formatResponse("error", "Room not found"));
        return;
      }

      res
        .status(200)
        .json(formatResponse("success", "Room retrieved successfully", room));
    } catch (error) {
      handleError(res, "Failed to retrieve room", error);
    }
  });

  updateRoom = asyncHandler(async (req: Request, res: Response) => {
    try {
      const room = await roomService.updateRoom(req.params.id, req.body);

      if (!room) {
        res.status(404).json(formatResponse("error", "Room not found"));
        return;
      }

      res
        .status(200)
        .json(formatResponse("success", "Room updated successfully", room));
    } catch (error) {
      handleError(res, "Failed to update room", error);
    }
  });

  deleteRoom = asyncHandler(async (req: Request, res: Response) => {
    try {
      const room = await roomService.getRoomById(req.params.id);

      if (!room) {
        res.status(404).json(formatResponse("error", "Room not found"));
      }

      await roomService.deleteRoom(req.params.id);
      res
        .status(200)
        .json(formatResponse("success", "Room deleted successfully"));
    } catch (error) {
      handleError(res, "Failed to delete room", error);
    }
  });
}

export default new RoomController();
