# FOX Frontend Entegrasyon Dökümanı

## Genel Bakış

FOX (Financial Operational eXcellence) uygulaması için backend API'leri hazır. Bu API'ler Databricks üzerindeki `lakehouse.default.mart_finance_pl` tablosundan P&L (Profit & Loss) verilerini çekiyor.

**Base URL:** `/api`

**Entity'ler:** TR (Türkiye), DE (Almanya), UK (İngiltere), US (Amerika)

---

## API Endpoint'leri

### 1. Meta Veri Endpoint'leri

#### Entity Listesi
```
GET /api/pnl/entities
```
Response:
```json
{
  "entities": [
    { "entity": "DE", "row_count": 6, "total_revenue": 7945.99, "total_amount": 123456 },
    { "entity": "TR", "row_count": 45, "total_revenue": 59273453.12, "total_amount": 123456 }
  ]
}
```

#### Dönem Listesi
```
GET /api/pnl/periods
```
Response:
```json
{
  "periods": [
    { "fiscal_year": 2025, "fiscal_period": 12, "period_date": "2025-12-01", "entity_count": 4, "row_count": 66 }
  ]
}
```

#### P&L Yapısı
```
GET /api/pnl/structure
```
Response:
```json
{
  "structure": {
    "revenue": { "groups": ["revenue"], "line_count": 4 },
    "cogs": { "groups": ["cogs_wh", "cogs_direct", "cogs_labor", "cogs_lm"], "line_count": 12 },
    "opex": { "groups": ["employment", "technology", "advertising", "..."], "line_count": 25 }
  }
}
```

---

### 2. Ham Veri Endpoint'leri

#### Filtrelenmiş P&L Verisi
```
GET /api/pnl?entity=TR&year=2025&period=12&section=revenue
```
Tüm parametreler opsiyonel. Response:
```json
{
  "filters": { "entity": "TR", "year": "2025", "period": "12", "section": null },
  "row_count": 45,
  "data": [
    {
      "entity": "TR",
      "fiscal_year": 2025,
      "fiscal_period": 12,
      "period_date": "2025-12-01",
      "pl_section": "revenue",
      "pl_group": "revenue",
      "line_order": 10,
      "line_name": "Operation Revenue",
      "amount": 40056369.24
    }
  ]
}
```

---

### 3. Yapılandırılmış P&L Rapor Endpoint'leri

#### Tek Entity P&L Raporu
```
GET /api/pnl-report/entity/TR?year=2025&period=12
```
Response:
```json
{
  "metadata": {
    "entity": "TR",
    "fiscal_year": 2025,
    "fiscal_period": 12,
    "period_date": "2025-12-01",
    "currency": "EUR"
  },
  "revenue": {
    "total": 59273453.12,
    "lines": [
      { "name": "Operation Revenue", "amount": 40056369.24 },
      { "name": "Supplies & Entrepot Revenue", "amount": 2553624.15 },
      { "name": "Storage Revenue", "amount": 10340844.71 },
      { "name": "Last Mile Revenue", "amount": 6322615.02 }
    ]
  },
  "cogs": {
    "total": -30994779.44,
    "warehouse": {
      "total": -13607776.37,
      "lines": [
        { "name": "Warehouse - Rent", "amount": 7423723.86 },
        { "name": "Warehouse - Utilities", "amount": 2128641.90 }
      ]
    },
    "operation_labor": {
      "total": -11698863.30,
      "lines": [{ "name": "Warehouse Associates", "amount": 11698863.30 }]
    },
    "last_mile": {
      "total": -3653140.46,
      "lines": [{ "name": "Delivery Cost", "amount": 3653140.46 }]
    },
    "direct": {
      "total": -2034999.31,
      "lines": []
    }
  },
  "gross_profit": 28278673.68,
  "gross_margin": "48%",
  "opex": {
    "total": -30785456.32,
    "employment": { "total": 17031393.24, "lines": [] },
    "technology": { "total": 1771661.91, "lines": [] },
    "advertising": { "total": 2389793.70, "lines": [] },
    "professional": { "total": 1121892.76, "lines": [] },
    "travel": { "total": 3198568.64, "lines": [] },
    "office": { "total": 4938213.33, "lines": [] },
    "other_direct": { "total": -319637.41, "lines": [] },
    "cost_alloc": { "total": 653570.15, "lines": [] }
  },
  "ebitda": -2506782.64,
  "ebitda_margin": "-4%",
  "below_ebitda": {
    "total": 16225082.07,
    "interest": { "total": 16602855.08, "lines": [] },
    "finance": { "total": -377773.01, "lines": [] }
  },
  "extraordinary": {
    "total": 22616922.28,
    "lines": [{ "name": "Extraordinary Income/Expenses", "amount": 22616922.28 }]
  },
  "depreciation": {
    "total": 0,
    "lines": []
  },
  "pbt": 36335221.71,
  "pbt_margin": "61%"
}
```

#### Konsolide P&L Raporu (Tüm Entity'ler Toplamı)
```
GET /api/pnl-report/consolidated?year=2025&period=12
```
Aynı response yapısı, `entity: "CONSOLIDATED"`

#### Tüm Entity'lerin P&L Raporları
```
GET /api/pnl-report/all-entities?year=2025&period=12
```
Response:
```json
{
  "filters": { "year": "2025", "period": "12" },
  "reports": [
    { "metadata": { "entity": "DE" }, "...": "..." },
    { "metadata": { "entity": "TR" }, "...": "..." },
    { "metadata": { "entity": "UK" }, "...": "..." },
    { "metadata": { "entity": "US" }, "...": "..." },
    { "metadata": { "entity": "CONSOLIDATED" }, "...": "..." }
  ]
}
```

#### Özet Karşılaştırma Tablosu
```
GET /api/pnl-report/summary-table?year=2025&period=12
```
Response:
```json
{
  "filters": { "year": "2025", "period": "12" },
  "entities": [
    {
      "entity": "DE",
      "revenue": 7945.99,
      "cogs": -39139.05,
      "gross_profit": -31193.06,
      "gpm": "-393%",
      "opex": -18010.95,
      "ebitda": -49204.01,
      "ebitda_margin": "-619%",
      "depreciation": -181.17,
      "below_ebitda": 0,
      "extraordinary": 0,
      "pbt": -49385.18,
      "pbt_margin": "-621%"
    },
    { "entity": "TR", "...": "..." },
    { "entity": "UK", "...": "..." },
    { "entity": "US", "...": "..." }
  ],
  "consolidated": {
    "entity": "CONSOLIDATED",
    "revenue": 59301417.13,
    "cogs": -31110826.35,
    "gross_profit": 28190590.78,
    "gpm": "48%",
    "opex": -30806412.86,
    "ebitda": -2615822.08,
    "ebitda_margin": "-4%"
  }
}
```

---

## P&L Görsel Yapısı (UI için)

```
┌─────────────────────────────────────────────────────────┐
│ P&L (EUR)                          │ TR    │ DE   │ ... │
├─────────────────────────────────────────────────────────┤
│ Revenue, Net                       │ 59.2M │ 7.9K │     │
│   Operation Revenue                │ 40.0M │      │     │
│   Supplies & Entrepot Revenue      │ 2.5M  │      │     │
│   Storage Revenue                  │ 10.3M │      │     │
│   Last Mile Revenue                │ 6.3M  │      │     │
├─────────────────────────────────────────────────────────┤
│ Cost of Sales                      │(31.0M)│(39K) │     │
│   Warehouse                        │(13.6M)│      │     │
│     Warehouse - Rent               │ 7.4M  │      │     │
│     Warehouse - Utilities          │ 2.1M  │      │     │
│     ...                            │       │      │     │
│   Operation Labor Cost             │(11.7M)│      │     │
│   Last Mile                        │(3.6M) │      │     │
│   Direct                           │(2.0M) │      │     │
├─────────────────────────────────────────────────────────┤
│ Gross Profit                       │ 28.3M │(31K) │     │
│ GPM %                              │ 48%   │-393% │     │
├─────────────────────────────────────────────────────────┤
│ Employment Expenses                │(17.0M)│      │     │
│ Technology Expenses                │(1.8M) │      │     │
│ Advertising and Marketing          │(2.4M) │      │     │
│ 3rd Party Professional Services    │(1.1M) │      │     │
│ Travel, Entertainment              │(3.2M) │      │     │
│ Office Expenses                    │(4.9M) │      │     │
│ Other Direct Expenses              │ 0.3M  │      │     │
├─────────────────────────────────────────────────────────┤
│ EBITDA                             │(2.5M) │(49K) │     │
│ EBITDA %                           │ -4%   │-619% │     │
├─────────────────────────────────────────────────────────┤
│ Interest Income/Expenses           │ 16.2M │      │     │
│ Extraordinary Income/Expenses      │ 22.6M │      │     │
│ Depreciation                       │   0   │(181) │     │
├─────────────────────────────────────────────────────────┤
│ PBT                                │ 36.3M │(49K) │     │
│ PBT %                              │ 61%   │-621% │     │
└─────────────────────────────────────────────────────────┘
```

---

## Frontend Hooks Kullanımı

```tsx
import { useApiQuery } from "@/hooks/use-api";

// Entity listesi
const { data: entities } = useApiQuery<{ entities: Entity[] }>(
  ["pnl-entities"],
  "/pnl/entities"
);

// Tek entity P&L raporu
const { data: trReport } = useApiQuery<PLReport>(
  ["pnl-report", "TR", year, period],
  `/pnl-report/entity/TR?year=${year}&period=${period}`
);

// Konsolide rapor
const { data: consolidated } = useApiQuery<PLReport>(
  ["pnl-consolidated", year, period],
  `/pnl-report/consolidated?year=${year}&period=${period}`
);

// Özet tablo
const { data: summary } = useApiQuery<SummaryTable>(
  ["pnl-summary", year, period],
  `/pnl-report/summary-table?year=${year}&period=${period}`
);
```

---

## TypeScript Tipleri

```tsx
// P&L Satır
type PLLine = {
  name: string;
  amount: number;
};

// P&L Grup
type PLGroup = {
  total: number;
  lines: PLLine[];
};

// P&L Raporu
type PLReport = {
  metadata: {
    entity: string;
    fiscal_year: number;
    fiscal_period: number;
    period_date: string;
    currency: string;
  };
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
  below_ebitda: {
    total: number;
    interest: PLGroup;
    finance: PLGroup;
  };
  extraordinary: PLGroup;
  depreciation: PLGroup;
  pbt: number;
  pbt_margin: string;
};

// Özet Tablo Satırı
type SummaryRow = {
  entity: string;
  revenue: number;
  cogs: number;
  gross_profit: number;
  gpm: string;
  opex: number;
  ebitda: number;
  ebitda_margin: string;
  depreciation: number;
  below_ebitda: number;
  extraordinary: number;
  pbt: number;
  pbt_margin: string;
};
```

---

## Önerilen Sayfalar

1. **FOX Overview** (`/fox`) - Dashboard, özet metrikler
2. **P&L Raporu** (`/fox/pnl`) - Detaylı P&L tablosu, entity seçimi, dönem filtresi
3. **Entity Karşılaştırma** (`/fox/compare`) - Yan yana entity karşılaştırması
4. **Konsolidasyon** (`/fox/consolidated`) - Konsolide finansal görünüm

---

## Notlar

- Tüm tutarlar EUR cinsindendir
- Negatif değerler gider/maliyet'i temsil eder (parantez içinde göster)
- `gross_margin`, `ebitda_margin`, `pbt_margin` string olarak "48%" formatında gelir
- Mevcut veri: 2025 Aralık (fiscal_year=2025, fiscal_period=12)

---

# Balance Sheet (BS) API'leri

## BS Endpoint'leri

### Meta Veri
```
GET /api/bs/entities       # Entity listesi
GET /api/bs/periods        # Dönem listesi
GET /api/bs/structure      # BS yapısı (sections/groups)
```

### Veri Sorgulama
```
GET /api/bs?entity=TR&year=2025&period=12
```

### Raporlama
```
GET /api/bs/report/TR?year=2025&period=12     # Tek entity BS
GET /api/bs/consolidated?year=2025&period=12  # Konsolide BS
GET /api/bs/summary-table?year=2025&period=12 # Özet karşılaştırma
```

---

## BS Rapor Response Yapısı

```json
{
  "metadata": {
    "entity": "TR",
    "fiscal_year": 2025,
    "fiscal_period": 12,
    "period_date": "2025-12-01",
    "currency": "EUR"
  },
  "assets": {
    "current": {
      "total": -30018649.44,
      "groups": {
        "cash": {
          "total": -19231162.16,
          "lines": [{ "name": "Cash", "amount": 12359256.89 }, ...]
        },
        "receivables": { "total": -17610176.63, "lines": [...] },
        "inventory": { "total": 934409.09, "lines": [...] },
        "intercompany": { "total": 8767753.07, "lines": [...] },
        "other_receivables": { "total": -2151396.04, "lines": [...] },
        "prepaid": { "total": -1404110.32, "lines": [...] },
        "other_current": { "total": 676033.55, "lines": [...] }
      }
    },
    "non_current": {
      "total": 1448058.51,
      "groups": {
        "tangible": { "total": 932476.82, "lines": [...] },
        "lt_prepaid": { "total": 515581.69, "lines": [...] }
      }
    },
    "total": -28570590.93
  },
  "liabilities": {
    "current": {
      "total": 10245629.64,
      "groups": {
        "st_loans": { "total": 10515347.59, "lines": [...] },
        "trade_payables": { "total": 32138227.39, "lines": [...] },
        "other_liabilities": { "total": -32407945.34, "lines": [...] }
      }
    },
    "non_current": { "total": 0, "groups": {} },
    "total": 10245629.64
  },
  "equity": {
    "total": 0,
    "groups": {}
  },
  "balance_check": {
    "total_assets": -28570590.93,
    "total_liabilities_and_equity": 10245629.64,
    "is_balanced": false
  }
}
```

---

## BS Özet Tablo Response

```json
{
  "filters": { "year": "2025", "period": "12" },
  "entities": [
    {
      "entity": "DE",
      "current_assets": -28313.99,
      "non_current_assets": -181.17,
      "total_assets": -28495.16,
      "current_liabilities": 62236.34,
      "non_current_liabilities": 0,
      "total_liabilities": 62236.34,
      "equity": 0,
      "working_capital": -90550.33,
      "current_ratio": "-0.45"
    },
    { "entity": "TR", "..." },
    { "entity": "UK", "..." },
    { "entity": "US", "..." }
  ],
  "consolidated": {
    "entity": "CONSOLIDATED",
    "current_assets": -28044822.54,
    "non_current_assets": 1447440.03,
    "total_assets": -26597382.51,
    "current_liabilities": 10247913.16,
    "total_liabilities": 10247913.16,
    "working_capital": -38292735.70,
    "current_ratio": "-2.74"
  }
}
```

---

## BS TypeScript Tipleri

```tsx
type BSGroup = {
  total: number;
  lines: { name: string; amount: number }[];
};

type BSReport = {
  metadata: {
    entity: string;
    fiscal_year: number;
    fiscal_period: number;
    period_date: string;
    currency: string;
  };
  assets: {
    current: {
      total: number;
      groups: Record<string, BSGroup>;
    };
    non_current: {
      total: number;
      groups: Record<string, BSGroup>;
    };
    total: number;
  };
  liabilities: {
    current: {
      total: number;
      groups: Record<string, BSGroup>;
    };
    non_current: {
      total: number;
      groups: Record<string, BSGroup>;
    };
    total: number;
  };
  equity: {
    total: number;
    groups: Record<string, BSGroup>;
  };
  balance_check: {
    total_assets: number;
    total_liabilities_and_equity: number;
    is_balanced: boolean;
  };
};

type BSSummaryRow = {
  entity: string;
  current_assets: number;
  non_current_assets: number;
  total_assets: number;
  current_liabilities: number;
  non_current_liabilities: number;
  total_liabilities: number;
  equity: number;
  working_capital: number;
  current_ratio: string;
};
```

---

## BS Görsel Yapısı (UI için)

```
┌─────────────────────────────────────────────────────────┐
│ Balance Sheet (EUR)                │ TR    │ DE   │ ... │
├─────────────────────────────────────────────────────────┤
│ ASSETS                             │       │      │     │
│ ──────────────────────────────────────────────────────  │
│ Current Assets                     │(30.0M)│(28K) │     │
│   Cash                             │(19.2M)│(26K) │     │
│   Accounts Receivable              │(17.6M)│      │     │
│   Inventory                        │ 934K  │      │     │
│   Intercompany                     │ 8.8M  │      │     │
│   Other Receivables                │(2.2M) │ 5.5K │     │
│   Prepaid Expenses                 │(1.4M) │      │     │
│   Other Current Assets             │ 676K  │      │     │
│ ──────────────────────────────────────────────────────  │
│ Non-Current Assets                 │ 1.4M  │(181) │     │
│   Tangible Assets, net             │ 932K  │(181) │     │
│   Prepaid Expenses (>1 year)       │ 516K  │      │     │
│ ──────────────────────────────────────────────────────  │
│ TOTAL ASSETS                       │(28.6M)│(28K) │     │
├─────────────────────────────────────────────────────────┤
│ LIABILITIES                        │       │      │     │
│ ──────────────────────────────────────────────────────  │
│ Current Liabilities                │ 10.2M │ 62K  │     │
│   ST Bank Loans                    │ 10.5M │      │     │
│   Trade Payables                   │ 32.1M │      │     │
│   Other Liabilities                │(32.4M)│ 62K  │     │
│ ──────────────────────────────────────────────────────  │
│ TOTAL LIABILITIES                  │ 10.2M │ 62K  │     │
├─────────────────────────────────────────────────────────┤
│ EQUITY                             │   0   │  0   │     │
├─────────────────────────────────────────────────────────┤
│ Working Capital                    │(40.3M)│(90K) │     │
│ Current Ratio                      │ -2.93 │-0.45 │     │
└─────────────────────────────────────────────────────────┘
```

---

## BS Frontend Hooks

```tsx
// BS raporu
const { data: bsReport } = useApiQuery<BSReport>(
  ["bs-report", entity, year, period],
  `/bs/report/${entity}?year=${year}&period=${period}`
);

// Konsolide BS
const { data: consolidatedBS } = useApiQuery<BSReport>(
  ["bs-consolidated", year, period],
  `/bs/consolidated?year=${year}&period=${period}`
);

// BS özet tablo
const { data: bsSummary } = useApiQuery<{ entities: BSSummaryRow[]; consolidated: BSSummaryRow }>(
  ["bs-summary", year, period],
  `/bs/summary-table?year=${year}&period=${period}`
);
```
