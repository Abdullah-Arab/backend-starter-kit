import { Request, Response } from "express";
import userService from "../services/user-service";
import asyncHandler from "express-async-handler";
import { formatResponse } from "../utils/fromat-response";
import { handleError } from "../utils/handle-error";

class UserController {
  getUsers = asyncHandler(async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;

      const { data, pagination } = await userService.getAllUsers(page, limit);

      res
        .status(200)
        .json(
          formatResponse(
            "success",
            "Users retrieved successfully",
            data,
            pagination
          )
        );
    } catch (error) {
      handleError(res, "Failed to retrieve users", error);
    }
  });
  
  createUser = asyncHandler(async (req: Request, res: Response) => {
    try {
      const user = await userService.addUser(req.body);
      res
        .status(201)
        .json(formatResponse("success", "User created successfully", user));
    } catch (error) {
      handleError(res, "Failed to create user", error);
    }
  });

  getUserById = asyncHandler(async (req: Request, res: Response) => {
    try {
      const user = await userService.getUserById(req.params.id);

      if (!user) {
        res.status(404).json(formatResponse("error", "User not found"));
        return;
      }

      res
        .status(200)
        .json(formatResponse("success", "User retrieved successfully", user));
    } catch (error) {
      handleError(res, "Failed to retrieve user", error);
    }
  });

  updateUser = asyncHandler(async (req: Request, res: Response) => {
    try {
      const user = await userService.updateUser(req.params.id, req.body);

      if (!user) {
        res.status(404).json(formatResponse("error", "User not found"));
        return;
      }

      res
        .status(200)
        .json(formatResponse("success", "User updated successfully", user));
    } catch (error) {
      handleError(res, "Failed to update user", error);
    }
  });

  deleteUser = asyncHandler(async (req: Request, res: Response) => {
    try {
      const user = await userService.getUserById(req.params.id);

      if (!user) {
        res.status(404).json(formatResponse("error", "User not found"));
        return;
      }

      await userService.deleteUser(req.params.id);
      res
        .status(200)
        .json(formatResponse("success", "User deleted successfully"));
    } catch (error) {
      handleError(res, "Failed to delete user", error);
    }
  });
}

export default new UserController();
