import { Type, type Static } from "@sinclair/typebox";

const Room = Type.Object({
  id: Type.String(),
  name: Type.String(),
  room_number: Type.String(),
  createdAt: Type.String(),
  updatedAt: Type.String(),
});

type Room = Static<typeof Room>;
export { Room };
