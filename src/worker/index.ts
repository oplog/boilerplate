// Hono Backend - Ana giriş noktası
// Tüm API route'ları burada birleştirilir ve middleware'ler uygulanır

import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import health from "./routes/health";
import examples from "./routes/examples";
import pnl from "./routes/fox/pnl";
import pnlReport from "./routes/fox/pnl-report";
import bs from "./routes/fox/bs";

export type Env = {
  ASSETS: Fetcher;
  // Databricks bağlantı bilgileri
  DATABRICKS_HOST: string;
  DATABRICKS_TOKEN: string;
  DATABRICKS_WAREHOUSE_ID: string;
  // D1 veritabanı kullanılacaksa:
  // DB: D1Database;
  // KV store kullanılacaksa:
  // KV: KVNamespace;
};

const app = new Hono<{ Bindings: Env }>()
  .use("*", logger())
  .use("/api/*", cors())
  .route("/api/health", health)
  .route("/api/examples", examples)
  // Financial APIs
  .route("/api/pnl", pnl)
  .route("/api/pnl-report", pnlReport)
  .route("/api/bs", bs);

// Hono RPC için type export'u - Frontend'de type-safe API çağrıları yapılabilir
export type AppType = typeof app;
export default app;
