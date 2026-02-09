// Route aggregator - Tüm API route'larını dışa aktarır
// Yeni route dosyası oluşturduğunda buraya eklemeyi unutma

export { default as health } from "./health";
export { default as examples } from "./examples";
// Financial APIs
export { default as pnl } from "./fox/pnl";
export { default as pnlReport } from "./fox/pnl-report";
export { default as bs } from "./fox/bs";
