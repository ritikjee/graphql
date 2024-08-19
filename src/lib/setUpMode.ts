import { app } from "../server";

export async function configureEnvironmentAndRoutes(PORT: number) {
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
    process.stdout.write(
      `Server running in production mode\nAccess server on http://localhost:${PORT}\n`
    );

    app.get("/", (_, res) => {
      res.send("Hello world!");
    });
  }
}
