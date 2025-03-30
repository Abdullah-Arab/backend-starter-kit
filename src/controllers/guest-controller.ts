import { Request, Response } from "express";
import guestService from "../services/guest-service";
import asyncHandler from "express-async-handler";
import { formatResponse } from "../utils/fromat-response";
import { handleError } from "../utils/handle-error";

class GuestController {
  getGuests = asyncHandler(async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;

      const { data, pagination } = await guestService.getAllGuests(page, limit);

      res
        .status(200)
        .json(
          formatResponse(
            "success",
            "Guests retrieved successfully",
            data,
            pagination
          )
        );
    } catch (error) {
      handleError(res, "Failed to retrieve guests", error);
    }
  });
  createGuest = asyncHandler(async (req: Request, res: Response) => {
    try {
      const guest = await guestService.addGuest(req.body);
      res
        .status(201)
        .json(formatResponse("success", "Guest created successfully", guest));
    } catch (error) {
      handleError(res, "Failed to create guest", error);
    }
  });

  getGuestById = asyncHandler(async (req: Request, res: Response) => {
    try {
      const guest = await guestService.getGuestById(req.params.id);

      if (!guest) {
        res.status(404).json(formatResponse("error", "Guest not found"));
        return;
      }

      res
        .status(200)
        .json(formatResponse("success", "Guest retrieved successfully", guest));
    } catch (error) {
      handleError(res, "Failed to retrieve guest", error);
    }
  });

  updateGuest = asyncHandler(async (req: Request, res: Response) => {
    try {
      const guest = await guestService.updateGuest(req.params.id, req.body);

      if (!guest) {
        res.status(404).json(formatResponse("error", "Guest not found"));
        return;
      }

      res
        .status(200)
        .json(formatResponse("success", "Guest updated successfully", guest));
    } catch (error) {
      handleError(res, "Failed to update guest", error);
    }
  });

  deleteGuest = asyncHandler(async (req: Request, res: Response) => {
    try {
      const guest = await guestService.getGuestById(req.params.id);

      if (!guest) {
        res.status(404).json(formatResponse("error", "Guest not found"));
      }

      await guestService.deleteGuest(req.params.id);
      res
        .status(200)
        .json(formatResponse("success", "Guest deleted successfully"));
    } catch (error) {
      handleError(res, "Failed to delete guest", error);
    }
  });
}

export default new GuestController();
