// FOX P&L (Profit & Loss) API Routes
// lakehouse.default.mart_finance_pl tablosu üzerinden P&L verileri

import { Hono } from "hono";
import type { Env } from "../../index";
import { createDatabricksClient } from "../../lib/databricks";

// Tablo bilgileri
const CATALOG = "lakehouse";
const SCHEMA = "default";
const TABLE = "mart_finance_pl";
const FULL_TABLE = `${CATALOG}.${SCHEMA}.${TABLE}`;

// P&L satır tipi
type PLRow = {
  entity: string;
  fiscal_year: number;
  fiscal_period: number;
  period_date: string;
  pl_section: string;
  pl_group: string;
  line_order: number;
  line_name: string;
  total_debit: number;
  total_credit: number;
  pl_impact: number;
  amount: number;
};

const app = new Hono<{ Bindings: Env }>()

  // =====================================================
  // KEŞIF ENDPOINT'LERI
  // =====================================================

  // Tablo şemasını göster
  .get("/schema", async (c) => {
    try {
      const db = createDatabricksClient(c.env);
      
      const result = await db.executeSQL<{
        col_name: string;
        data_type: string;
        comment: string;
      }>(`DESCRIBE ${FULL_TABLE}`);
      
      return c.json({
        table: FULL_TABLE,
        columns: result,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Bilinmeyen hata";
      return c.json({ error: message }, 500);
    }
  })

  // Örnek veri çek
  .get("/preview", async (c) => {
    try {
      const db = createDatabricksClient(c.env);
      const limit = Number(c.req.query("limit") || "20");
      
      const result = await db.executeSQL<PLRow>(
        `SELECT * FROM ${FULL_TABLE} ORDER BY entity, line_order LIMIT ${limit}`
      );
      
      return c.json({
        table: FULL_TABLE,
        row_count: result.length,
        data: result,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Bilinmeyen hata";
      return c.json({ error: message }, 500);
    }
  })

  // =====================================================
  // META VERİ ENDPOINT'LERI
  // =====================================================

  // Mevcut entity'leri listele
  .get("/entities", async (c) => {
    try {
      const db = createDatabricksClient(c.env);
      
      const result = await db.executeSQL<{
        entity: string;
        row_count: number;
        total_revenue: number;
        total_amount: number;
      }>(`
        SELECT 
          entity,
          COUNT(*) as row_count,
          SUM(CASE WHEN pl_section = 'revenue' THEN amount ELSE 0 END) as total_revenue,
          SUM(amount) as total_amount
        FROM ${FULL_TABLE}
        GROUP BY entity
        ORDER BY entity
      `);
      
      return c.json({ entities: result });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Bilinmeyen hata";
      return c.json({ error: message }, 500);
    }
  })

  // Mevcut dönemleri listele
  .get("/periods", async (c) => {
    try {
      const db = createDatabricksClient(c.env);
      
      const result = await db.executeSQL<{
        fiscal_year: number;
        fiscal_period: number;
        period_date: string;
        entity_count: number;
        row_count: number;
      }>(`
        SELECT 
          fiscal_year,
          fiscal_period,
          MAX(period_date) as period_date,
          COUNT(DISTINCT entity) as entity_count,
          COUNT(*) as row_count
        FROM ${FULL_TABLE}
        GROUP BY fiscal_year, fiscal_period
        ORDER BY fiscal_year DESC, fiscal_period DESC
      `);
      
      return c.json({ periods: result });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Bilinmeyen hata";
      return c.json({ error: message }, 500);
    }
  })

  // P&L yapısını göster (sections ve groups)
  .get("/structure", async (c) => {
    try {
      const db = createDatabricksClient(c.env);
      
      const result = await db.executeSQL<{
        pl_section: string;
        pl_group: string;
        line_count: number;
      }>(`
        SELECT 
          pl_section,
          pl_group,
          COUNT(DISTINCT line_name) as line_count
        FROM ${FULL_TABLE}
        GROUP BY pl_section, pl_group
        ORDER BY MIN(line_order)
      `);
      
      // Section bazlı grupla
      const structure: Record<string, { groups: string[]; line_count: number }> = {};
      result.forEach((row) => {
        if (!structure[row.pl_section]) {
          structure[row.pl_section] = { groups: [], line_count: 0 };
        }
        structure[row.pl_section].groups.push(row.pl_group);
        structure[row.pl_section].line_count += row.line_count;
      });
      
      return c.json({ structure, raw: result });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Bilinmeyen hata";
      return c.json({ error: message }, 500);
    }
  })

  // =====================================================
  // VERİ SORGULAMA ENDPOINT'LERI
  // =====================================================

  // Tüm P&L verisini çek (filtreleme destekli)
  .get("/", async (c) => {
    try {
      const db = createDatabricksClient(c.env);
      
      // Query parametreleri
      const entity = c.req.query("entity");
      const year = c.req.query("year");
      const period = c.req.query("period");
      const section = c.req.query("section");
      const limit = Number(c.req.query("limit") || "1000");
      
      // Dinamik WHERE koşulları
      const conditions: string[] = [];
      if (entity) conditions.push(`entity = '${entity}'`);
      if (year) conditions.push(`fiscal_year = ${year}`);
      if (period) conditions.push(`fiscal_period = ${period}`);
      if (section) conditions.push(`pl_section = '${section}'`);
      
      const whereClause = conditions.length > 0 
        ? `WHERE ${conditions.join(" AND ")}` 
        : "";
      
      const result = await db.executeSQL<PLRow>(
        `SELECT * FROM ${FULL_TABLE} ${whereClause} ORDER BY entity, line_order LIMIT ${limit}`
      );
      
      return c.json({
        filters: { entity, year, period, section },
        row_count: result.length,
        data: result,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Bilinmeyen hata";
      return c.json({ error: message }, 500);
    }
  })

  // =====================================================
  // RAPORLAMA ENDPOINT'LERI
  // =====================================================

  // Tek entity P&L raporu
  .get("/report/:entity", async (c) => {
    try {
      const db = createDatabricksClient(c.env);
      const entity = c.req.param("entity").toUpperCase();
      const year = c.req.query("year");
      const period = c.req.query("period");
      
      let whereClause = `WHERE entity = '${entity}'`;
      if (year) whereClause += ` AND fiscal_year = ${year}`;
      if (period) whereClause += ` AND fiscal_period = ${period}`;
      
      const result = await db.executeSQL<PLRow>(
        `SELECT * FROM ${FULL_TABLE} ${whereClause} ORDER BY line_order`
      );
      
      // Section bazlı grupla ve toplamları hesapla
      const sections: Record<string, {
        lines: PLRow[];
        total: number;
      }> = {};
      
      let totalRevenue = 0;
      let totalCogs = 0;
      let totalOpex = 0;
      let totalDepreciation = 0;
      
      result.forEach((row) => {
        if (!sections[row.pl_section]) {
          sections[row.pl_section] = { lines: [], total: 0 };
        }
        sections[row.pl_section].lines.push(row);
        sections[row.pl_section].total += row.amount;
        
        // Toplamları hesapla
        if (row.pl_section === "revenue") totalRevenue += row.amount;
        if (row.pl_section === "cogs") totalCogs += row.amount;
        if (row.pl_section === "opex") totalOpex += row.amount;
        if (row.pl_section === "depreciation") totalDepreciation += row.amount;
      });
      
      const grossProfit = totalRevenue - totalCogs;
      const ebitda = grossProfit - totalOpex;
      const ebit = ebitda - totalDepreciation;
      
      return c.json({
        entity,
        filters: { year, period },
        summary: {
          revenue: totalRevenue,
          cogs: totalCogs,
          gross_profit: grossProfit,
          gross_margin: totalRevenue ? (grossProfit / totalRevenue * 100).toFixed(2) + "%" : "N/A",
          opex: totalOpex,
          ebitda,
          ebitda_margin: totalRevenue ? (ebitda / totalRevenue * 100).toFixed(2) + "%" : "N/A",
          depreciation: totalDepreciation,
          ebit,
        },
        sections,
        row_count: result.length,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Bilinmeyen hata";
      return c.json({ error: message }, 500);
    }
  })

  // Konsolide P&L raporu (tüm entity'ler)
  .get("/consolidated", async (c) => {
    try {
      const db = createDatabricksClient(c.env);
      const year = c.req.query("year");
      const period = c.req.query("period");
      
      let whereClause = "";
      if (year || period) {
        const conditions: string[] = [];
        if (year) conditions.push(`fiscal_year = ${year}`);
        if (period) conditions.push(`fiscal_period = ${period}`);
        whereClause = `WHERE ${conditions.join(" AND ")}`;
      }
      
      // Entity bazlı section toplamları
      const entitySummary = await db.executeSQL<{
        entity: string;
        pl_section: string;
        total_amount: number;
      }>(`
        SELECT 
          entity,
          pl_section,
          SUM(amount) as total_amount
        FROM ${FULL_TABLE}
        ${whereClause}
        GROUP BY entity, pl_section
        ORDER BY entity, pl_section
      `);
      
      // Konsolide toplamlar
      const consolidated = await db.executeSQL<{
        pl_section: string;
        total_amount: number;
      }>(`
        SELECT 
          pl_section,
          SUM(amount) as total_amount
        FROM ${FULL_TABLE}
        ${whereClause}
        GROUP BY pl_section
        ORDER BY MIN(line_order)
      `);
      
      // Entity bazlı özet oluştur
      const byEntity: Record<string, Record<string, number>> = {};
      entitySummary.forEach((row) => {
        if (!byEntity[row.entity]) byEntity[row.entity] = {};
        byEntity[row.entity][row.pl_section] = row.total_amount;
      });
      
      // Her entity için metrikleri hesapla
      const entityMetrics = Object.entries(byEntity).map(([entity, sections]) => {
        const revenue = sections.revenue || 0;
        const cogs = sections.cogs || 0;
        const opex = sections.opex || 0;
        const depreciation = sections.depreciation || 0;
        const grossProfit = revenue - cogs;
        const ebitda = grossProfit - opex;
        const ebit = ebitda - depreciation;
        
        return {
          entity,
          revenue,
          cogs,
          gross_profit: grossProfit,
          opex,
          ebitda,
          depreciation,
          ebit,
        };
      });
      
      // Konsolide metrikleri hesapla
      const totalRevenue = consolidated.find(r => r.pl_section === "revenue")?.total_amount || 0;
      const totalCogs = consolidated.find(r => r.pl_section === "cogs")?.total_amount || 0;
      const totalOpex = consolidated.find(r => r.pl_section === "opex")?.total_amount || 0;
      const totalDepreciation = consolidated.find(r => r.pl_section === "depreciation")?.total_amount || 0;
      const grossProfit = totalRevenue - totalCogs;
      const ebitda = grossProfit - totalOpex;
      const ebit = ebitda - totalDepreciation;
      
      return c.json({
        filters: { year, period },
        consolidated: {
          revenue: totalRevenue,
          cogs: totalCogs,
          gross_profit: grossProfit,
          gross_margin: totalRevenue ? (grossProfit / totalRevenue * 100).toFixed(2) + "%" : "N/A",
          opex: totalOpex,
          ebitda,
          ebitda_margin: totalRevenue ? (ebitda / totalRevenue * 100).toFixed(2) + "%" : "N/A",
          depreciation: totalDepreciation,
          ebit,
        },
        by_entity: entityMetrics,
        sections: consolidated,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Bilinmeyen hata";
      return c.json({ error: message }, 500);
    }
  })

  // Entity karşılaştırma
  .get("/compare", async (c) => {
    try {
      const db = createDatabricksClient(c.env);
      const year = c.req.query("year");
      const period = c.req.query("period");
      
      let whereClause = "";
      if (year || period) {
        const conditions: string[] = [];
        if (year) conditions.push(`fiscal_year = ${year}`);
        if (period) conditions.push(`fiscal_period = ${period}`);
        whereClause = `WHERE ${conditions.join(" AND ")}`;
      }
      
      const result = await db.executeSQL<{
        entity: string;
        revenue: number;
        cogs: number;
        opex: number;
        depreciation: number;
      }>(`
        SELECT 
          entity,
          SUM(CASE WHEN pl_section = 'revenue' THEN amount ELSE 0 END) as revenue,
          SUM(CASE WHEN pl_section = 'cogs' THEN amount ELSE 0 END) as cogs,
          SUM(CASE WHEN pl_section = 'opex' THEN amount ELSE 0 END) as opex,
          SUM(CASE WHEN pl_section = 'depreciation' THEN amount ELSE 0 END) as depreciation
        FROM ${FULL_TABLE}
        ${whereClause}
        GROUP BY entity
        ORDER BY entity
      `);
      
      // Hesaplanmış metrikler ekle
      const comparison = result.map((row) => {
        const grossProfit = row.revenue - row.cogs;
        const ebitda = grossProfit - row.opex;
        const ebit = ebitda - row.depreciation;
        
        return {
          entity: row.entity,
          revenue: row.revenue,
          cogs: row.cogs,
          gross_profit: grossProfit,
          gross_margin: row.revenue ? ((grossProfit / row.revenue) * 100).toFixed(2) : "0.00",
          opex: row.opex,
          ebitda,
          ebitda_margin: row.revenue ? ((ebitda / row.revenue) * 100).toFixed(2) : "0.00",
          depreciation: row.depreciation,
          ebit,
        };
      });
      
      return c.json({
        filters: { year, period },
        comparison,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Bilinmeyen hata";
      return c.json({ error: message }, 500);
    }
  });

export default app;
