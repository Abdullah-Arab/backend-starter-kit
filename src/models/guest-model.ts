import db from "../db";
import { Guest } from "../types/Guest";

class GuestModel {
  // Get all guests
  getGuestsFromDB = async (offset: number, limit: number) => {
    return await db("guests").select("*").offset(offset).limit(limit);
  };

  getGuestsCount = async (): Promise<number> => {
    const [{ count }] = await db("guests").count("* as count");
    return Number(count);
  };

  // Create a new guest
  createGuestInDB = async (
    guestData: Omit<Guest, "id" | "created_at" | "updated_at">
  ): Promise<Guest> => {
    const [newGuest] = await db("guests").insert(guestData).returning("*");
    return newGuest;
  };

  // Get a guest by ID
  getGuestByIdFromDB = async (id: string): Promise<Guest | null> => {
    return await db("guests").where({ id }).first();
  };

  // Update an existing guest
  updateGuestInDB = async (
    id: string,
    guestData: Partial<Omit<Guest, "id" | "created_at" | "updated_at">>
  ): Promise<Guest | null> => {
    const [updatedGuest] = await db("guests")
      .where({ id })
      .update(guestData)
      .returning("*");
    return updatedGuest;
  };

  // Delete a guest by ID
  deleteGuestFromDB = async (id: string): Promise<void> => {
    await db("guests").where({ id }).delete();
  };
}

export default new GuestModel();
