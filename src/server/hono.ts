//server/hono.ts
import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { createStudioRoute, getStudioRoute, updateStudioRoute } from "./routes/studios.route";
import { createStudioHandler, getStudioHandler, updateStudioHandler } from "./controllers/studios.controller";

export const app = new OpenAPIHono().basePath("/api");

const spApp = new OpenAPIHono()
  .openapi(createStudioRoute, createStudioHandler)
  .openapi(updateStudioRoute, updateStudioHandler)
  .openapi(getStudioRoute, getStudioHandler)

export const route = app.route("/studios", spApp);

app.doc("/specification", {
  openapi: "3.0.0",
  info: { title: "Supabase Hackathon LW15", version: "1.0.0" },
}).get("/doc", Scalar({ url: "/api/specification" }));

export default app;
