import { Account, Role, User } from "@prisma/client";
import * as z from "zod";

export type UserEditValues = Pick<User, "email" | "role">;

export const validateUserEdit: z.ZodType<UserEditValues> = z.lazy(() =>
  z.object({
    email: z.string().email({ message: "Please enter a valid email" }),
    role: z.nativeEnum(Role),
  }),
);

export const defaultEditUserValues: UserEditValues = {
  email: "",
  role: "user",
};
