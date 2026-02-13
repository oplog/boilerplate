// Hono Backend - Ana giris noktasi
// Tum API route'lari burada birlestirilir ve middleware'ler uygulanir

import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { html } from "hono/html";
import { authMiddleware } from "./middleware/auth";
import type { UserContext } from "./middleware/auth";
import health from "./routes/health";
import examples from "./routes/examples";
import me from "./routes/me";
import { openApiSpec } from "./lib/openapi";

export type Env = {
  ASSETS: Fetcher;
  // D1 veritabani kullanilacaksa:
  // DB: D1Database;
  // KV store kullanilacaksa:
  // KV: KVNamespace;
  // Nexus Gateway M2M (opsiyonel):
  // NEXUS_GATEWAY_URL: string;
  // KINDE_M2M_CLIENT_ID: string;
  // KINDE_M2M_CLIENT_SECRET: string;
  // KINDE_M2M_DOMAIN: string;
};

const app = new Hono<{ Bindings: Env; Variables: { user: UserContext } }>()
  .use("*", logger())
  .use("/api/*", cors())
  // Swagger UI & OpenAPI spec — auth middleware'den ÖNCE (erişim açık)
  .get("/api/docs/openapi.json", (c) => c.json(openApiSpec))
  .get("/api/docs", (c) => {
    return c.html(html`<!DOCTYPE html>
      <html lang="tr">
        <head>
          <meta charset="UTF-8" />
          <title>OPLOG API Docs</title>
          <link
            rel="stylesheet"
            href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css"
          />
        </head>
        <body>
          <div id="swagger-ui"></div>
          <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
          <script>
            SwaggerUIBundle({
              url: "/api/docs/openapi.json",
              dom_id: "#swagger-ui",
              presets: [
                SwaggerUIBundle.presets.apis,
                SwaggerUIBundle.SwaggerUIStandalonePreset,
              ],
              layout: "BaseLayout",
              deepLinking: true,
            });
          </script>
        </body>
      </html>`);
  })
  .use("/api/*", authMiddleware)
  .route("/api/health", health)
  .route("/api/me", me)
  .route("/api/examples", examples);

// Hono RPC icin type export'u - Frontend'de type-safe API cagrilari yapilabilir
export type AppType = typeof app;
export default app;
