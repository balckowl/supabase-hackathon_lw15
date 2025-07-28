import { route } from "@/server/hono";
import { hc } from "hono/client";

export const hono = hc<typeof route>(process.env.NEXT_PUBLIC_BASE_URL!);
