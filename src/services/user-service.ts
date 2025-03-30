import userModel from "../models/user-model";
import { User } from "../types/User";

class UserService {
  getAllUsers = async (page: number = 1, limit: number = 10) => {
    const offset = (page - 1) * limit;
    const users = await userModel.getUsersFromDB(offset, limit);
    const total = await userModel.getUsersCount(); 
    return {
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  };

  addUser = async (
    userData: Omit<User, "id" | "createdAt" | "updatedAt">
  ): Promise<User> => {
    return await userModel.createUserInDB(userData);
  };

  getUserById = async (id: string): Promise<User | null> => {
    return await userModel.getUserByIdFromDB(id);
  };

  updateUser = async (
    id: string,
    userData: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>
  ): Promise<User | null> => {
    return await userModel.updateUserInDB(id, userData);
  };

  deleteUser = async (id: string): Promise<void> => {
    await userModel.deleteUserFromDB(id);
  };
}

export default new UserService();
