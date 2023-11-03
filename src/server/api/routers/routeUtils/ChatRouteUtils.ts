import { TRPCError } from "@trpc/server";

/** Picks the model based on the average token count, throws if too high */
export const handleChatModel = (tokenCountAverage: number) => {
  if (tokenCountAverage > 16000) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Exceeded token limit",
    });
  }

  if (tokenCountAverage > 3000) {
    return "gpt-3.5-turbo-16k";
  }
  return "gpt-3.5-turbo";
};
