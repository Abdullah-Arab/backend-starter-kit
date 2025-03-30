import db from "../db";
import { Reservation } from "../types/Reservation";

class ReservationsModel {
  // Get all reservations
  getReservationssFromDB = async (offset: number, limit: number) => {
    return await db("reservations").select("*").offset(offset).limit(limit);
  };

  getReservationssCount = async (): Promise<number> => {
    const [{ count }] = await db("reservations").count("* as count");
    return Number(count);
  };

  // Create a new reservations - OLD
  // createReservation = async (reservationData: {
  //   guest_id: string;
  //   check_in: string;
  //   check_out: string;
  // }): Promise<any> => {
  //   const [newReservation] = await db("reservations")
  //     .insert(reservationData)
  //     .returning("*"); // Return all columns of the created reservation
  //   return newReservation;
  // };

  linkRoomToReservation = async (
    reservationId: string,
    roomId: string
  ): Promise<void> => {
    await db("reservations_rooms").insert({
      reservation_id: reservationId,
      room_id: roomId,
    });
  };

  // Get a reservations by ID
  async getReservationById(reservationId: string): Promise<any> {
    // Fetch reservation details
    const reservation = await db("reservations")
      .where({ id: reservationId })
      .first();

    if (!reservation) {
      return null; // Return null if no reservation is found
    }

    // Fetch associated room details
    const rooms = await db("reservations_rooms")
      .join("rooms", "reservations_rooms.room_id", "rooms.id")
      .where("reservations_rooms.reservation_id", reservationId)
      .select("rooms.id", "rooms.name", "rooms.room_number", "rooms.capacity");

    return {
      ...reservation,
      rooms, // Include room details
    };
  }

  // Update an existing reservations
  updateReservationsInDB = async (
    id: string,
    reservationsData: Partial<
      Omit<Reservation, "id" | "created_at" | "updated_at">
    >
  ): Promise<Reservation | null> => {
    const [updatedReservations] = await db("reservations")
      .where({ id })
      .update(reservationsData)
      .returning("*");
    return updatedReservations;
  };

  // Delete a reservations by ID
  deleteReservationsFromDB = async (id: string): Promise<void> => {
    await db("reservations").where({ id }).delete();
  };

  getUpcomingReservations = async (
    guestId?: string,
    roomId?: string,
    offset: number = 0,
    limit: number = 10
  ) => {
    const query = db("reservations")
      .join(
        "reservations_rooms",
        "reservations.id",
        "reservations_rooms.reservation_id"
      ) // Join with the many-to-many table
      .select("reservations.*") // Select fields from reservations
      .where("reservations.check_in", ">", new Date().toISOString()) // Upcoming reservations
      .orderBy("reservations.check_in", "asc") // Sort by nearest check-in
      .offset(offset)
      .limit(limit);

    if (guestId) {
      query.andWhere("reservations.guest_id", guestId);
    }

    if (roomId) {
      query.andWhere("reservations_rooms.room_id", roomId);
    }

    return await query;
  };

  countUpcomingReservations = async (
    guestId?: string,
    roomId?: string
  ): Promise<number> => {
    const query = db("reservations")
      .join(
        "reservations_rooms",
        "reservations.id",
        "reservations_rooms.reservation_id"
      )
      .where("reservations.check_in", ">", new Date().toISOString()); // Upcoming reservations

    if (guestId) {
      query.andWhere("reservations.guest_id", guestId);
    }

    if (roomId) {
      query.andWhere("reservations_rooms.room_id", roomId);
    }

    const [{ count }] = await query.count("* as count");
    return Number(count);
  };

  getPastReservations = async (
    guestId?: string,
    roomId?: string,
    offset: number = 0,
    limit: number = 10
  ) => {
    const query = db("reservations")
      .join(
        "reservations_rooms",
        "reservations.id",
        "reservations_rooms.reservation_id"
      ) // Join with the many-to-many table
      .select("reservations.*") // Select fields from reservations
      .where("reservations.check_out", "<", new Date().toISOString())
      .orderBy("reservations.check_out", "desc") // Sort by the most recent past checkout
      .offset(offset)
      .limit(limit);

    if (guestId) {
      query.andWhere("reservations.guest_id", guestId);
    }

    if (roomId) {
      query.andWhere("reservations_rooms.room_id", roomId);
    }

    return await query;
  };

  countPastReservations = async (
    guestId?: string,
    roomId?: string
  ): Promise<number> => {
    const query = db("reservations")
      .join(
        "reservations_rooms",
        "reservations.id",
        "reservations_rooms.reservation_id"
      )
      .where("reservations.check_out", "<", new Date().toISOString()); // Past reservations

    if (guestId) {
      query.andWhere("reservations.guest_id", guestId);
    }

    if (roomId) {
      query.andWhere("reservations_rooms.room_id", roomId);
    }

    const [{ count }] = await query.count("* as count");
    return Number(count);
  };

  getCurrentReservation = async (guestId?: string, roomId?: string) => {
    const query = db("reservations")
      .join(
        "reservations_rooms",
        "reservations.id",
        "reservations_rooms.reservation_id"
      )
      .select("reservations.*")
      .where("reservations.check_in", "<=", new Date().toISOString())
      .andWhere("reservations.check_out", ">=", new Date().toISOString());

    if (guestId) {
      query.andWhere("reservations.guest_id", guestId);
    }

    if (roomId) {
      query.andWhere("reservations_rooms.room_id", roomId);
    }

    return await query.first(); // Fetch the first matching reservation
  };

  isRoomAvailable = async (
    roomId: string,
    checkIn: string,
    checkOut: string
  ): Promise<boolean> => {
    const conflicts = await db("reservations")
      .join(
        "reservations_rooms",
        "reservations.id",
        "reservations_rooms.reservation_id"
      )
      .where("reservations_rooms.room_id", roomId)
      .andWhere(
        (query) =>
          query
            .whereBetween("reservations.check_in", [checkIn, checkOut]) // Overlaps start
            .orWhereBetween("reservations.check_out", [checkIn, checkOut]) // Overlaps end
            .orWhereRaw(
              "? BETWEEN reservations.check_in AND reservations.check_out",
              [checkIn]
            ) // Enveloping
            .orWhereRaw(
              "? BETWEEN reservations.check_in AND reservations.check_out",
              [checkOut]
            ) // Enveloping
      );

    return conflicts.length === 0; // Return true if no conflicts
  };

  // Check room availability within a transaction
  checkRoomAvailabilityWithLock = async (
    trx: any,
    roomId: string,
    checkIn: string,
    checkOut: string
  ): Promise<boolean> => {
    const conflicts = await trx("reservations")
      .join(
        "reservations_rooms",
        "reservations.id",
        "reservations_rooms.reservation_id"
      )
      .where("reservations_rooms.room_id", roomId)
      .andWhere((query: any) =>
        query
          .whereBetween("reservations.check_in", [checkIn, checkOut])
          .orWhereBetween("reservations.check_out", [checkIn, checkOut])
          .orWhereRaw(
            "? BETWEEN reservations.check_in AND reservations.check_out",
            [checkIn]
          )
          .orWhereRaw(
            "? BETWEEN reservations.check_in AND reservations.check_out",
            [checkOut]
          )
      )
      .forUpdate(); // Apply row-level lock on conflicting reservations

    return conflicts.length === 0; // Return true if no conflicts
  };

  // Create reservation within a transaction
  createReservation = async (reservationData: {
    guest_id: string;
    check_in: string;
    check_out: string;
    roomIds: string[];
  }): Promise<any> => {
    return await db.transaction(async (trx) => {
      // Step 1: Check room availability for each room
      for (const roomId of reservationData.roomIds) {
        const conflicts = await trx("reservations")
          .join(
            "reservations_rooms",
            "reservations.id",
            "reservations_rooms.reservation_id"
          )
          .where("reservations_rooms.room_id", roomId)
          .andWhere((query) =>
            query
              .whereBetween("reservations.check_in", [
                reservationData.check_in,
                reservationData.check_out,
              ])
              .orWhereBetween("reservations.check_out", [
                reservationData.check_in,
                reservationData.check_out,
              ])
              .orWhereRaw(
                "? BETWEEN reservations.check_in AND reservations.check_out",
                [reservationData.check_in]
              )
              .orWhereRaw(
                "? BETWEEN reservations.check_in AND reservations.check_out",
                [reservationData.check_out]
              )
          )
          .forUpdate();

        if (conflicts.length > 0) {
          throw new Error(
            `Room ${roomId} is not available for the selected dates.`
          );
        }
      }

      // Step 2: Create reservation
      const [newReservation] = await trx("reservations")
        .insert({
          guest_id: reservationData.guest_id,
          check_in: reservationData.check_in,
          check_out: reservationData.check_out,
        })
        .returning("*");

      // Step 3: Link rooms to the reservation
      for (const roomId of reservationData.roomIds) {
        await trx("reservations_rooms").insert({
          reservation_id: newReservation.id,
          room_id: roomId,
        });
      }

      return newReservation;
    });
  };

  async cancelReservation(reservationId: string): Promise<boolean> {
    // Start a transaction to ensure atomicity
    return await db.transaction(async (trx) => {
      // Step 1: Mark the reservation as canceled
      const updateResult = await trx("reservations")
        // .where({ id: reservationId, status: "confirmed" })
        // Ensure it's currently confirmed or pending
        .where({ id: reservationId }) // Remove status check

        .update({ status: "cancelled" });

      if (updateResult === 0) {
        throw new Error(
          `Reservation with ID ${reservationId} does not exist or is not in a confirmed state.`
        );
      }

      // Step 2: Remove room associations for the canceled reservation
      // TODO: shouldn't use delete because we want to keep the records
      await trx("reservations_rooms")
        .where({ reservation_id: reservationId })
        .delete();

      return true; // Return true if cancellation and cleanup succeed
    });
  }
}

export default new ReservationsModel();
