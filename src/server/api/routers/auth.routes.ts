import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { prisma } from "@/server/db";
import bcrypt from "bcryptjs";
import { appOptions, randomAvatar } from "@/lib/Constants";
import { validateRecaptcha } from "@/server/serverUtils";
import { v4 as uuidv4 } from "uuid";
import { subMinutes } from "date-fns";
import { validatePasswordRecovery } from "@/pages/forgot-my-password/[link]";
import {
  sendVerificationEmail,
  sendPasswordRecoveryEmail,
  sendGetNotifiedConfirmationEmail,
} from "@/server/emailProviders/emailAdapters";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  makeSignedToken,
  makeSignedTokenForPasswordRecovery,
} from "./routeUtils/VerificationLinks.routeUtils";
import { validateVerify } from "@/lib/Validations/Verify.validate";
import { validateSignup } from "@/lib/Validations/Signup.validate";
import { verifyToken } from "@/lib/utils/asyncJWT";
import { validateAddToMailingList } from "@/lib/Validations/AddToMailingList.validate";
import { env } from "@/env.mjs";
import { createNewUserResources } from "./routeUtils/authRoute.utils";

const isDevEnv = process.env.NODE_ENV === "development";

export const authRouter = createTRPCRouter({
  signupWithCredentials: publicProcedure
    .input(validateVerify)
    .mutation(async ({ input }) => {
      const hashedPass = await bcrypt.hash(input.password, 10);

      await prisma.$transaction(async (tx) => {
        //Create account, user, subscription
        const user = await tx.user.create({
          data: {
            email: input.email,
            name: input.name,
            emailVerified: new Date(),
            image: randomAvatar(),
            role: isDevEnv ? "admin" : "user",
          },
        });

        await tx.account.create({
          data: {
            userId: user.id,
            providerAccountId: input.email,
            password: hashedPass,
            provider: "credentials",
            type: "credentials",
          },
        });
        await createNewUserResources({
          tx,
          userId: user.id,
          email: input.email,
          name: input.name,
        });

        //Invalidate link
        await tx.accountVerificationLinks.updateMany({
          where: { id: input.linkId },
          data: { hasBeenUsed: true },
        });
      });
    }),
  generateVerificationLink: publicProcedure
    .input(validateSignup)
    .mutation(async ({ input }) => {
      //Check if there's a verification link that was created in the last 5 minutes
      // and if so return message that a link was already generated and to check email
      // and if not then generate a new link and return it

      await validateRecaptcha(input.reCaptchaToken);

      const existingUser = await prisma.user.findFirst({
        where: { email: input.email },
      });
      if (existingUser)
        throw "There is already an account with this email. Please login.";

      const prevLink = await prisma.accountVerificationLinks.findFirst({
        where: {
          email: input.email,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      if (prevLink && prevLink.createdAt > subMinutes(new Date(), 5)) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Too soon to generate a new link. Please check your email.",
        });
      }
      if (prevLink && prevLink.hasBeenUsed) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Email already verified. Please login.",
        });
      }

      const secret = process.env.JWT_SECRET;
      const uuid = uuidv4();
      if (!secret) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "No secret",
        });
      }
      const signedToken = makeSignedToken({
        email: input.email,
        name: input.name,
        uuid,
        secret,
      });
      const baseUrl = process.env.NEXT_PUBLIC_WEB_URL;
      const link = `${baseUrl}/verify/${signedToken}`;

      const verificationLink = await prisma?.accountVerificationLinks.create({
        data: {
          id: uuid,
          verificationLink: link,
          email: input.email,
        },
      });

      if (!isDevEnv || appOptions.enableEmailApiInDevelopment) {
        await sendVerificationEmail({
          email: input.email,
          name: input.name,
          link,
        });
      }
      if (isDevEnv && !appOptions.enableEmailApiInDevelopment) {
        console.info("Verification Link: ", link);
      }

      return { status: "successs", sentAt: verificationLink.createdAt };
    }),

  createLinkForPasswordRecovery: publicProcedure
    .input(z.object({ email: z.string().email(), reCaptchaToken: z.string() }))
    .mutation(async ({ input }) => {
      await validateRecaptcha(input.reCaptchaToken);

      const user = await prisma.user.findUniqueOrThrow({
        where: { email: input.email, active: true },
        include: { accounts: true },
      });
      const accountWithCredentials = user.accounts.find(
        (account) => account.type === "credentials",
      );

      if (!accountWithCredentials) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User was not signed up with credentials",
        });
      }

      //find if there was a password created in the last 5 minutes
      const freshPassLink = await prisma.passwordRecoveryLinks.findFirst({
        where: { createdAt: { gte: subMinutes(new Date(), 5) } },
      });

      if (!!freshPassLink) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User needs to wait more before new email",
        });
      }
      if (!user.email || !user.name) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not found",
        });
      }

      const secret = env.JWT_SECRET;
      const uuid = uuidv4();

      const signedToken = makeSignedTokenForPasswordRecovery({
        email: user.email,
        name: user.name,
        secret,
        uuid,
        accountId: accountWithCredentials.id,
      });
      const baseUrl = process.env.NEXT_PUBLIC_WEB_URL;

      const link = `${baseUrl}/forgot-my-password/${signedToken}`;

      await prisma.passwordRecoveryLinks.create({
        data: {
          id: uuid,
          recoveryLink: link,
          email: input.email.toLowerCase(),
          accountId: accountWithCredentials.id,
        },
      });

      await sendPasswordRecoveryEmail({
        email: input.email.toLowerCase(),
        name: user.name,
        link,
      });
    }),

  assignPasswordFromRecovery: publicProcedure
    .input(validatePasswordRecovery)
    .mutation(async ({ input }) => {
      const secret = process.env.JWT_SECRET;

      if (!secret) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "No secret.",
        });
      }

      const handleToken = await verifyToken(input.token, secret);

      const getLink = await prisma?.passwordRecoveryLinks.findUnique({
        where: { id: input.linkId },
      });

      if (getLink?.hasBeenUsed) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Link already used.",
        });
      }

      const hashedPass = await bcrypt.hash(input.password, 10);

      if (handleToken && "data" in handleToken) {
        // makes sure all links are invalidated
        await prisma?.passwordRecoveryLinks.updateMany({
          where: { email: input.email.toLowerCase() },
          data: { hasBeenUsed: true },
        });

        return prisma?.account.update({
          where: { id: input.userId },
          data: { password: hashedPass },
        });
      } else {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Token invalid.",
        });
      }
    }),
  addToMailingList: publicProcedure
    .input(validateAddToMailingList)
    .mutation(async ({ input }) => {
      await validateRecaptcha(input.reCaptchaToken);
      const mailingListRow = await prisma.mailingList.create({
        data: {
          email: input.email,
          name: input.name,
        },
      });
      await sendGetNotifiedConfirmationEmail({
        name: input.name,
        email: input.email,
        unsubscribeId: mailingListRow.unsubscribeId,
      });
    }),
});
