import { Type, type Static } from "@sinclair/typebox";

const Item = Type.Object({
  id: Type.String(),
  name: Type.String(),
  description: Type.Optional(Type.String()),
  price: Type.Optional(Type.Number()),
  createdAt: Type.String(),
  updatedAt: Type.String(),
});

type Item = Static<typeof Item>;

export { Item };
