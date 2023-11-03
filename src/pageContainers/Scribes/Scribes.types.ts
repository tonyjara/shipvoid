import { Prisma } from "@prisma/client";

export const scribePageArgs = Prisma.validator<Prisma.ScribeDefaultArgs>()({
  include: {
    audioFiles: true,
  },
});

export type ScribePageType = Prisma.ScribeGetPayload<typeof scribePageArgs>;
