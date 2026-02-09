// Bilanço (Balance Sheet) — OPLOG Format
// Real API: /api/bs/all-entities + /api/bs/periods

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

type BSLine = { name: string; amount: number };
type BSGroup = { total: number; lines: BSLine[] };

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

type AllEntitiesResponse = { filters: { year: string; period: string }; reports: BSReport[] };
type PeriodsResponse = { periods: { fiscal_year: number; fiscal_period: number; period_date: string; entity_count: number; row_count: number }[] };

// ═══════════════════════════════════════════════
// Group label mappings
// ═══════════════════════════════════════════════

const GROUP_LABELS: Record<string, string> = {
  cash: "Cash & Cash Equivalents",
  receivables: "Accounts Receivable",
  inventory: "Inventory",
  intercompany: "Intercompany",
  other_receivables: "Other Receivables",
  prepaid: "Prepaid Expenses",
  other_current: "Other Current Assets",
  tangible: "Tangible Assets, Net",
  lt_prepaid: "LT Prepaid Expenses",
  st_loans: "Short Term Loans",
  trade_payables: "Trade Payables",
  other_liabilities: "Other Liabilities",
};

function groupLabel(key: string): string {
  return GROUP_LABELS[key] || key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// ═══════════════════════════════════════════════
// Row definitions — dynamic from API
// ═══════════════════════════════════════════════

type RowLevel = "total" | "subtotal" | "detail" | "section" | "sep";
type ViewMode = "collapsed" | "half" | "expanded";

const VISIBLE_LEVELS: Record<ViewMode, Set<RowLevel>> = {
  collapsed: new Set(["total", "section", "sep"]),
  half: new Set(["total", "subtotal", "section", "sep"]),
  expanded: new Set(["total", "subtotal", "detail", "section", "sep"]),
};

interface FlatRow {
  id: string;
  kalem: string;
  level: RowLevel;
  values: Map<string, number | null>; // entity → value
}

/** Collect all unique group keys across reports for a given section path */
function collectGroupKeys(reports: BSReport[], getSection: (r: BSReport) => { groups: Record<string, BSGroup> }): string[] {
  const keys = new Set<string>();
  for (const r of reports) {
    const section = getSection(r);
    for (const k of Object.keys(section.groups)) keys.add(k);
  }
  return [...keys];
}

/** Collect all unique line names across reports for a given group in a section */
function collectLineNames(
  reports: BSReport[],
  getSection: (r: BSReport) => { groups: Record<string, BSGroup> },
  groupKey: string,
): string[] {
  const names = new Set<string>();
  for (const r of reports) {
    const group = getSection(r).groups[groupKey];
    if (group?.lines) {
      for (const l of group.lines) names.add(l.name);
    }
  }
  return [...names];
}

function buildBSRows(reports: BSReport[]): FlatRow[] {
  const rows: FlatRow[] = [];
  const entities = reports.map((r) => r.metadata.entity);

  function valueMap(getter: (r: BSReport) => number | null): Map<string, number | null> {
    const m = new Map<string, number | null>();
    for (const r of reports) m.set(r.metadata.entity, getter(r));
    return m;
  }

  function lineValueMap(
    getSection: (r: BSReport) => { groups: Record<string, BSGroup> },
    groupKey: string,
    lineName: string,
  ): Map<string, number | null> {
    const m = new Map<string, number | null>();
    for (const r of reports) {
      const group = getSection(r).groups[groupKey];
      const found = group?.lines?.find((l) => l.name === lineName);
      m.set(r.metadata.entity, found?.amount ?? 0);
    }
    return m;
  }

  function addGroupRows(
    sectionId: string,
    getSection: (r: BSReport) => { groups: Record<string, BSGroup> },
  ) {
    const groupKeys = collectGroupKeys(reports, getSection);
    for (const gk of groupKeys) {
      // Group subtotal
      rows.push({
        id: `${sectionId}_${gk}`,
        kalem: groupLabel(gk),
        level: "subtotal",
        values: valueMap((r) => getSection(r).groups[gk]?.total ?? 0),
      });
      // Detail lines
      const lineNames = collectLineNames(reports, getSection, gk);
      for (const ln of lineNames) {
        rows.push({
          id: `${sectionId}_${gk}_${ln}`,
          kalem: ln,
          level: "detail",
          values: lineValueMap(getSection, gk, ln),
        });
      }
    }
  }

  // ── ASSETS ──
  rows.push({ id: "hdr_assets", kalem: "ASSETS", level: "section", values: new Map() });

  // Current Assets
  rows.push({
    id: "ca_total",
    kalem: "Current Assets",
    level: "total",
    values: valueMap((r) => r.assets.current.total),
  });
  addGroupRows("ca", (r) => r.assets.current);

  // Non-Current Assets
  rows.push({
    id: "nca_total",
    kalem: "Non-Current Assets",
    level: "total",
    values: valueMap((r) => r.assets.non_current.total),
  });
  addGroupRows("nca", (r) => r.assets.non_current);

  // TOTAL ASSETS
  rows.push({ id: "sep1", kalem: "", level: "sep", values: new Map() });
  rows.push({
    id: "total_assets",
    kalem: "TOTAL ASSETS",
    level: "section",
    values: valueMap((r) => r.assets.total),
  });
  rows.push({ id: "sep2", kalem: "", level: "sep", values: new Map() });

  // ── LIABILITIES ──
  rows.push({ id: "hdr_liab", kalem: "LIABILITIES & EQUITY", level: "section", values: new Map() });

  // Current Liabilities
  rows.push({
    id: "cl_total",
    kalem: "Current Liabilities",
    level: "total",
    values: valueMap((r) => r.liabilities.current.total),
  });
  addGroupRows("cl", (r) => r.liabilities.current);

  // Non-Current Liabilities
  const hasNonCurrentLiab = reports.some((r) => Object.keys(r.liabilities.non_current.groups).length > 0);
  if (hasNonCurrentLiab) {
    rows.push({
      id: "ncl_total",
      kalem: "Non-Current Liabilities",
      level: "total",
      values: valueMap((r) => r.liabilities.non_current.total),
    });
    addGroupRows("ncl", (r) => r.liabilities.non_current);
  }

  // TOTAL LIABILITIES
  rows.push({ id: "sep3", kalem: "", level: "sep", values: new Map() });
  rows.push({
    id: "total_liab",
    kalem: "TOTAL LIABILITIES",
    level: "total",
    values: valueMap((r) => r.liabilities.total),
  });

  // Equity
  const hasEquity = reports.some((r) => r.equity.total !== 0 || Object.keys(r.equity.groups).length > 0);
  if (hasEquity) {
    rows.push({ id: "sep4", kalem: "", level: "sep", values: new Map() });
    rows.push({
      id: "equity_total",
      kalem: "Equity",
      level: "total",
      values: valueMap((r) => r.equity.total),
    });
    addGroupRows("eq", (r) => r.equity);
  }

  // TOTAL LIABILITIES & EQUITY
  rows.push({ id: "sep5", kalem: "", level: "sep", values: new Map() });
  rows.push({
    id: "total_liab_equity",
    kalem: "TOTAL LIABILITIES & EQUITY",
    level: "section",
    values: valueMap((r) => r.balance_check.total_liabilities_and_equity),
  });

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

// ═══════════════════════════════════════════════
// View mode picker (animated segmented control)
// ═══════════════════════════════════════════════

const VIEW_MODES: { value: ViewMode; label: string; tooltip: string; lines: number }[] = [
  { value: "collapsed", label: "Ozet", tooltip: "Sadece ana kalemler", lines: 1 },
  { value: "half", label: "Orta", tooltip: "Ana + alt kalemler", lines: 2 },
  { value: "expanded", label: "Detay", tooltip: "Tum satirlar", lines: 3 },
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
// BS Table
// ═══════════════════════════════════════════════

function BsTable({ reports, viewMode }: { reports: BSReport[]; viewMode: ViewMode }) {
  const visibleLevels = VISIBLE_LEVELS[viewMode];
  const flatRows = React.useMemo(() => buildBSRows(reports), [reports]);
  const entities = React.useMemo(() => reports.map((r) => r.metadata.entity), [reports]);

  // Visible rows (excluding sep and empty section headers for selection mapping)
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
        const cells: string[] = [];
        for (let c = c1; c <= c2; c++) {
          if (c === 0) cells.push(row.kalem);
          else cells.push(String(formatNum(row.values.get(entities[c - 1]!))));
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
            <th className="sticky left-0 z-10 bg-primary px-4 py-2 text-right font-semibold min-w-[300px]">Balance Sheet (EUR)</th>
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

            // Skip empty detail lines
            if (row.level === "detail" && !row.kalem) return null;

            visRowIdx++;
            const vri = visRowIdx;
            const isSection = row.level === "section";
            const isTotal = row.level === "total";
            const isSubtotal = row.level === "subtotal";
            const isDetail = row.level === "detail";
            const hasValues = row.values.size > 0;
            const indent = isSection ? "pl-2" : isTotal ? "pl-3" : isSubtotal ? "pl-6" : "pl-10";

            return (
              <tr
                key={row.id}
                className={cn(
                  isSection && "bg-muted/80 border-b border-border",
                  isTotal && "bg-muted/40 border-b border-border/70",
                  isSubtotal && "bg-muted/15 border-b border-border/40",
                  isDetail && "border-b border-border/20",
                )}
              >
                <td
                  onMouseDown={(e) => onCellMouseDown(vri, 0, e)}
                  onMouseEnter={() => onCellMouseEnter(vri, 0)}
                  className={cn(
                    "sticky left-0 z-10 pr-4 text-right whitespace-nowrap cursor-cell",
                    indent,
                    isSection && "py-2.5 bg-muted/80 font-bold text-foreground text-sm tracking-wide",
                    isTotal && "py-2 bg-muted/40 font-bold text-foreground text-[13px]",
                    isSubtotal && "py-1.5 bg-muted/15 font-semibold text-foreground text-[13px]",
                    isDetail && "py-1 bg-card text-muted-foreground text-xs",
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
                        isSection && "py-2.5 font-bold text-sm",
                        isTotal && "py-2 font-bold text-[13px]",
                        isSubtotal && "py-1.5 font-semibold text-xs",
                        isDetail && "py-1 text-xs text-muted-foreground",
                        entity === "CONSOLIDATED" && "border-l border-border",
                        inSelection(sel, vri, colIdx) && "!bg-primary/10",
                        selEdge(sel, vri, colIdx),
                      )}
                    >
                      {hasValues ? formatNum(v) : ""}
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
// Entity labels
// ═══════════════════════════════════════════════

const ENTITY_LABELS: Record<string, string> = {
  TR: "Turkiye",
  DE: "Almanya",
  UK: "Ingiltere",
  US: "Amerika",
  CONSOLIDATED: "Konsolide",
};

// ═══════════════════════════════════════════════
// Page
// ═══════════════════════════════════════════════

const MONTH_NAMES = ["", "Ocak", "Subat", "Mart", "Nisan", "Mayis", "Haziran", "Temmuz", "Agustos", "Eylul", "Ekim", "Kasim", "Aralik"];

export function BilancoPage() {
  const [viewMode, setViewMode] = React.useState<ViewMode>("half");
  const [year, setYear] = React.useState<string>("2025");
  const [period, setPeriod] = React.useState<string>("12");

  // Fetch available periods
  const { data: periodsData } = useApiQuery<PeriodsResponse>(["bs-periods"], "/bs/periods");

  // Fetch all entity reports
  const { data: reportsData, isLoading, error } = useApiQuery<AllEntitiesResponse>(
    ["bs-all-entities", year, period],
    `/bs/all-entities?year=${year}&period=${period}`,
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
            <h1 className="text-xl font-bold tracking-tight">Bilanco</h1>
            <span className="text-xl text-muted-foreground/30 font-light">|</span>
            <span className="text-sm font-medium text-muted-foreground">Balance Sheet</span>
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
          API Hatasi: {error.message}
        </div>
      )}

      {!isLoading && !error && orderedReports.length > 0 && (
        <BsTable reports={orderedReports} viewMode={viewMode} />
      )}

      {!isLoading && !error && orderedReports.length === 0 && (
        <div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">
          Secilen donem icin veri bulunamadi.
        </div>
      )}
    </div>
  );
}
