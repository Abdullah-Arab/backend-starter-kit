import db from "../db";
import { Room } from "../types/Room";

class RoomModel {
  // Get all rooms
  getRoomsFromDB = async (offset: number, limit: number) => {
    return await db("rooms").select("*").offset(offset).limit(limit);
  };

  getRoomsCount = async (): Promise<number> => {
    const [{ count }] = await db("rooms").count("* as count");
    return Number(count);
  };

  // Create a new room
  createRoomInDB = async (
    roomData: Omit<Room, "id" | "created_at" | "updated_at">
  ): Promise<Room> => {
    const [newRoom] = await db("rooms").insert(roomData).returning("*");
    return newRoom;
  };

  // Get a room by ID
  getRoomByIdFromDB = async (id: string): Promise<Room | null> => {
    return await db("rooms").where({ id }).first();
  };

  // Update an existing room
  updateRoomInDB = async (
    id: string,
    roomData: Partial<Omit<Room, "id" | "created_at" | "updated_at">>
  ): Promise<Room | null> => {
    const [updatedRoom] = await db("rooms")
      .where({ id })
      .update(roomData)
      .returning("*");
    return updatedRoom;
  };

  // Delete a room by ID
  deleteRoomFromDB = async (id: string): Promise<void> => {
    await db("rooms").where({ id }).delete();
  };
}

export default new RoomModel();
