import roomModel from "../models/room-model";
import { Room } from "../types/Room";

class RoomService {
  getAllRooms = async (page: number = 1, limit: number = 10) => {
    const offset = (page - 1) * limit;
    const rooms = await roomModel.getRoomsFromDB(offset, limit);
    const total = await roomModel.getRoomsCount(); // Get total count of rooms
    return {
      data: rooms,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  };

  getRoomsCount = async (): Promise<number> => {
    return await roomModel.getRoomsCount();
  };

  addRoom = async (
    roomData: Omit<Room, "id" | "created_at" | "updated_at">
  ): Promise<Room> => {
    return await roomModel.createRoomInDB(roomData);
  };

  getRoomById = async (id: string): Promise<Room | null> => {
    return await roomModel.getRoomByIdFromDB(id);
  };

  updateRoom = async (
    id: string,
    roomData: Partial<Omit<Room, "id" | "created_at" | "updated_at">>
  ): Promise<Room | null> => {
    return await roomModel.updateRoomInDB(id, roomData);
  };

  deleteRoom = async (id: string): Promise<void> => {
    await roomModel.deleteRoomFromDB(id);
  };
}

export default new RoomService();
