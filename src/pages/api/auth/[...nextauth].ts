import NextAuth from "next-auth";

import { authOptions } from "@/server/auth";
import { NextApiRequest, NextApiResponse } from "next";

export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, authOptions(req, res));
