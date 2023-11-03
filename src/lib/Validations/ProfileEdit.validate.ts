import * as z from "zod";

export interface ProfileEditValues {
  name: string;
  avatarUrl: string;
}

export const validateProfileEdit: z.ZodType<ProfileEditValues> = z.lazy(() =>
  z.object({
    name: z.string().min(1, { message: "Name is required" }),
    avatarUrl: z.string().min(1, { message: "Image is required" }),
  }),
);

export const defaultProfileEditValues: ProfileEditValues = {
  name: "",
  avatarUrl: "",
};
