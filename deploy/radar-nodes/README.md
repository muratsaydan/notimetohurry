# Slow Living Radar — n8n Code node kaynakları

Bu klasördeki dosyalar, n8n'deki **Slow Living Radar** workflow'unun (id `NpuUHH9TzEKZS2hu`)
Code node'larının birebir kaynağıdır. Canlıdaki kod bunlarla aynı olmalı.

| dosya | n8n node adı |
|---|---|
| `01-dedupe-by-link.js` | Dedupe by link |
| `02-prepare-llm-prompt.js` | Prepare LLM prompt |
| `03-apply-turkish-summaries.js` | Apply Turkish summaries |
| `04-build-html.js` | Build HTML |

## Hattın çalışma mantığı

```
Feed URLs → RSS Read → Dedupe by link → Prepare LLM prompt → Has articles?
   → Vertex özet (her öğe için AYRI çağrı) → Apply Turkish summaries → Build HTML → Gmail
```

**İki katman.** Yayıncının kendi RSS akışından gelen öğeler `content:encoded` içinde yazının
tam metnini taşır; bunlara ayrıntılı Türkçe aktarım üretilir. Google News üzerinden gelen
öğelerde gövde metni yoktur (akış yalnızca başlığı tekrar eder), bunlar e-postada ayrı bir
"yalnızca başlık" bölümünde listelenir.

**Google News linkleri çözülemez.** `CBMi…` biçimindeki adresler 2024'ten beri gerçek URL'yi
içermiyor; base64 çözümü de yönlendirme takibi de sonuç vermiyor (denendi). Bir yayıncının
yazısını tam metinle istiyorsak **kendi RSS akışını** eklemek gerekir. Real Simple (402/403)
ve Business Insider (yalnızca borsa tickerı) kullanılabilir akış vermiyor.

## 2 Eylül 2026'da düzeltilen üç hata

1. **Özetler hiç görünmüyordu.** Model tek büyük JSON döndürüyordu; çıktıyı ` ```json ` çitiyle
   sarıyor ve özet metninin içindeki çift tırnakları kaçırmıyordu → `JSON.parse` kırılıyor,
   20 satırın hepsine "Özet üretilemedi" yazılıyordu. **Çözüm:** JSON tamamen bırakıldı.
   Artık her öğe için ayrı çağrı yapılıyor ve çıktı `ETIKET: değer` biçiminde düz metin olarak
   ayrıştırılıyor.
2. **Gövde metni kırpılıyordu.** `Dedupe by link` gövde adayları arasında `j.content`'i önce
   deniyordu; Substack ve WordPress'te `content` kısa tanıtımdır, tam metin `content:encoded`
   içindedir. Üstüne 2800 karakterde kesiliyordu. **Çözüm:** en uzun aday seçiliyor, sınır
   40.000 karakter.
3. **Başlıklar İngilizceydi.** Artık her öğe için Türkçe başlık üretiliyor; orijinal başlık
   altında italik olarak duruyor.

## LLM çıktı sözleşmesi

`Prepare LLM prompt` şu etiketleri ister, `Apply Turkish summaries` bunları regex ile ayırır:

```
TR_BASLIK · TUR · KIMIN_ICIN · TEZ · AKTARIM · SAYILAR · SESSIZLIK · DEGER
```

Etiket adı değiştirilecekse **iki dosyada birden** değişmeli.

## Değişiklik nasıl uygulanır

`deploy/build-slow-living-radar-workflow.mjs` ile **tam PUT yapma** — `secrets.env` içinde
`GCP_VERTEX_PROJECT_ID` olmadığı için Vertex node'una yer tutucu yazar ve çalışan ayarı ezer.

Doğru yol: GET → ilgili node'un `jsCode` alanını değiştir → PUT.
PUT gövdesi `{ name, nodes, connections, settings }` olmalı ve `settings` **yalnızca**
`executionOrder` + `callerPolicy` içerebilir (diğer alanlar 400 döndürür, ama sunucuda korunur).
Kimlik bilgileri: `C:\Users\PC\MuratAgent\secrets.env`.
