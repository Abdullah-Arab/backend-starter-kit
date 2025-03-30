import guestModel from "../models/guest-model";
import { Guest } from "../types/Guest";

class GuestService {
  getAllGuests = async (page: number = 1, limit: number = 10) => {
    const offset = (page - 1) * limit;
    const guests = await guestModel.getGuestsFromDB(offset, limit);
    const total = await guestModel.getGuestsCount(); // Get total count of guests
    return {
      data: guests,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  };

  addGuest = async (
    guestData: Omit<Guest, "id" | "created_at" | "updated_at">
  ): Promise<Guest> => {
    return await guestModel.createGuestInDB(guestData);
  };

  getGuestById = async (id: string): Promise<Guest | null> => {
    return await guestModel.getGuestByIdFromDB(id);
  };

  updateGuest = async (
    id: string,
    guestData: Partial<Omit<Guest, "id" | "created_at" | "updated_at">>
  ): Promise<Guest | null> => {
    return await guestModel.updateGuestInDB(id, guestData);
  };

  deleteGuest = async (id: string): Promise<void> => {
    await guestModel.deleteGuestFromDB(id);
  };
}

export default new GuestService();
