// FOX API Routes - Ana giriş noktası
// Tüm FOX route'larını birleştirir

import { Hono } from "hono";
import type { Env } from "../../index";
import { createDatabricksClient } from "../../lib/databricks";
import pnl from "./pnl";
import pnlReport from "./pnl-report";
import bs from "./bs";

const app = new Hono<{ Bindings: Env }>()
  // Databricks bağlantı testi
  .get("/test-connection", async (c) => {
    try {
      const db = createDatabricksClient(c.env);
      
      // Basit bir test sorgusu
      const result = await db.executeSQL<{ result: number }>("SELECT 1 as result");
      
      return c.json({
        status: "connected",
        message: "Databricks bağlantısı başarılı",
        test_result: result[0]?.result,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Bilinmeyen hata";
      return c.json(
        {
          status: "error",
          message: `Databricks bağlantı hatası: ${message}`,
          timestamp: new Date().toISOString(),
        },
        500
      );
    }
  })

  // Mevcut tabloları listele (keşif için)
  .get("/tables", async (c) => {
    try {
      const db = createDatabricksClient(c.env);
      const catalog = c.req.query("catalog") || "hive_metastore";
      const schema = c.req.query("schema") || "default";
      
      const result = await db.executeSQL<{ tableName: string }>(
        `SHOW TABLES IN ${catalog}.${schema}`
      );
      
      return c.json({
        catalog,
        schema,
        tables: result,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Bilinmeyen hata";
      return c.json({ error: message }, 500);
    }
  })

  // Tablo şemasını göster
  .get("/schema/:table", async (c) => {
    try {
      const db = createDatabricksClient(c.env);
      const table = c.req.param("table");
      const catalog = c.req.query("catalog") || "hive_metastore";
      const schema = c.req.query("schema") || "default";
      
      const result = await db.executeSQL<{
        col_name: string;
        data_type: string;
        comment: string;
      }>(`DESCRIBE ${catalog}.${schema}.${table}`);
      
      return c.json({
        table: `${catalog}.${schema}.${table}`,
        columns: result,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Bilinmeyen hata";
      return c.json({ error: message }, 500);
    }
  })

  // Örnek veri çek (ilk 10 satır)
  .get("/preview/:table", async (c) => {
    try {
      const db = createDatabricksClient(c.env);
      const table = c.req.param("table");
      const catalog = c.req.query("catalog") || "hive_metastore";
      const schema = c.req.query("schema") || "default";
      const limit = Number(c.req.query("limit") || "10");
      
      const result = await db.executeSQL(
        `SELECT * FROM ${catalog}.${schema}.${table} LIMIT ${limit}`
      );
      
      return c.json({
        table: `${catalog}.${schema}.${table}`,
        row_count: result.length,
        data: result,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Bilinmeyen hata";
      return c.json({ error: message }, 500);
    }
  })
  // P&L route'larını bağla
  .route("/pnl", pnl)
  // Yapılandırılmış P&L rapor route'ları
  .route("/pnl-report", pnlReport)
  // Balance Sheet route'ları
  .route("/bs", bs);

export default app;
