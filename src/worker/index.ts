// Hono Backend - Ana giriş noktası
// Tüm API route'ları burada birleştirilir ve middleware'ler uygulanır

import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import health from "./routes/health";
import examples from "./routes/examples";

export type Env = {
  ASSETS: Fetcher;
  // D1 veritabanı kullanılacaksa:
  // DB: D1Database;
  // KV store kullanılacaksa:
  // KV: KVNamespace;
};

const app = new Hono<{ Bindings: Env }>()
  .use("*", logger())
  .use("/api/*", cors())
  .route("/api/health", health)
  .route("/api/examples", examples);

// Hono RPC için type export'u - Frontend'de type-safe API çağrıları yapılabilir
export type AppType = typeof app;
export default app;
