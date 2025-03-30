import { Type, type Static } from "@sinclair/typebox";

const User = Type.Object({
  id: Type.String(),
  name: Type.String(),
  email: Type.String(),
  phone: Type.String(),
  createdAt: Type.String(),
  updatedAt: Type.String(),
});

type User = Static<typeof User>;

export { User };
