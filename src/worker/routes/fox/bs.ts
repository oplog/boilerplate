// FOX Balance Sheet (BS) API Routes
// lakehouse.default.mart_finance_bs tablosu üzerinden Bilanço verileri

import { Hono } from "hono";
import type { Env } from "../../index";
import { createDatabricksClient } from "../../lib/databricks";

// Tablo bilgileri
const CATALOG = "lakehouse";
const SCHEMA = "default";
const TABLE = "mart_finance_bs";
const FULL_TABLE = `${CATALOG}.${SCHEMA}.${TABLE}`;

// BS satır tipi
type BSRow = {
  entity: string;
  fiscal_year: number;
  fiscal_period: number;
  period_date: string;
  bs_section: string;
  bs_group: string;
  line_order: number;
  line_name: string;
  total_debit: number;
  total_credit: number;
  amount: number;
};

// BS raporu tipi
type BSGroup = { lines: { name: string; amount: number }[]; total: number };
type BSReport = {
  metadata: { entity: string; fiscal_year: number; fiscal_period: number; period_date: string; currency: string };
  assets: {
    current: { total: number; groups: Record<string, BSGroup> };
    non_current: { total: number; groups: Record<string, BSGroup> };
    total: number;
  };
  liabilities: {
    current: { total: number; groups: Record<string, BSGroup> };
    non_current: { total: number; groups: Record<string, BSGroup> };
    total: number;
  };
  equity: { total: number; groups: Record<string, BSGroup> };
  balance_check: { total_assets: number; total_liabilities_and_equity: number; is_balanced: boolean };
};

// BS satırlarından rapor oluştur
function buildBSReport(rows: BSRow[], entity: string): BSReport {
  const currentAssets: Record<string, BSGroup> = {};
  const nonCurrentAssets: Record<string, BSGroup> = {};
  const currentLiabilities: Record<string, BSGroup> = {};
  const nonCurrentLiabilities: Record<string, BSGroup> = {};
  const equity: Record<string, BSGroup> = {};

  let totalCurrentAssets = 0;
  let totalNonCurrentAssets = 0;
  let totalCurrentLiabilities = 0;
  let totalNonCurrentLiabilities = 0;
  let totalEquity = 0;

  for (const row of rows) {
    const line = { name: row.line_name, amount: row.amount };
    const section = row.bs_section;
    const group = row.bs_group;

    if (section === "current_assets") {
      if (!currentAssets[group]) currentAssets[group] = { lines: [], total: 0 };
      currentAssets[group].lines.push(line);
      currentAssets[group].total += row.amount;
      totalCurrentAssets += row.amount;
    } else if (section === "non_current_assets") {
      if (!nonCurrentAssets[group]) nonCurrentAssets[group] = { lines: [], total: 0 };
      nonCurrentAssets[group].lines.push(line);
      nonCurrentAssets[group].total += row.amount;
      totalNonCurrentAssets += row.amount;
    } else if (section === "current_liabilities") {
      if (!currentLiabilities[group]) currentLiabilities[group] = { lines: [], total: 0 };
      currentLiabilities[group].lines.push(line);
      currentLiabilities[group].total += row.amount;
      totalCurrentLiabilities += row.amount;
    } else if (section === "non_current_liabilities") {
      if (!nonCurrentLiabilities[group]) nonCurrentLiabilities[group] = { lines: [], total: 0 };
      nonCurrentLiabilities[group].lines.push(line);
      nonCurrentLiabilities[group].total += row.amount;
      totalNonCurrentLiabilities += row.amount;
    } else if (section === "equity") {
      if (!equity[group]) equity[group] = { lines: [], total: 0 };
      equity[group].lines.push(line);
      equity[group].total += row.amount;
      totalEquity += row.amount;
    }
  }

  const totalAssets = totalCurrentAssets + totalNonCurrentAssets;
  const totalLiabilities = totalCurrentLiabilities + totalNonCurrentLiabilities;

  return {
    metadata: {
      entity,
      fiscal_year: rows[0].fiscal_year,
      fiscal_period: rows[0].fiscal_period,
      period_date: rows[0].period_date,
      currency: "EUR",
    },
    assets: {
      current: { total: totalCurrentAssets, groups: currentAssets },
      non_current: { total: totalNonCurrentAssets, groups: nonCurrentAssets },
      total: totalAssets,
    },
    liabilities: {
      current: { total: totalCurrentLiabilities, groups: currentLiabilities },
      non_current: { total: totalNonCurrentLiabilities, groups: nonCurrentLiabilities },
      total: totalLiabilities,
    },
    equity: { total: totalEquity, groups: equity },
    balance_check: {
      total_assets: totalAssets,
      total_liabilities_and_equity: totalLiabilities + totalEquity,
      is_balanced: Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.01,
    },
  };
}

const app = new Hono<{ Bindings: Env }>()

  // =====================================================
  // KEŞİF ENDPOINT'LERİ
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
      
      const result = await db.executeSQL<BSRow>(
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
  // META VERİ ENDPOINT'LERİ
  // =====================================================

  // Mevcut entity'leri listele
  .get("/entities", async (c) => {
    try {
      const db = createDatabricksClient(c.env);
      
      const result = await db.executeSQL<{
        entity: string;
        row_count: number;
        total_assets: number;
        total_liabilities: number;
      }>(`
        SELECT 
          entity,
          COUNT(*) as row_count,
          SUM(CASE WHEN bs_section LIKE '%assets%' THEN amount ELSE 0 END) as total_assets,
          SUM(CASE WHEN bs_section LIKE '%liabilities%' THEN amount ELSE 0 END) as total_liabilities
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

  // BS yapısını göster (sections ve groups)
  .get("/structure", async (c) => {
    try {
      const db = createDatabricksClient(c.env);
      
      const result = await db.executeSQL<{
        bs_section: string;
        bs_group: string;
        line_count: number;
      }>(`
        SELECT 
          bs_section,
          bs_group,
          COUNT(DISTINCT line_name) as line_count
        FROM ${FULL_TABLE}
        GROUP BY bs_section, bs_group
        ORDER BY MIN(line_order)
      `);
      
      // Section bazlı grupla
      const structure: Record<string, { groups: string[]; line_count: number }> = {};
      result.forEach((row) => {
        if (!structure[row.bs_section]) {
          structure[row.bs_section] = { groups: [], line_count: 0 };
        }
        structure[row.bs_section].groups.push(row.bs_group);
        structure[row.bs_section].line_count += row.line_count;
      });
      
      return c.json({ structure, raw: result });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Bilinmeyen hata";
      return c.json({ error: message }, 500);
    }
  })

  // =====================================================
  // VERİ SORGULAMA ENDPOINT'LERİ
  // =====================================================

  // Tüm BS verisini çek (filtreleme destekli)
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
      if (section) conditions.push(`bs_section = '${section}'`);
      
      const whereClause = conditions.length > 0 
        ? `WHERE ${conditions.join(" AND ")}` 
        : "";
      
      const result = await db.executeSQL<BSRow>(
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

  // Tek entity BS raporu
  .get("/report/:entity", async (c) => {
    try {
      const db = createDatabricksClient(c.env);
      const entity = c.req.param("entity").toUpperCase();
      const year = c.req.query("year");
      const period = c.req.query("period");
      
      let whereClause = `WHERE entity = '${entity}'`;
      if (year) whereClause += ` AND fiscal_year = ${year}`;
      if (period) whereClause += ` AND fiscal_period = ${period}`;
      
      const result = await db.executeSQL<BSRow>(
        `SELECT * FROM ${FULL_TABLE} ${whereClause} ORDER BY line_order`
      );
      
      if (result.length === 0) {
        return c.json({ error: `${entity} için veri bulunamadı` }, 404);
      }
      
      // Section ve grup bazlı organize et
      const currentAssets: Record<string, { lines: { name: string; amount: number }[]; total: number }> = {};
      const nonCurrentAssets: Record<string, { lines: { name: string; amount: number }[]; total: number }> = {};
      const currentLiabilities: Record<string, { lines: { name: string; amount: number }[]; total: number }> = {};
      const nonCurrentLiabilities: Record<string, { lines: { name: string; amount: number }[]; total: number }> = {};
      const equity: Record<string, { lines: { name: string; amount: number }[]; total: number }> = {};
      
      let totalCurrentAssets = 0;
      let totalNonCurrentAssets = 0;
      let totalCurrentLiabilities = 0;
      let totalNonCurrentLiabilities = 0;
      let totalEquity = 0;
      
      result.forEach((row) => {
        const line = { name: row.line_name, amount: row.amount };
        
        if (row.bs_section === "current_assets") {
          if (!currentAssets[row.bs_group]) currentAssets[row.bs_group] = { lines: [], total: 0 };
          currentAssets[row.bs_group].lines.push(line);
          currentAssets[row.bs_group].total += row.amount;
          totalCurrentAssets += row.amount;
        } else if (row.bs_section === "non_current_assets") {
          if (!nonCurrentAssets[row.bs_group]) nonCurrentAssets[row.bs_group] = { lines: [], total: 0 };
          nonCurrentAssets[row.bs_group].lines.push(line);
          nonCurrentAssets[row.bs_group].total += row.amount;
          totalNonCurrentAssets += row.amount;
        } else if (row.bs_section === "current_liabilities") {
          if (!currentLiabilities[row.bs_group]) currentLiabilities[row.bs_group] = { lines: [], total: 0 };
          currentLiabilities[row.bs_group].lines.push(line);
          currentLiabilities[row.bs_group].total += row.amount;
          totalCurrentLiabilities += row.amount;
        } else if (row.bs_section === "non_current_liabilities") {
          if (!nonCurrentLiabilities[row.bs_group]) nonCurrentLiabilities[row.bs_group] = { lines: [], total: 0 };
          nonCurrentLiabilities[row.bs_group].lines.push(line);
          nonCurrentLiabilities[row.bs_group].total += row.amount;
          totalNonCurrentLiabilities += row.amount;
        } else if (row.bs_section === "equity") {
          if (!equity[row.bs_group]) equity[row.bs_group] = { lines: [], total: 0 };
          equity[row.bs_group].lines.push(line);
          equity[row.bs_group].total += row.amount;
          totalEquity += row.amount;
        }
      });
      
      const totalAssets = totalCurrentAssets + totalNonCurrentAssets;
      const totalLiabilities = totalCurrentLiabilities + totalNonCurrentLiabilities;
      
      return c.json({
        metadata: {
          entity,
          fiscal_year: result[0].fiscal_year,
          fiscal_period: result[0].fiscal_period,
          period_date: result[0].period_date,
          currency: "EUR",
        },
        assets: {
          current: {
            total: totalCurrentAssets,
            groups: currentAssets,
          },
          non_current: {
            total: totalNonCurrentAssets,
            groups: nonCurrentAssets,
          },
          total: totalAssets,
        },
        liabilities: {
          current: {
            total: totalCurrentLiabilities,
            groups: currentLiabilities,
          },
          non_current: {
            total: totalNonCurrentLiabilities,
            groups: nonCurrentLiabilities,
          },
          total: totalLiabilities,
        },
        equity: {
          total: totalEquity,
          groups: equity,
        },
        // Bilanço dengesi kontrolü
        balance_check: {
          total_assets: totalAssets,
          total_liabilities_and_equity: totalLiabilities + totalEquity,
          is_balanced: Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.01,
        },
        row_count: result.length,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Bilinmeyen hata";
      return c.json({ error: message }, 500);
    }
  })

  // Konsolide BS raporu (tüm entity'ler)
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
      
      // Konsolide veriler için tüm entity'leri topla
      const result = await db.executeSQL<BSRow>(`
        SELECT 
          'CONSOLIDATED' as entity,
          fiscal_year,
          fiscal_period,
          MAX(period_date) as period_date,
          bs_section,
          bs_group,
          line_order,
          line_name,
          SUM(total_debit) as total_debit,
          SUM(total_credit) as total_credit,
          SUM(amount) as amount
        FROM ${FULL_TABLE}
        ${whereClause}
        GROUP BY fiscal_year, fiscal_period, bs_section, bs_group, line_order, line_name
        ORDER BY line_order
      `);
      
      if (result.length === 0) {
        return c.json({ error: "Veri bulunamadı" }, 404);
      }
      
      // Section ve grup bazlı organize et
      const currentAssets: Record<string, { lines: { name: string; amount: number }[]; total: number }> = {};
      const nonCurrentAssets: Record<string, { lines: { name: string; amount: number }[]; total: number }> = {};
      const currentLiabilities: Record<string, { lines: { name: string; amount: number }[]; total: number }> = {};
      const nonCurrentLiabilities: Record<string, { lines: { name: string; amount: number }[]; total: number }> = {};
      const equity: Record<string, { lines: { name: string; amount: number }[]; total: number }> = {};
      
      let totalCurrentAssets = 0;
      let totalNonCurrentAssets = 0;
      let totalCurrentLiabilities = 0;
      let totalNonCurrentLiabilities = 0;
      let totalEquity = 0;
      
      result.forEach((row) => {
        const line = { name: row.line_name, amount: row.amount };
        
        if (row.bs_section === "current_assets") {
          if (!currentAssets[row.bs_group]) currentAssets[row.bs_group] = { lines: [], total: 0 };
          currentAssets[row.bs_group].lines.push(line);
          currentAssets[row.bs_group].total += row.amount;
          totalCurrentAssets += row.amount;
        } else if (row.bs_section === "non_current_assets") {
          if (!nonCurrentAssets[row.bs_group]) nonCurrentAssets[row.bs_group] = { lines: [], total: 0 };
          nonCurrentAssets[row.bs_group].lines.push(line);
          nonCurrentAssets[row.bs_group].total += row.amount;
          totalNonCurrentAssets += row.amount;
        } else if (row.bs_section === "current_liabilities") {
          if (!currentLiabilities[row.bs_group]) currentLiabilities[row.bs_group] = { lines: [], total: 0 };
          currentLiabilities[row.bs_group].lines.push(line);
          currentLiabilities[row.bs_group].total += row.amount;
          totalCurrentLiabilities += row.amount;
        } else if (row.bs_section === "non_current_liabilities") {
          if (!nonCurrentLiabilities[row.bs_group]) nonCurrentLiabilities[row.bs_group] = { lines: [], total: 0 };
          nonCurrentLiabilities[row.bs_group].lines.push(line);
          nonCurrentLiabilities[row.bs_group].total += row.amount;
          totalNonCurrentLiabilities += row.amount;
        } else if (row.bs_section === "equity") {
          if (!equity[row.bs_group]) equity[row.bs_group] = { lines: [], total: 0 };
          equity[row.bs_group].lines.push(line);
          equity[row.bs_group].total += row.amount;
          totalEquity += row.amount;
        }
      });
      
      const totalAssets = totalCurrentAssets + totalNonCurrentAssets;
      const totalLiabilities = totalCurrentLiabilities + totalNonCurrentLiabilities;
      
      return c.json({
        metadata: {
          entity: "CONSOLIDATED",
          fiscal_year: result[0].fiscal_year,
          fiscal_period: result[0].fiscal_period,
          period_date: result[0].period_date,
          currency: "EUR",
        },
        assets: {
          current: {
            total: totalCurrentAssets,
            groups: currentAssets,
          },
          non_current: {
            total: totalNonCurrentAssets,
            groups: nonCurrentAssets,
          },
          total: totalAssets,
        },
        liabilities: {
          current: {
            total: totalCurrentLiabilities,
            groups: currentLiabilities,
          },
          non_current: {
            total: totalNonCurrentLiabilities,
            groups: nonCurrentLiabilities,
          },
          total: totalLiabilities,
        },
        equity: {
          total: totalEquity,
          groups: equity,
        },
        balance_check: {
          total_assets: totalAssets,
          total_liabilities_and_equity: totalLiabilities + totalEquity,
          is_balanced: Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.01,
        },
        row_count: result.length,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Bilinmeyen hata";
      return c.json({ error: message }, 500);
    }
  })

  // =====================================================
  // TÜM ENTİTY'LER (KARŞILAŞTIRMA)
  // =====================================================
  .get("/all-entities", async (c) => {
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

      // Tüm entity'leri al
      const entities = await db.executeSQL<{ entity: string }>(
        `SELECT DISTINCT entity FROM ${FULL_TABLE} ${whereClause} ORDER BY entity`
      );

      const reports: BSReport[] = [];

      for (const { entity } of entities) {
        const entityWhere = whereClause
          ? `${whereClause} AND entity = '${entity}'`
          : `WHERE entity = '${entity}'`;

        const rows = await db.executeSQL<BSRow>(
          `SELECT * FROM ${FULL_TABLE} ${entityWhere} ORDER BY line_order`
        );

        if (rows.length > 0) {
          reports.push(buildBSReport(rows, entity));
        }
      }

      // Konsolide rapor
      const consolidatedRows = await db.executeSQL<BSRow>(`
        SELECT
          'CONSOLIDATED' as entity,
          fiscal_year,
          fiscal_period,
          MAX(period_date) as period_date,
          bs_section,
          bs_group,
          line_order,
          line_name,
          SUM(total_debit) as total_debit,
          SUM(total_credit) as total_credit,
          SUM(amount) as amount
        FROM ${FULL_TABLE}
        ${whereClause}
        GROUP BY fiscal_year, fiscal_period, bs_section, bs_group, line_order, line_name
        ORDER BY line_order
      `);

      if (consolidatedRows.length > 0) {
        reports.push(buildBSReport(consolidatedRows, "CONSOLIDATED"));
      }

      return c.json({
        filters: { year, period },
        reports,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Bilinmeyen hata";
      return c.json({ error: message }, 500);
    }
  })

  // Entity karşılaştırma (özet tablo)
  .get("/summary-table", async (c) => {
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
        bs_section: string;
        total: number;
      }>(`
        SELECT 
          entity,
          bs_section,
          SUM(amount) as total
        FROM ${FULL_TABLE}
        ${whereClause}
        GROUP BY entity, bs_section
        ORDER BY entity
      `);
      
      // Entity bazlı özet oluştur
      const entityMap: Record<string, Record<string, number>> = {};
      result.forEach((row) => {
        if (!entityMap[row.entity]) entityMap[row.entity] = {};
        entityMap[row.entity][row.bs_section] = row.total;
      });
      
      const summaryTable = Object.entries(entityMap).map(([entity, sections]) => {
        const currentAssets = sections.current_assets || 0;
        const nonCurrentAssets = sections.non_current_assets || 0;
        const currentLiabilities = sections.current_liabilities || 0;
        const nonCurrentLiabilities = sections.non_current_liabilities || 0;
        const equity = sections.equity || 0;
        
        const totalAssets = currentAssets + nonCurrentAssets;
        const totalLiabilities = currentLiabilities + nonCurrentLiabilities;
        const workingCapital = currentAssets - currentLiabilities;
        
        return {
          entity,
          current_assets: currentAssets,
          non_current_assets: nonCurrentAssets,
          total_assets: totalAssets,
          current_liabilities: currentLiabilities,
          non_current_liabilities: nonCurrentLiabilities,
          total_liabilities: totalLiabilities,
          equity,
          working_capital: workingCapital,
          current_ratio: currentLiabilities !== 0 ? (currentAssets / Math.abs(currentLiabilities)).toFixed(2) : "N/A",
        };
      });
      
      // Konsolide satır
      const consolidated = summaryTable.reduce(
        (acc, row) => {
          acc.current_assets += row.current_assets;
          acc.non_current_assets += row.non_current_assets;
          acc.total_assets += row.total_assets;
          acc.current_liabilities += row.current_liabilities;
          acc.non_current_liabilities += row.non_current_liabilities;
          acc.total_liabilities += row.total_liabilities;
          acc.equity += row.equity;
          acc.working_capital += row.working_capital;
          return acc;
        },
        {
          entity: "CONSOLIDATED",
          current_assets: 0,
          non_current_assets: 0,
          total_assets: 0,
          current_liabilities: 0,
          non_current_liabilities: 0,
          total_liabilities: 0,
          equity: 0,
          working_capital: 0,
          current_ratio: "N/A" as string | number,
        }
      );
      
      consolidated.current_ratio = consolidated.current_liabilities !== 0 
        ? (consolidated.current_assets / Math.abs(consolidated.current_liabilities)).toFixed(2) 
        : "N/A";
      
      return c.json({
        filters: { year, period },
        entities: summaryTable,
        consolidated,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Bilinmeyen hata";
      return c.json({ error: message }, 500);
    }
  });

export default app;
