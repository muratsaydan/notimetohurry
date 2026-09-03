# Slow Living Radar — n8n Code node kaynakları

Bu klasördeki dosyalar, n8n'deki **Slow Living Radar** workflow'unun (id `NpuUHH9TzEKZS2hu`)
Code node'larının birebir kaynağıdır. Canlıdaki kod bunlarla aynı olmalı.

| dosya | n8n node adı |
|---|---|
| `00-feed-urls.js` | Feed URLs |
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

## Kaynak katmanları (3 Eyl 2026)

Bir kaynağın ne kadar ayrıntı üretebileceğini akışının ne taşıdığı belirler.

| katman | ne gelir | kaynaklar |
|---|---|---|
| **Tam metin** (`content:encoded`) | ayrıntılı Türkçe aktarım | Raptitude, Tiny Buddha, Slow Living Collective, On Better Living |
| **Tanıtım** (~500-700 karakter) | kısa özet, link gerçek adres | Medium `/tag/slow-living`, No Sidebar |
| **Gövdesiz** | yalnızca Türkçe başlık | Google News (genel + Real Simple + Business Insider `site:` sorguları) |

Ölçüm (3 Eyl 2026): Raptitude 8.929 kr, Tiny Buddha 14.051 kr, Slow Living Collective 20.013 kr
`content:encoded`. Medium 668 kr yalnızca `description`. Slow Living Collective o tarihte 32
gündür sessizdi — 7 günlük pencereye girmiyordu; radarın zayıf görünmesinin sebebi buydu.

**Denenip elenenler:** Zen Habits (404), Slow Food (item yok), The Art of Simple (1869 gün),
Becoming Minimalist (420 gün), Slow Living LDN (251 gün, gövdesiz), Cal Newport / Break the
Twitch / The Minimalists / The Simplicity Habit (bağlantı kurulamadı).

**LinkedIn, Facebook, Instagram eklenemiyor:** üçünün de herkese açık RSS'i yok ve API'leri
üçüncü taraf içerik keşfine kapalı. Yalnızca ücretli köprülerle (rss.app, RSSHub) mümkün;
kırılgan ve platform şartlarıyla sorunlu.

## 3 Eylül 2026'da düzeltilen iki hata

4. **`Dedupe by link` gövdeyi eziyordu.** Altı ayrı gövde alanı arasından "en uzun olanı"
   seçip sonucu yine `content:encoded` adıyla geri yazıyordu. Google News öğelerinde en uzun
   aday yazının metni değil `<a href=...CBMi...>` bağlantı bloğudur; gerçek içerik onun altında
   kalıyordu. Ayrıca altı alan tek alana çökertildiği için `02`'deki `bodyOf()` gerçek adayları
   hiç göremiyordu. **Çözüm:** `01` artık gövdeye hiç karışmıyor, bütün alanları olduğu gibi
   geçiriyor; seçimi `02` yapıyor.
5. **`stripHtml` sırası tersti.** Önce etiket siliyor, sonra entity çözüyordu. Google News'in
   `description`'ı kaçışlı HTML taşır (`&lt;a href=...&gt;`); etiket silme adımı hiçbir şey
   bulamıyor, sonraki decode adımı kaçışlı etiketleri görünür metne çeviriyordu. **Çözüm:**
   önce `decodeEntities`, sonra `stripTags`, çift kaçışa karşı iki tur. Ayrıca `&amp;` zincirin
   başına alındı (yoksa `&amp;nbsp;` → `nbsp;` diye metinde kalıyordu).

`02`'deki seçim artık tercih sırasına göre: `content:encoded` → `content` → `summary` →
`description` → snippet'ler. 600 karakteri geçen ilk aday kazanır; bağlantı bloğu görünümündeki
adaylar (`looksLikeLinkBlob`) elenir. Seçilen alan `govdeAlani` olarak çıktıya yazılır.

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
