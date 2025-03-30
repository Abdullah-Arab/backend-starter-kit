import { Type, type Static } from "@sinclair/typebox";


const Reservation = Type.Object({
  id: Type.String(),
  guest_id: Type.String(),
  room_ids: Type.Array(Type.String()),
  checkin_date: Type.String(),
  checkout_date: Type.String(),
  status: Type.String(),
  createdAt: Type.String(),
  updatedAt: Type.String(),
});

type Reservation = Static<typeof Reservation>;

export { Reservation };

