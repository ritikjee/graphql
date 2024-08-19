import CookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import { buildSchema } from "graphql";
import { createHandler } from "graphql-http/lib/use/express";
import { authRootValue } from "./graphql/rootValue/auth";
import { configureEnvironmentAndRoutes } from "./lib/setUpMode";
import { blogType, commentType } from "./graphql/types/blog.type";
import { topicType } from "./graphql/types/topic.types";
import { authType } from "./graphql/types/auth.type";
import { blogQuery } from "./graphql/blog/blog.query";
import { blogMutation } from "./graphql/blog/blog.mutation";

export const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(CookieParser());

const PORT = Number(process.env.PORT) || 8080;

configureEnvironmentAndRoutes(PORT);

var schema = buildSchema(
  authType +
    blogType +
    commentType +
    topicType +
    `
    type Query {
    ${blogQuery}
    }
    ` +
    `
    type Mutation {
    ${blogMutation}
    }
    `
);

var rootValue = {
  ...authRootValue,
};

app.all(
  "/graphql",
  createHandler({
    schema,
    rootValue,
    context: (req) => ({ req }),
  })
);

app.listen(PORT);
