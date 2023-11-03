import { StripePriceTag } from "@prisma/client";

export const prettyPriceTags = (tag: StripePriceTag | string) => {
  switch (tag) {
    case "PLAN_FEE":
      return "Plan Fee";
    case "CHAT_INPUT":
      return "ChatGPT Input";
    case "CHAT_OUTPUT":
      return "ChatGPT Output";
    case "TRANSCRIPTION_MINUTE":
      return "Transcription Minutes";
    case "STORAGE_PER_GB":
      return "Storage Per GB";
    default:
      return "Unknown";
  }
};
