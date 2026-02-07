// Health check endpoint'i
// Uygulamanın çalışıp çalışmadığını kontrol etmek için kullanılır

import { Hono } from "hono";

const app = new Hono()
  .get("/", (c) => {
    return c.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: "production",
    });
  });

export default app;
