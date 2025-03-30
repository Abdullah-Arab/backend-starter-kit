
import { Type, type Static } from "@sinclair/typebox";
import exp from "constants";

 const Guest = Type.Object({
  id: Type.String(),
  name: Type.String(),
  email: Type.String(),
  phone: Type.String(),
  createdAt: Type.String(),
  updatedAt: Type.String(),
});

type Guest = Static<typeof Guest>;

export { Guest };