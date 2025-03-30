import reservationsModel from "../models/reservations-model";
import { Reservation } from "../types/Reservation";

// --todo: retrieve upcoming/past reservations for specific guest/room sorted by most recent--
// --todo: total amount of upcoming reservations for specific guest/room--
// --todo: current reservation for specific guest/room--
// --todo: when creating a reservation, check if room is available--
// --todo: when creating a reservation, validate check-in and check-out dates--
// --todo: when creating a reservation, handle multiple rooms ( in reservation model as well )--
// --todo: handle race conditions--
// --todo: cancel reservation--
class ReservationsService {
  getAllReservationss = async (page: number = 1, limit: number = 10) => {
    const offset = (page - 1) * limit;
    const reservationss = await reservationsModel.getReservationssFromDB(
      offset,
      limit
    );
    const total = await reservationsModel.getReservationssCount(); // Get total count of reservationss
    return {
      data: reservationss,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  };

  getReservationsById = async (id: string): Promise<Reservation | null> => {
    return await reservationsModel.getReservationById(id);
  };

  updateReservations = async (
    id: string,
    reservationsData: Partial<
      Omit<Reservation, "id" | "created_at" | "updated_at">
    >
  ): Promise<Reservation | null> => {
    return await reservationsModel.updateReservationsInDB(id, reservationsData);
  };

  deleteReservations = async (id: string): Promise<void> => {
    await reservationsModel.deleteReservationsFromDB(id);
  };

  getUpcomingReservations = async (
    page: number = 1,
    limit: number = 10,
    guestId?: string,
    roomId?: string
  ) => {
    const offset = (page - 1) * limit;

    const reservations = await reservationsModel.getUpcomingReservations(
      guestId,
      roomId,
      offset,
      limit
    );

    const total = await reservationsModel.countUpcomingReservations(
      guestId,
      roomId
    );

    return {
      data: reservations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  };

  getPastReservations = async (
    page: number = 1,
    limit: number = 10,
    guestId?: string,
    roomId?: string
  ) => {
    const offset = (page - 1) * limit;

    const reservations = await reservationsModel.getPastReservations(
      guestId,
      roomId,
      offset,
      limit
    );

    const total = await reservationsModel.countPastReservations(
      guestId,
      roomId
    );

    return {
      data: reservations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  };

  getCurrentReservation = async (guestId?: string, roomId?: string) => {
    // at least one of guestId or roomId must be provided
    if (!guestId && !roomId) {
      throw new Error(
        "Either guestId or roomId must be provided to fetch the current reservation."
      );
    }

    // Fetch current reservation from the model
    return await reservationsModel.getCurrentReservation(guestId, roomId);
  };

  isRoomAvailable = async (
    roomId: string,
    checkIn: string,
    checkOut: string
  ): Promise<boolean> => {
    // Ensure check-in date is before check-out date
    if (new Date(checkIn) >= new Date(checkOut)) {
      throw new Error("Check-in date must be before check-out date.");
    }

    // Call model to check availability
    const available = await reservationsModel.isRoomAvailable(
      roomId,
      checkIn,
      checkOut
    );
    if (!available) {
      throw new Error(
        `Room ${roomId} is not available for the selected dates.`
      );
    }

    return available;
  };

  async createReservation(data: {
    guestId: string;
    roomIds: string[];
    checkIn: string;
    checkOut: string;
  }) {
    const { guestId, roomIds, checkIn, checkOut } = data;

    // Validate date range
    if (new Date(checkIn) >= new Date(checkOut)) {
      throw new Error("Check-in date must be earlier than check-out date.");
    }

    // Delegate the reservation creation to the model
    return await reservationsModel.createReservation({
      guest_id: guestId,
      roomIds,
      check_in: checkIn,
      check_out: checkOut,
    });
  }

  async cancelReservation(reservationId: string): Promise<void> {
    // Step 1: Check if the reservation exists
    const reservation = await reservationsModel.getReservationById(
      reservationId
    );
    if (!reservation) {
      throw new Error(`Reservation with ID ${reservationId} does not exist.`);
    }

    // Step 2: Validate business rules (optional)
    const currentDate = new Date();
    if (new Date(reservation.checkin_date) <= currentDate) {
      throw new Error("Cannot cancel a reservation that has already started.");
    }

    // Step 3: Cancel the reservation
    const canceled = await reservationsModel.cancelReservation(reservationId);
    if (!canceled) {
      throw new Error(
        "Failed to cancel the reservation. It may have already been canceled."
      );
    }
  }
}

export default new ReservationsService();
