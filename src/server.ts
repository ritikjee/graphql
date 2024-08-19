import CookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import { buildSchema } from "graphql";
import { createHandler } from "graphql-http/lib/use/express";
import { authRootValue } from "./graphql/auth";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(CookieParser());

const PORT = process.env.PORT || 8080;

var schema = buildSchema(`
  type User {
    id: ID!
    username: String!
  }

  type AuthPayload {
    token: String
    user: User
  }

  type Query {
    getUserInfo: User
  }

  type Mutation {
    register(email:String!,name:String!,userName: String!, password: String!): User
    login(identifier: String!, password: String!): AuthPayload
  }
`);

var rootValue = {
  ...authRootValue,
};

async function setupDevMode() {
  if (process.env.NODE_ENV !== "production") {
    // @ts-ignore
    const { ruruHTML } = await import("ruru/server");
    process.stdout.write(
      `Server running in development mode\nAccess Ruru server on http://localhost:${PORT}\n`
    );

    app.get("/", (_req, res) => {
      res.type("html");
      res.end(ruruHTML({ endpoint: "/graphql" }));
    });
  } else {
    process.stdout.write(`Server running in production mode\n`);

    app.get("/", (_, res) => {
      res.send("Hello world!");
    });
  }
}

setupDevMode();

app.all(
  "/graphql",
  createHandler({
    schema,
    rootValue,
    context: (req) => ({ req }),
  })
);

app.listen(PORT);
