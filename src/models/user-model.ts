import db from "../db";
import { User } from "../types/User";

class UserModel {
  // Get all users with pagination
  getUsersFromDB = async (offset: number, limit: number) => {
    return await db("users").select("*").offset(offset).limit(limit);
  };

  // Get total count of users
  getUsersCount = async (): Promise<number> => {
    const [{ count }] = await db("users").count("* as count");
    return Number(count);
  };

  // Create a new user
  createUserInDB = async (
    userData: Omit<User, "id" | "createdAt" | "updatedAt">
  ): Promise<User> => {
    const [newUser] = await db("users").insert(userData).returning("*");
    return newUser;
  };

  // Get a user by ID
  getUserByIdFromDB = async (id: string): Promise<User | null> => {
    return await db("users").where({ id }).first();
  };

  // Update an existing user
  updateUserInDB = async (
    id: string,
    userData: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>
  ): Promise<User | null> => {
    const [updatedUser] = await db("users")
      .where({ id })
      .update(userData)
      .returning("*");
    return updatedUser;
  };

  // Delete a user by ID
  deleteUserFromDB = async (id: string): Promise<void> => {
    await db("users").where({ id }).delete();
  };
}

export default new UserModel();
