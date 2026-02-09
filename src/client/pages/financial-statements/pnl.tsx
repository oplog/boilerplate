// Gelir Tablosu (P&L — Profit & Loss) — OPLOG Format
// Real API: /api/pnl-report/all-entities + /api/pnl/periods

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiQuery } from "@/hooks/use-api";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════

type PLLine = { name: string; amount: number };
type PLGroup = { total: number; lines: PLLine[] };

type PLReport = {
  metadata: { entity: string; fiscal_year: number; fiscal_period: number; period_date: string; currency: string };
  revenue: PLGroup;
  cogs: {
    total: number;
    warehouse: PLGroup;
    operation_labor: PLGroup;
    last_mile: PLGroup;
    direct: PLGroup;
  };
  gross_profit: number;
  gross_margin: string;
  opex: {
    total: number;
    employment: PLGroup;
    technology: PLGroup;
    advertising: PLGroup;
    professional: PLGroup;
    travel: PLGroup;
    office: PLGroup;
    other_direct: PLGroup;
    cost_alloc: PLGroup;
  };
  ebitda: number;
  ebitda_margin: string;
  below_ebitda: { total: number; interest: PLGroup; finance: PLGroup };
  extraordinary: PLGroup;
  depreciation: PLGroup;
  pbt: number;
  pbt_margin: string;
};

type AllEntitiesResponse = { filters: { year: string; period: string }; reports: PLReport[] };
type PeriodsResponse = { periods: { fiscal_year: number; fiscal_period: number; period_date: string; entity_count: number; row_count: number }[] };

// ═══════════════════════════════════════════════
// Row definitions (static P&L structure)
// ═══════════════════════════════════════════════

type RowLevel = "total" | "subtotal" | "detail" | "pct" | "sep";
type ViewMode = "collapsed" | "half" | "expanded";

const VISIBLE_LEVELS: Record<ViewMode, Set<RowLevel>> = {
  collapsed: new Set(["total", "pct", "sep"]),
  half: new Set(["total", "subtotal", "pct", "sep"]),
  expanded: new Set(["total", "subtotal", "detail", "pct", "sep"]),
};

interface RowDef {
  id: string;
  kalem: string;
  level: RowLevel;
  /** Path to extract value from PLReport. Dot-separated. */
  path?: string;
  /** For pct rows, the field name (e.g. "gross_margin") */
  pctField?: string;
}

const ROW_DEFS: RowDef[] = [
  // REVENUE
  { id: "rev", kalem: "Revenue, Net", level: "total", path: "revenue.total" },
  ...dynamicLines("revenue"),

  // COST OF SALES
  { id: "cos", kalem: "Cost of Sales", level: "total", path: "cogs.total" },
  { id: "cos_wh", kalem: "Warehouse", level: "subtotal", path: "cogs.warehouse.total" },
  ...dynamicLines("cogs.warehouse"),
  { id: "cos_labor", kalem: "Operation Labor Cost", level: "subtotal", path: "cogs.operation_labor.total" },
  ...dynamicLines("cogs.operation_labor"),
  { id: "cos_lm", kalem: "Last Mile", level: "subtotal", path: "cogs.last_mile.total" },
  ...dynamicLines("cogs.last_mile"),
  { id: "cos_direct", kalem: "Direct", level: "subtotal", path: "cogs.direct.total" },
  ...dynamicLines("cogs.direct"),

  // GROSS PROFIT
  { id: "sep1", kalem: "", level: "sep" },
  { id: "gp", kalem: "Gross Profit", level: "total", path: "gross_profit" },
  { id: "gpm", kalem: "GPM %", level: "pct", pctField: "gross_margin" },
  { id: "sep2", kalem: "", level: "sep" },

  // OPEX
  { id: "opex_emp", kalem: "Employment Expenses", level: "subtotal", path: "opex.employment.total" },
  ...dynamicLines("opex.employment"),
  { id: "opex_tech", kalem: "Technology Expenses", level: "subtotal", path: "opex.technology.total" },
  ...dynamicLines("opex.technology"),
  { id: "opex_adv", kalem: "Advertising and Marketing", level: "subtotal", path: "opex.advertising.total" },
  ...dynamicLines("opex.advertising"),
  { id: "opex_prof", kalem: "3rd Party Professional Services", level: "subtotal", path: "opex.professional.total" },
  ...dynamicLines("opex.professional"),
  { id: "opex_travel", kalem: "Travel, Entertainment", level: "subtotal", path: "opex.travel.total" },
  ...dynamicLines("opex.travel"),
  { id: "opex_office", kalem: "Office Expenses", level: "subtotal", path: "opex.office.total" },
  ...dynamicLines("opex.office"),
  { id: "opex_other", kalem: "Other Direct Expenses", level: "subtotal", path: "opex.other_direct.total" },
  ...dynamicLines("opex.other_direct"),
  { id: "opex_alloc", kalem: "Cost Allocation", level: "subtotal", path: "opex.cost_alloc.total" },
  ...dynamicLines("opex.cost_alloc"),

  // EBITDA
  { id: "sep3", kalem: "", level: "sep" },
  { id: "ebitda", kalem: "EBITDA", level: "total", path: "ebitda" },
  { id: "ebitda_pct", kalem: "EBITDA %", level: "pct", pctField: "ebitda_margin" },
  { id: "sep4", kalem: "", level: "sep" },

  // BELOW EBITDA
  { id: "below_int", kalem: "Interest Income / Expenses", level: "subtotal", path: "below_ebitda.interest.total" },
  ...dynamicLines("below_ebitda.interest"),
  { id: "below_fin", kalem: "Finance Expenses", level: "subtotal", path: "below_ebitda.finance.total" },
  ...dynamicLines("below_ebitda.finance"),
  { id: "extra", kalem: "Extraordinary Income / Expenses", level: "subtotal", path: "extraordinary.total" },
  ...dynamicLines("extraordinary"),
  { id: "depr", kalem: "Depreciation and Amortisation", level: "subtotal", path: "depreciation.total" },
  ...dynamicLines("depreciation"),

  // PBT
  { id: "sep5", kalem: "", level: "sep" },
  { id: "pbt", kalem: "PBT", level: "total", path: "pbt" },
  { id: "pbt_pct", kalem: "PBT %", level: "pct", pctField: "pbt_margin" },
];

/** Placeholder for dynamic detail lines — will be populated from API data */
function dynamicLines(_groupPath: string): RowDef[] {
  // Dynamic lines are injected at render time from report.lines
  // This returns a marker so we know where to inject
  return [{ id: `dyn_${_groupPath}`, kalem: "", level: "detail", path: `${_groupPath}.lines` }];
}

// ═══════════════════════════════════════════════
// Extract value from PLReport by dot-path
// ═══════════════════════════════════════════════

function getByPath(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce((cur: unknown, key) => {
    if (cur && typeof cur === "object" && key in (cur as Record<string, unknown>)) {
      return (cur as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

// ═══════════════════════════════════════════════
// Build flat rows from reports
// ═══════════════════════════════════════════════

interface FlatRow {
  id: string;
  kalem: string;
  level: RowLevel;
  values: Map<string, number | string | null>; // entity → value
}

function buildFlatRows(reports: PLReport[]): FlatRow[] {
  const rows: FlatRow[] = [];

  for (const def of ROW_DEFS) {
    // Separator
    if (def.level === "sep") {
      rows.push({ id: def.id, kalem: "", level: "sep", values: new Map() });
      continue;
    }

    // Pct row
    if (def.level === "pct" && def.pctField) {
      const values = new Map<string, number | string | null>();
      for (const r of reports) {
        const v = getByPath(r as unknown as Record<string, unknown>, def.pctField) as string | undefined;
        values.set(r.metadata.entity, v ?? null);
      }
      rows.push({ id: def.id, kalem: def.kalem, level: "pct", values });
      continue;
    }

    // Dynamic detail lines (injected from report data)
    if (def.path?.endsWith(".lines")) {
      const groupPath = def.path.replace(".lines", "");
      // Collect all unique line names across reports
      const lineNamesSet = new Set<string>();
      for (const r of reports) {
        const group = getByPath(r as unknown as Record<string, unknown>, groupPath) as PLGroup | undefined;
        if (group?.lines) {
          for (const l of group.lines) lineNamesSet.add(l.name);
        }
      }
      for (const lineName of lineNamesSet) {
        const values = new Map<string, number | string | null>();
        for (const r of reports) {
          const group = getByPath(r as unknown as Record<string, unknown>, groupPath) as PLGroup | undefined;
          const found = group?.lines?.find((l) => l.name === lineName);
          values.set(r.metadata.entity, found?.amount ?? 0);
        }
        rows.push({ id: `${def.id}_${lineName}`, kalem: lineName, level: "detail", values });
      }
      continue;
    }

    // Normal total/subtotal row with a path
    if (def.path) {
      const values = new Map<string, number | string | null>();
      for (const r of reports) {
        const v = getByPath(r as unknown as Record<string, unknown>, def.path!) as number | undefined;
        values.set(r.metadata.entity, v ?? 0);
      }
      rows.push({ id: def.id, kalem: def.kalem, level: def.level, values });
    }
  }

  return rows;
}

// ═══════════════════════════════════════════════
// Number formatting
// ═══════════════════════════════════════════════

function formatNum(val: number | string | null | undefined): string {
  if (val === null || val === undefined || val === "") return "--";
  const n = typeof val === "string" ? parseFloat(val) : val;
  if (isNaN(n)) return "--";
  if (n === 0) return "--";
  const abs = Math.abs(n);
  const formatted = abs.toLocaleString("de-DE", { maximumFractionDigits: 0 });
  return n < 0 ? `(${formatted})` : formatted;
}

function formatPct(val: number | string | null | undefined): string {
  if (val === null || val === undefined || val === "") return "--";
  if (typeof val === "string") return val; // Already formatted like "48%"
  return `${Math.round(val)}%`;
}

// ═══════════════════════════════════════════════
// View mode picker (animated segmented control)
// ═══════════════════════════════════════════════

const VIEW_MODES: { value: ViewMode; label: string; tooltip: string; lines: number }[] = [
  { value: "collapsed", label: "Özet", tooltip: "Sadece ana kalemler", lines: 1 },
  { value: "half", label: "Orta", tooltip: "Ana + alt kalemler", lines: 2 },
  { value: "expanded", label: "Detay", tooltip: "Tüm satırlar", lines: 3 },
];

function DepthIcon({ lines, active }: { lines: number; active: boolean }) {
  const widths = [16, 12, 8];
  return (
    <div className="flex flex-col gap-[3px] items-start">
      {widths.map((w, i) => (
        <div
          key={i}
          className={cn(
            "h-[2px] rounded-full transition-all duration-300",
            i < lines ? (active ? "bg-foreground" : "bg-muted-foreground/60") : "bg-muted-foreground/15",
          )}
          style={{ width: w }}
        />
      ))}
    </div>
  );
}

function ViewModePicker({ value, onChange }: { value: ViewMode; onChange: (v: ViewMode) => void }) {
  const activeIdx = VIEW_MODES.findIndex((m) => m.value === value);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [pillStyle, setPillStyle] = React.useState<React.CSSProperties>({});

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const buttons = container.querySelectorAll<HTMLButtonElement>("[data-segment]");
    const active = buttons[activeIdx];
    if (!active) return;
    setPillStyle({ width: active.offsetWidth, transform: `translateX(${active.offsetLeft - 4}px)` });
  }, [activeIdx]);

  return (
    <TooltipProvider delayDuration={300}>
      <div
        ref={containerRef}
        className="relative flex items-center gap-0.5 rounded-xl bg-muted/60 p-1 backdrop-blur-sm border border-border/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]"
      >
        <div
          className="absolute top-1 h-[calc(100%-8px)] rounded-lg bg-background shadow-sm ring-1 ring-border/50 transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
          style={pillStyle}
        />
        {VIEW_MODES.map((mode) => {
          const isActive = mode.value === value;
          return (
            <Tooltip key={mode.value}>
              <TooltipTrigger asChild>
                <button
                  data-segment
                  onClick={() => onChange(mode.value)}
                  className={cn(
                    "relative z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 cursor-pointer select-none",
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground/70",
                  )}
                >
                  <DepthIcon lines={mode.lines} active={isActive} />
                  <span>{mode.label}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">{mode.tooltip}</TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}

// ═══════════════════════════════════════════════
// Cell selection (Excel-like)
// ═══════════════════════════════════════════════

interface CellPos { row: number; col: number }
interface CellRange { start: CellPos; end: CellPos }

function normRange(r: CellRange) {
  return {
    r1: Math.min(r.start.row, r.end.row), c1: Math.min(r.start.col, r.end.col),
    r2: Math.max(r.start.row, r.end.row), c2: Math.max(r.start.col, r.end.col),
  };
}

function inSelection(sel: CellRange | null, row: number, col: number): boolean {
  if (!sel) return false;
  const { r1, c1, r2, c2 } = normRange(sel);
  return row >= r1 && row <= r2 && col >= c1 && col <= c2;
}

function selEdge(sel: CellRange | null, row: number, col: number): string {
  if (!sel) return "";
  const { r1, c1, r2, c2 } = normRange(sel);
  if (row < r1 || row > r2 || col < c1 || col > c2) return "";
  const c: string[] = [];
  if (row === r1) c.push("border-t-2 border-t-primary");
  if (row === r2) c.push("border-b-2 border-b-primary");
  if (col === c1) c.push("border-l-2 border-l-primary");
  if (col === c2) c.push("border-r-2 border-r-primary");
  return c.join(" ");
}

// ═══════════════════════════════════════════════
// P&L Table
// ═══════════════════════════════════════════════

function PnlTable({ reports, viewMode }: { reports: PLReport[]; viewMode: ViewMode }) {
  const visibleLevels = VISIBLE_LEVELS[viewMode];
  const flatRows = React.useMemo(() => buildFlatRows(reports), [reports]);
  const entities = React.useMemo(() => reports.map((r) => r.metadata.entity), [reports]);

  // Visible rows (excluding sep for selection mapping)
  const visibleDataRows = React.useMemo(
    () => flatRows.filter((r) => visibleLevels.has(r.level) && r.level !== "sep"),
    [flatRows, visibleLevels],
  );

  // Cell selection
  const [sel, setSel] = React.useState<CellRange | null>(null);
  const draggingRef = React.useRef(false);

  const onCellMouseDown = React.useCallback((row: number, col: number, e: React.MouseEvent) => {
    e.preventDefault();
    draggingRef.current = true;
    setSel({ start: { row, col }, end: { row, col } });
  }, []);

  const onCellMouseEnter = React.useCallback((row: number, col: number) => {
    if (!draggingRef.current) return;
    setSel((prev) => prev ? { start: prev.start, end: { row, col } } : null);
  }, []);

  React.useEffect(() => {
    const up = () => { draggingRef.current = false; };
    window.addEventListener("mouseup", up);
    return () => window.removeEventListener("mouseup", up);
  }, []);

  // Ctrl+C copy
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!sel) return;
      if (!(e.metaKey || e.ctrlKey) || e.key !== "c") return;
      e.preventDefault();
      const { r1, c1, r2, c2 } = normRange(sel);
      const lines: string[] = [];
      for (let r = r1; r <= r2; r++) {
        const row = visibleDataRows[r]!;
        const isPct = row.level === "pct";
        const fmt = isPct ? formatPct : formatNum;
        const cells: string[] = [];
        for (let c = c1; c <= c2; c++) {
          if (c === 0) cells.push(row.kalem);
          else cells.push(String(fmt(row.values.get(entities[c - 1]!))));
        }
        lines.push(cells.join("\t"));
      }
      navigator.clipboard.writeText(lines.join("\n"));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [sel, visibleDataRows, entities]);

  // Clear selection on outside click
  const tableRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (tableRef.current && !tableRef.current.contains(e.target as Node)) setSel(null);
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, []);

  const totalCols = entities.length + 1;
  let visRowIdx = -1;

  return (
    <div ref={tableRef} className="rounded-lg border bg-card overflow-auto select-none">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-primary text-primary-foreground">
            <th className="sticky left-0 z-10 bg-primary px-4 py-2 text-right font-semibold min-w-[300px]">P&L (EUR)</th>
            {entities.map((e) => (
              <th key={e} className="px-4 py-2 text-right font-semibold whitespace-nowrap min-w-[130px]">
                {e === "CONSOLIDATED" ? "Konsolide" : e}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {flatRows.map((row) => {
            if (!visibleLevels.has(row.level)) return null;

            if (row.level === "sep") {
              return (
                <tr key={row.id} className="h-px">
                  <td colSpan={totalCols} className="border-b-2 border-border" />
                </tr>
              );
            }

            // Skip empty detail lines (kalem === "")
            if (row.level === "detail" && !row.kalem) return null;

            visRowIdx++;
            const vri = visRowIdx;
            const isTotal = row.level === "total";
            const isSubtotal = row.level === "subtotal";
            const isDetail = row.level === "detail";
            const isPct = row.level === "pct";
            const fmt = isPct ? formatPct : formatNum;
            const indent = isTotal ? "pl-3" : isSubtotal ? "pl-6" : "pl-10";

            return (
              <tr
                key={row.id}
                className={cn(
                  isTotal && "bg-muted/70 border-b border-border",
                  isSubtotal && "bg-muted/25 border-b border-border/50",
                  isDetail && "border-b border-border/20",
                  isPct && "border-b border-border/20",
                )}
              >
                <td
                  onMouseDown={(e) => onCellMouseDown(vri, 0, e)}
                  onMouseEnter={() => onCellMouseEnter(vri, 0)}
                  className={cn(
                    "sticky left-0 z-10 pr-4 text-right whitespace-nowrap cursor-cell",
                    indent,
                    isTotal && "py-2.5 bg-muted/70 font-bold text-foreground text-sm",
                    isSubtotal && "py-1.5 bg-muted/25 font-semibold text-foreground text-[13px]",
                    isDetail && "py-1 bg-card text-muted-foreground text-xs",
                    isPct && "py-1 bg-card italic text-muted-foreground/70 text-xs",
                    inSelection(sel, vri, 0) && "!bg-primary/10",
                    selEdge(sel, vri, 0),
                  )}
                >
                  {row.kalem}
                </td>
                {entities.map((entity, ci) => {
                  const colIdx = ci + 1;
                  const v = row.values.get(entity);
                  return (
                    <td
                      key={entity}
                      onMouseDown={(e) => onCellMouseDown(vri, colIdx, e)}
                      onMouseEnter={() => onCellMouseEnter(vri, colIdx)}
                      className={cn(
                        "px-4 text-right whitespace-nowrap font-mono tabular-nums cursor-cell",
                        isTotal && "py-2.5 font-bold bg-muted/70 text-sm",
                        isSubtotal && "py-1.5 font-semibold text-xs",
                        isDetail && "py-1 text-xs text-muted-foreground",
                        isPct && "py-1 text-xs text-muted-foreground/70 italic",
                        entity === "CONSOLIDATED" && "border-l border-border",
                        inSelection(sel, vri, colIdx) && "!bg-primary/10",
                        selEdge(sel, vri, colIdx),
                      )}
                    >
                      {fmt(v)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ═══════════════════════════════════════════════
// Entity selector chips
// ═══════════════════════════════════════════════

const ENTITY_LABELS: Record<string, string> = {
  TR: "Türkiye",
  DE: "Almanya",
  UK: "İngiltere",
  US: "Amerika",
  CONSOLIDATED: "Konsolide",
};

// ═══════════════════════════════════════════════
// Page
// ═══════════════════════════════════════════════

const MONTH_NAMES = ["", "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

export function PnlPage() {
  const [viewMode, setViewMode] = React.useState<ViewMode>("half");
  const [year, setYear] = React.useState<string>("2025");
  const [period, setPeriod] = React.useState<string>("12");

  // Fetch available periods
  const { data: periodsData } = useApiQuery<PeriodsResponse>(["pnl-periods"], "/pnl/periods");

  // Fetch all entity reports
  const { data: reportsData, isLoading, error } = useApiQuery<AllEntitiesResponse>(
    ["pnl-all-entities", year, period],
    `/pnl-report/all-entities?year=${year}&period=${period}`,
  );

  // Available years from periods
  const availableYears = React.useMemo(() => {
    if (!periodsData?.periods) return [];
    const years = [...new Set(periodsData.periods.map((p) => p.fiscal_year))].sort((a, b) => b - a);
    return years;
  }, [periodsData]);

  // Available periods for selected year
  const availablePeriods = React.useMemo(() => {
    if (!periodsData?.periods) return [];
    return periodsData.periods
      .filter((p) => String(p.fiscal_year) === year)
      .map((p) => p.fiscal_period)
      .sort((a, b) => b - a);
  }, [periodsData, year]);

  // Reports ordered: individual entities first, then CONSOLIDATED last
  const orderedReports = React.useMemo(() => {
    if (!reportsData?.reports) return [];
    const individual = reportsData.reports.filter((r) => r.metadata.entity !== "CONSOLIDATED");
    const consolidated = reportsData.reports.find((r) => r.metadata.entity === "CONSOLIDATED");
    return [...individual, ...(consolidated ? [consolidated] : [])];
  }, [reportsData]);

  const periodLabel = period ? MONTH_NAMES[parseInt(period)] : "";

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight">Gelir Tablosu</h1>
            <span className="text-xl text-muted-foreground/30 font-light">|</span>
            <span className="text-sm font-medium text-muted-foreground">P&L</span>
            <Badge variant="outline" className="font-mono text-[10px] tracking-wider px-1.5 py-0">EUR</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {periodLabel} {year}
            {orderedReports.length > 0 && (
              <>
                <span className="mx-1.5 text-border">·</span>
                {orderedReports.filter((r) => r.metadata.entity !== "CONSOLIDATED").length} entity
              </>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Period selectors */}
          <div className="flex items-center gap-1.5">
            <Select value={year} onValueChange={(v) => { setYear(v); setPeriod("12"); }}>
              <SelectTrigger className="h-8 w-[80px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((y) => (
                  <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="h-8 w-[110px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availablePeriods.map((p) => (
                  <SelectItem key={p} value={String(p)}>{MONTH_NAMES[p]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="h-5 w-px bg-border" />
          <ViewModePicker value={viewMode} onChange={setViewMode} />
        </div>
      </div>

      {/* Entity badges */}
      {orderedReports.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {orderedReports.map((r) => (
            <Badge
              key={r.metadata.entity}
              variant={r.metadata.entity === "CONSOLIDATED" ? "default" : "secondary"}
              className="text-[10px]"
            >
              {ENTITY_LABELS[r.metadata.entity] || r.metadata.entity}
            </Badge>
          ))}
        </div>
      )}

      {/* Table */}
      {isLoading && (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          {Array.from({ length: 15 }, (_, i) => (
            <Skeleton key={i} className="h-7 w-full" />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          API Hatası: {error.message}
        </div>
      )}

      {!isLoading && !error && orderedReports.length > 0 && (
        <PnlTable reports={orderedReports} viewMode={viewMode} />
      )}

      {!isLoading && !error && orderedReports.length === 0 && (
        <div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">
          Seçilen dönem için veri bulunamadı.
        </div>
      )}
    </div>
  );
}
