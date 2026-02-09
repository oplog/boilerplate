# FOX — Financial Operational eXcellence

Bu branch (**feature/fox**) FOX ürünü geliştirmesi için ayrılmıştır. Boilerplate (NEXUS/OPLOG App Builder) burada FOX uygulamasına dönüştürülür.

## Strateji

- **Tam metin:** `docs/fox-strategic-initiative.md`
- **Özet:** Bookkeeping → konsolidasyon → mutabakat → raporlama tüm finansal yaşam döngüsü AI-native platforma taşınıyor. Service Manufacturing Platform (PEGASUS, FABRIKA, MATRIX) içinde FOX kurumsal finansal zeka katmanıdır.

## Üç Scope

| Scope | Odak | Sıra |
|-------|------|------|
| **Scope 1** | Consolidation & Reporting Foundation — GL çekimi, CoA mapping, konsolide tablolar, metrik/dashboard | 1 (temel) |
| **Scope 2** | In-Country Operations — bookkeeping, close, mutabakat, FABRIKA faturalama | 2 |
| **Scope 3** | AI-Powered Proactive Intelligence — anomali, varyans, tahmin, board raporları | 3 |

## Proje Yapısı (FOX tarafı)

- **Sidebar:** FOX Özet, Scope 1 / 2 / 3 sayfaları + Örnekler (boilerplate referans)
- **Sayfalar:** `src/client/pages/fox/` — overview, scope1, scope2, scope3
- **Route’lar:** `/fox`, `/fox/scope1`, `/fox/scope2`, `/fox/scope3`

## Geliştirme İpuçları

1. **Scope sırası:** Önce Scope 1 (veri temeli), sonra 2 (süreçler), en son 3 (AI).
2. **API/Backend:** Yeni endpoint’ler için `src/worker/routes/` ve `worker/index.ts` kullan (CLAUDE.md kuralları aynı).
3. **Veri modeli:** Unified GL, CoA mapping, entity tanımları strateji dokümanında; NEXUS veri mimarisi ile uyumlu tut.
4. **FABRIKA:** Scope 2’de faturalama FABRIKA operasyonel verisi ile entegre edilecek; API sözleşmeleri buna göre planla.

## Branch

- **feature/fox** — FOX geliştirme (bu branch)
- **main** — genel boilerplate

Merge stratejisi: FOX stabil oldukça `feature/fox` → `main` birleştirilebilir veya FOX ayrı ürün olarak deploy edilebilir.
