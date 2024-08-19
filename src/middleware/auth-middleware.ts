import { PrismaClient, User } from "@prisma/client";
import { Request } from "express";
import { GraphQLResolveInfo } from "graphql";
import jsonwebtoken from "jsonwebtoken";
import { db } from "../lib/db";

export interface Context {
  req: Request;
  user?: User;
  db: PrismaClient;
}

type ResolverFunction = (
  parent: any,
  args: any,
  context: Context,
  info: GraphQLResolveInfo
) => any;

export const authenticate =
  (resolver: ResolverFunction): ResolverFunction =>
  async (parent, args, context, info) => {
    const token = context.req.headers.authorization || "";

    if (!token) {
      throw new Error("Authentication token is missing");
    }

    try {
      const decodedToken = jsonwebtoken.verify(
        token,
        process.env.JWT_SECRET as string
      ) as { id: string };
      const user = await db.user.findUnique({
        where: {
          id: Number(decodedToken.id),
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      context.user = user;
      return resolver(parent, args, context, info);
    } catch (error) {
      throw new Error("Authentication failed");
    }
  };
