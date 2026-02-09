// FOX P&L Report API - OPLOG Resmi P&L Formatı
// Konsolide ve entity bazlı yapılandırılmış P&L raporları

import { Hono } from "hono";
import type { Env } from "../../index";
import { createDatabricksClient } from "../../lib/databricks";

const FULL_TABLE = "lakehouse.default.mart_finance_pl";

// P&L satır tipi - pl_impact hesaplamalar için, amount görüntüleme için
type PLLineItem = {
  entity: string;
  fiscal_year: number;
  fiscal_period: number;
  period_date: string;
  pl_section: string;
  pl_group: string;
  line_order: number;
  line_name: string;
  pl_impact: number; // Hesaplamalar için (giderler negatif, gelirler pozitif)
  amount: number;    // Görüntüleme için (mutlak değer)
};

// Yapılandırılmış P&L rapor tipi
type PLReport = {
  metadata: {
    entity: string | "CONSOLIDATED";
    fiscal_year: number;
    fiscal_period: number;
    period_date: string;
    currency: string;
  };
  revenue: {
    total: number;
    lines: { name: string; amount: number }[];
  };
  cogs: {
    total: number;
    warehouse: {
      total: number;
      lines: { name: string; amount: number }[];
    };
    operation_labor: {
      total: number;
      lines: { name: string; amount: number }[];
    };
    last_mile: {
      total: number;
      lines: { name: string; amount: number }[];
    };
    direct: {
      total: number;
      lines: { name: string; amount: number }[];
    };
  };
  gross_profit: number;
  gross_margin: string;
  opex: {
    total: number;
    employment: {
      total: number;
      lines: { name: string; amount: number }[];
    };
    technology: {
      total: number;
      lines: { name: string; amount: number }[];
    };
    advertising: {
      total: number;
      lines: { name: string; amount: number }[];
    };
    professional: {
      total: number;
      lines: { name: string; amount: number }[];
    };
    travel: {
      total: number;
      lines: { name: string; amount: number }[];
    };
    office: {
      total: number;
      lines: { name: string; amount: number }[];
    };
    other_direct: {
      total: number;
      lines: { name: string; amount: number }[];
    };
    cost_alloc: {
      total: number;
      lines: { name: string; amount: number }[];
    };
  };
  ebitda: number;
  ebitda_margin: string;
  below_ebitda: {
    total: number;
    interest: {
      total: number;
      lines: { name: string; amount: number }[];
    };
    finance: {
      total: number;
      lines: { name: string; amount: number }[];
    };
  };
  extraordinary: {
    total: number;
    lines: { name: string; amount: number }[];
  };
  depreciation: {
    total: number;
    lines: { name: string; amount: number }[];
  };
  pbt: number;
  pbt_margin: string;
};

// Yardımcı: Yüzde formatla
function formatPercent(value: number, total: number): string {
  if (total === 0) return "0%";
  return ((value / total) * 100).toFixed(0) + "%";
}

// Yardımcı: Satırları gruplara ayır (amount ile - görüntüleme için)
function groupLines(
  lines: PLLineItem[],
  filterFn: (line: PLLineItem) => boolean
): { name: string; amount: number }[] {
  return lines
    .filter(filterFn)
    .sort((a, b) => a.line_order - b.line_order)
    .map((l) => ({ name: l.line_name, amount: l.amount }));
}

// Yardımcı: Grup toplamı hesapla (pl_impact ile - hesaplama için)
function sumGroupImpact(
  lines: PLLineItem[],
  filterFn: (line: PLLineItem) => boolean
): number {
  return lines.filter(filterFn).reduce((sum, l) => sum + l.pl_impact, 0);
}

// P&L raporu oluştur
function buildPLReport(
  lines: PLLineItem[],
  entity: string | "CONSOLIDATED",
  fiscalYear: number,
  fiscalPeriod: number,
  periodDate: string
): PLReport {
  // Revenue (pl_impact pozitif)
  const revenueLines = groupLines(lines, (l) => l.pl_section === "revenue");
  const revenueTotal = sumGroupImpact(lines, (l) => l.pl_section === "revenue");

  // COGS - Warehouse (pl_impact negatif)
  const cogsWhLines = groupLines(lines, (l) => l.pl_group === "cogs_wh");
  const cogsWhTotal = sumGroupImpact(lines, (l) => l.pl_group === "cogs_wh");

  // COGS - Operation Labor
  const cogsLaborLines = groupLines(lines, (l) => l.pl_group === "cogs_labor");
  const cogsLaborTotal = sumGroupImpact(lines, (l) => l.pl_group === "cogs_labor");

  // COGS - Last Mile
  const cogsLmLines = groupLines(lines, (l) => l.pl_group === "cogs_lm");
  const cogsLmTotal = sumGroupImpact(lines, (l) => l.pl_group === "cogs_lm");

  // COGS - Direct
  const cogsDirectLines = groupLines(lines, (l) => l.pl_group === "cogs_direct");
  const cogsDirectTotal = sumGroupImpact(lines, (l) => l.pl_group === "cogs_direct");

  // COGS Total (negatif değer)
  const cogsTotal = sumGroupImpact(lines, (l) => l.pl_section === "cogs");

  // Gross Profit = Revenue + COGS (COGS zaten negatif)
  const grossProfit = revenueTotal + cogsTotal;

  // OpEx groups (pl_impact negatif)
  const opexEmploymentLines = groupLines(lines, (l) => l.pl_group === "employment");
  const opexEmploymentTotal = sumGroupImpact(lines, (l) => l.pl_group === "employment");

  const opexTechnologyLines = groupLines(lines, (l) => l.pl_group === "technology");
  const opexTechnologyTotal = sumGroupImpact(lines, (l) => l.pl_group === "technology");

  const opexAdvertisingLines = groupLines(lines, (l) => l.pl_group === "advertising");
  const opexAdvertisingTotal = sumGroupImpact(lines, (l) => l.pl_group === "advertising");

  const opexProfessionalLines = groupLines(lines, (l) => l.pl_group === "professional");
  const opexProfessionalTotal = sumGroupImpact(lines, (l) => l.pl_group === "professional");

  const opexTravelLines = groupLines(lines, (l) => l.pl_group === "travel");
  const opexTravelTotal = sumGroupImpact(lines, (l) => l.pl_group === "travel");

  const opexOfficeLines = groupLines(lines, (l) => l.pl_group === "office");
  const opexOfficeTotal = sumGroupImpact(lines, (l) => l.pl_group === "office");

  const opexOtherLines = groupLines(lines, (l) => l.pl_group === "other_direct");
  const opexOtherTotal = sumGroupImpact(lines, (l) => l.pl_group === "other_direct");

  const opexCostAllocLines = groupLines(lines, (l) => l.pl_group === "cost_alloc");
  const opexCostAllocTotal = sumGroupImpact(lines, (l) => l.pl_group === "cost_alloc");

  // OpEx Total (negatif değer)
  const opexTotal = sumGroupImpact(lines, (l) => l.pl_section === "opex");

  // EBITDA = Gross Profit + OpEx (OpEx zaten negatif)
  const ebitda = grossProfit + opexTotal;

  // Below EBITDA (karışık - interest expense negatif, income pozitif olabilir)
  const belowInterestLines = groupLines(lines, (l) => l.pl_group === "below_interest");
  const belowInterestTotal = sumGroupImpact(lines, (l) => l.pl_group === "below_interest");

  const belowFinanceLines = groupLines(lines, (l) => l.pl_group === "below_finance");
  const belowFinanceTotal = sumGroupImpact(lines, (l) => l.pl_group === "below_finance");

  const belowEbitdaTotal = sumGroupImpact(lines, (l) => l.pl_section === "below_ebitda");

  // Extraordinary (genelde pozitif gelir veya negatif gider)
  const extraordinaryLines = groupLines(lines, (l) => l.pl_section === "extraordinary");
  const extraordinaryTotal = sumGroupImpact(lines, (l) => l.pl_section === "extraordinary");

  // Depreciation (negatif)
  const depreciationLines = groupLines(lines, (l) => l.pl_section === "depreciation");
  const depreciationTotal = sumGroupImpact(lines, (l) => l.pl_section === "depreciation");

  // PBT (Profit Before Tax) = EBITDA + below_ebitda + extraordinary + depreciation
  const pbt = ebitda + belowEbitdaTotal + extraordinaryTotal + depreciationTotal;

  return {
    metadata: {
      entity,
      fiscal_year: fiscalYear,
      fiscal_period: fiscalPeriod,
      period_date: periodDate,
      currency: "EUR",
    },
    revenue: {
      total: revenueTotal,
      lines: revenueLines,
    },
    cogs: {
      total: cogsTotal,
      warehouse: { total: cogsWhTotal, lines: cogsWhLines },
      operation_labor: { total: cogsLaborTotal, lines: cogsLaborLines },
      last_mile: { total: cogsLmTotal, lines: cogsLmLines },
      direct: { total: cogsDirectTotal, lines: cogsDirectLines },
    },
    gross_profit: grossProfit,
    gross_margin: formatPercent(grossProfit, revenueTotal),
    opex: {
      total: opexTotal,
      employment: { total: opexEmploymentTotal, lines: opexEmploymentLines },
      technology: { total: opexTechnologyTotal, lines: opexTechnologyLines },
      advertising: { total: opexAdvertisingTotal, lines: opexAdvertisingLines },
      professional: { total: opexProfessionalTotal, lines: opexProfessionalLines },
      travel: { total: opexTravelTotal, lines: opexTravelLines },
      office: { total: opexOfficeTotal, lines: opexOfficeLines },
      other_direct: { total: opexOtherTotal, lines: opexOtherLines },
      cost_alloc: { total: opexCostAllocTotal, lines: opexCostAllocLines },
    },
    ebitda,
    ebitda_margin: formatPercent(ebitda, revenueTotal),
    below_ebitda: {
      total: belowEbitdaTotal,
      interest: { total: belowInterestTotal, lines: belowInterestLines },
      finance: { total: belowFinanceTotal, lines: belowFinanceLines },
    },
    extraordinary: {
      total: extraordinaryTotal,
      lines: extraordinaryLines,
    },
    depreciation: {
      total: depreciationTotal,
      lines: depreciationLines,
    },
    pbt,
    pbt_margin: formatPercent(pbt, revenueTotal),
  };
}

const app = new Hono<{ Bindings: Env }>()

  // =====================================================
  // TEK ENTITY P&L RAPORU
  // =====================================================
  .get("/entity/:entity", async (c) => {
    try {
      const db = createDatabricksClient(c.env);
      const entity = c.req.param("entity").toUpperCase();
      const year = c.req.query("year");
      const period = c.req.query("period");

      let whereClause = `WHERE entity = '${entity}'`;
      if (year) whereClause += ` AND fiscal_year = ${year}`;
      if (period) whereClause += ` AND fiscal_period = ${period}`;

      const lines = await db.executeSQL<PLLineItem>(
        `SELECT entity, fiscal_year, fiscal_period, period_date, pl_section, pl_group, line_order, line_name, pl_impact, amount FROM ${FULL_TABLE} ${whereClause} ORDER BY line_order`
      );

      if (lines.length === 0) {
        return c.json({ error: `${entity} için veri bulunamadı` }, 404);
      }

      const report = buildPLReport(
        lines,
        entity,
        lines[0].fiscal_year,
        lines[0].fiscal_period,
        lines[0].period_date
      );

      return c.json(report);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Bilinmeyen hata";
      return c.json({ error: message }, 500);
    }
  })

  // =====================================================
  // KONSOLİDE P&L RAPORU
  // =====================================================
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
      const lines = await db.executeSQL<PLLineItem>(`
        SELECT 
          'CONSOLIDATED' as entity,
          fiscal_year,
          fiscal_period,
          MAX(period_date) as period_date,
          pl_section,
          pl_group,
          line_order,
          line_name,
          SUM(pl_impact) as pl_impact,
          SUM(amount) as amount
        FROM ${FULL_TABLE}
        ${whereClause}
        GROUP BY fiscal_year, fiscal_period, pl_section, pl_group, line_order, line_name
        ORDER BY line_order
      `);

      if (lines.length === 0) {
        return c.json({ error: "Veri bulunamadı" }, 404);
      }

      const report = buildPLReport(
        lines,
        "CONSOLIDATED",
        lines[0].fiscal_year,
        lines[0].fiscal_period,
        lines[0].period_date
      );

      return c.json(report);
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

      const reports: PLReport[] = [];

      for (const { entity } of entities) {
        const entityWhere = whereClause
          ? `${whereClause} AND entity = '${entity}'`
          : `WHERE entity = '${entity}'`;

        const lines = await db.executeSQL<PLLineItem>(
          `SELECT entity, fiscal_year, fiscal_period, period_date, pl_section, pl_group, line_order, line_name, pl_impact, amount FROM ${FULL_TABLE} ${entityWhere} ORDER BY line_order`
        );

        if (lines.length > 0) {
          reports.push(
            buildPLReport(
              lines,
              entity,
              lines[0].fiscal_year,
              lines[0].fiscal_period,
              lines[0].period_date
            )
          );
        }
      }

      // Konsolide rapor da ekle
      const consolidatedLines = await db.executeSQL<PLLineItem>(`
        SELECT 
          'CONSOLIDATED' as entity,
          fiscal_year,
          fiscal_period,
          MAX(period_date) as period_date,
          pl_section,
          pl_group,
          line_order,
          line_name,
          SUM(pl_impact) as pl_impact,
          SUM(amount) as amount
        FROM ${FULL_TABLE}
        ${whereClause}
        GROUP BY fiscal_year, fiscal_period, pl_section, pl_group, line_order, line_name
        ORDER BY line_order
      `);

      if (consolidatedLines.length > 0) {
        reports.push(
          buildPLReport(
            consolidatedLines,
            "CONSOLIDATED",
            consolidatedLines[0].fiscal_year,
            consolidatedLines[0].fiscal_period,
            consolidatedLines[0].period_date
          )
        );
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

  // =====================================================
  // ÖZET KARŞILAŞTIRMA TABLOSU
  // =====================================================
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

      // Entity bazlı section toplamları (pl_impact kullan)
      const data = await db.executeSQL<{
        entity: string;
        pl_section: string;
        total: number;
      }>(`
        SELECT 
          entity,
          pl_section,
          SUM(pl_impact) as total
        FROM ${FULL_TABLE}
        ${whereClause}
        GROUP BY entity, pl_section
        ORDER BY entity
      `);

      // Entity bazlı özet oluştur
      const entityMap: Record<string, Record<string, number>> = {};
      data.forEach((row) => {
        if (!entityMap[row.entity]) entityMap[row.entity] = {};
        entityMap[row.entity][row.pl_section] = row.total;
      });

      // Özet tablo formatında döndür
      const summaryTable = Object.entries(entityMap).map(([entity, sections]) => {
        const revenue = sections.revenue || 0;
        const cogs = sections.cogs || 0; // Zaten negatif
        const opex = sections.opex || 0; // Zaten negatif
        const depreciation = sections.depreciation || 0; // Zaten negatif
        const belowEbitda = sections.below_ebitda || 0;
        const extraordinary = sections.extraordinary || 0;

        const grossProfit = revenue + cogs;
        const ebitda = grossProfit + opex;
        const pbt = ebitda + belowEbitda + extraordinary + depreciation;

        return {
          entity,
          revenue,
          cogs,
          gross_profit: grossProfit,
          gpm: revenue ? ((grossProfit / revenue) * 100).toFixed(0) + "%" : "0%",
          opex,
          ebitda,
          ebitda_margin: revenue ? ((ebitda / revenue) * 100).toFixed(0) + "%" : "0%",
          depreciation,
          below_ebitda: belowEbitda,
          extraordinary,
          pbt,
          pbt_margin: revenue ? ((pbt / revenue) * 100).toFixed(0) + "%" : "0%",
        };
      });

      // Konsolide satır ekle
      const totals = summaryTable.reduce(
        (acc, row) => {
          acc.revenue += row.revenue;
          acc.cogs += row.cogs;
          acc.gross_profit += row.gross_profit;
          acc.opex += row.opex;
          acc.ebitda += row.ebitda;
          acc.depreciation += row.depreciation;
          acc.below_ebitda += row.below_ebitda;
          acc.extraordinary += row.extraordinary;
          acc.pbt += row.pbt;
          return acc;
        },
        {
          revenue: 0,
          cogs: 0,
          gross_profit: 0,
          opex: 0,
          ebitda: 0,
          depreciation: 0,
          below_ebitda: 0,
          extraordinary: 0,
          pbt: 0,
        }
      );

      const consolidatedRow = {
        entity: "CONSOLIDATED",
        ...totals,
        gpm: totals.revenue ? ((totals.gross_profit / totals.revenue) * 100).toFixed(0) + "%" : "0%",
        ebitda_margin: totals.revenue ? ((totals.ebitda / totals.revenue) * 100).toFixed(0) + "%" : "0%",
        pbt_margin: totals.revenue ? ((totals.pbt / totals.revenue) * 100).toFixed(0) + "%" : "0%",
      };

      return c.json({
        filters: { year, period },
        entities: summaryTable,
        consolidated: consolidatedRow,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Bilinmeyen hata";
      return c.json({ error: message }, 500);
    }
  });

export default app;
