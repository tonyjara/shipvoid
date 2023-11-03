// This is a dictionary that replaces known error with usable text messages

import { TRPCError } from "@trpc/server";

// This is a dictionary that replaces known error with usable text messages, if not found, it returns a generic error
// It is mostyle used in the handleMutationAlerts function
export const knownErrors = (error: string) => {
  const errors = [
    "There is already an account with this email. Please login.",
    "User needs to wait more before new email",
    "User already has a subscription",
    "Too soon to generate a new link. Please check your email.",
    "Email already verified, please login",
    "Coupon not found or already claimed",
    "Not enough transcription minutes, please consider upgrading your plan.",
    "Not enough chat credits, please consider upgrading your plan.",
    "You have already sent a support ticket, please wait a few minutes before sending another one.",
  ];
  if (errors.some((e) => error.startsWith(e))) return error;

  if (error.includes("Unique constraint failed")) {
    return "The field is already in use, please try another one.";
  }

  if (error.includes("Captcha failed")) {
    return "Captcha failed, please try again.";
  }

  console.error(error);
  return "Something went wrong, please try again.";
};

export const throwInternalServerError: (x: string) => never = (
  error: string,
) => {
  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: error,
  });
};
