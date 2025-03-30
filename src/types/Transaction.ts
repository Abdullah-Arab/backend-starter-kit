import { Type, type Static } from "@sinclair/typebox";

const Transaction = Type.Object({
  id: Type.String(),
  user_id: Type.String(),
  item_ids: Type.Array(Type.String()),
  amount: Type.Number(),
  status: Type.String(),
  date: Type.String(),
  createdAt: Type.String(),
  updatedAt: Type.String(),
});

type Transaction = Static<typeof Transaction>;

export { Transaction };
