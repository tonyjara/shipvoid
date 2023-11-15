import {
  type NextApiRequest,
  type NextApiResponse,
  type GetServerSidePropsContext,
} from "next";
import { getServerSession, type NextAuthOptions } from "next-auth";
import { prisma } from "@/server/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { postToTelegramGroup } from "@/utils/TelegramUtils";
import { appOptions } from "@/lib/Constants/AppOptions";
import { User } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    expires: Date;
    user: User;
    status: "loading" | "authenticated" | "unauthenticated";
  }
}

const isDev = process.env.NODE_ENV === "development";

function CustomPrismaAdapter(
  p: typeof prisma,
  req: NextApiRequest,
  res: NextApiResponse,
) {
  //Do stuff with req and res, like getting cookies or headers.
  //const cookieKey = 'some-cookie-key'
  //const referedByUserId = getCookie(cookieKey, {req, res})

  return {
    ...PrismaAdapter(p),
    createUser: async (data: {
      name: string | null;
      email: string | null;
      image: string;
      emailVerified: Date | null;
    }) => {
      //Here you can add custom logic to create a user.
      //An example could be adding referrals from cookies
      //Avoid user creation when error is thrown by using a transaction.
      return await p.$transaction(
        async (tx) => {
          if (!data.email || !data.name)
            throw new Error("Provider failed to provide email or name.");

          const user = await tx.user.create({
            data: {
              ...data,
              emailVerified: new Date(),
              role: "user",
              //By default emailVerified is null
            },
          });

          return user;
        },
        {
          timeout: 30000,
        },
      );
    },
  };
}

export const authOptions = (
  req: NextApiRequest,
  res: NextApiResponse,
): NextAuthOptions => ({
  //@ts-ignore
  adapter: CustomPrismaAdapter(prisma, req, res),
  callbacks: {
    jwt: async ({ token, account, user }) => {
      /* Purpose of this function is to receive the information from authorize and add jwt token information. */
      /* - user is the return from authorize */
      /* - account describes type and provider, ex: */
      /*  {"type":"credentials","provider":"credentials"} */
      /* - token holds the iat, exo and jti. */

      if (account?.type === "credentials") {
        token.user = user;
      }
      if (account?.type === "oauth") {
        token.user = user;
      }

      return token;
    },

    session: async ({ session, token }) => {
      /*  Purpose of this callback is to handle the session object. */
      /* Session has the user object with authorize return and the expiration date. */
      /* token has the same info as the jwt, it has the user with the authorize return and iat, exp and jti */

      session.user = token.user as User;

      return session;
    },
  },
  // Configure one or more authentication providers

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        // keys added here will be part of the credentials type.
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        //This runs when user logs in with credentials.
        if (!credentials?.email || !credentials.password) return null;

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email.toLowerCase(),
          },
        });
        if (!user || !user.active) return null;

        //TODO: notify user that email is not verified.
        if (!user.emailVerified) return null;

        const account = await prisma.account.findFirst({
          where: {
            userId: user.id,
            type: "credentials",
          },
        });
        //TODO: notify user if signup was made through another provider.
        if (!account || !account.password) return null;

        const matchesHash = await bcrypt.compare(
          credentials.password,
          account.password, //hashed pass
        );

        if (!matchesHash) return null;

        //Prevent signins if the app is in maintenance mode.
        if (
          appOptions.heroScreenType === "maintenance" &&
          user.role !== "admin" &&
          !isDev
        )
          return null;

        await postToTelegramGroup(
          user.email ?? user.name ?? user.id,
          "logged in",
        );

        return user;
      },
    }),
  ],
  session: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    strategy: "jwt",
  },
});

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(
    ctx.req,
    ctx.res,
    authOptions(ctx.req as NextApiRequest, ctx.res as NextApiResponse),
  );
};
