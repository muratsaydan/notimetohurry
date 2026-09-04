# Facebook — Hiçbir Yere Yetişmeyenler Kulübü

Sayfa: https://www.facebook.com/profile.php?id=61594250543906

Bu klasör kulübün Facebook sayfasının içerik sistemi. Örnek alınan şey **sitenin kendisi**,
Instagram değil: kart yok, etiket yok; uzun metin, karikatür ve bağlantı var. Facebook'un
Instagram'dan farkı tam olarak bu ikisi: bağlantı tıklanır, uzun yazı okunur.

**Ben paylaşamıyorum — yükleme sende.** Metinler `metinler.md`'de yapıştırmaya hazır.

---

## 1. Önce sayfayı düzelt (5 Eylül 2026'daki hâline göre)

| Alan | Şu an | Olacak |
| --- | --- | --- |
| **Sayfa adı** | `Hiçbiryereyetişmeyenlerkulübü` ❗ | `Hiçbir Yere Yetişmeyenler Kulübü` — boşluklu; Facebook araması kelimeleri ayrı ayrı tarar, bitişik ad hiçbir aramada çıkmaz |
| **Kullanıcı adı** | yok (profile.php?id=…) | `hicbiryereyetismeyenlerkulubu` — Instagram ile aynı; adres `facebook.com/hicbiryereyetismeyenlerkulubu` olur |
| **Kategori** | Tarih ve Felsefe | `Kişisel Blog` (birincil) + `Felsefe` (ikincil). Facebook üç kategoriye izin veriyor |
| **Telefon** | `0531 835 65 67` herkese açık ❗ | **Kaldır.** Bir blog sayfasında kişisel cep numarası, arayan herkese açık demek |
| **Çalışma saatleri** | "Sürekli Açık" | Kaldır; dükkân değil |
| **E-posta** | murat@saydan.net | Kalsın |
| **Web sitesi** | notimetohurry.com | Kalsın |
| **Kapak fotoğrafı** | yok | `cikti/kapak-fotografi.jpg` (1640×624, koala) |
| **Profil fotoğrafı** | koala (kırpık) | Kalsın; site de aynı yüzle açılıyor |
| **Eylem düğmesi** | yok | "Daha fazla bilgi" → `https://notimetohurry.com/tr/index.html` |
| **Açıklama** | mevcut metin iyi | Sonuna bir satır: `Kulübün şu anki tek üyesi benim. Yer var.` |

---

## 2. Yayın ritmi

**Haftada üç**, üçü de ayrı türden. Aynı gün Instagram'a bir şey gidiyorsa Facebook'a
farklı bir şey gitsin; iki hesabı aynı gün aynı içerikle doldurmak ikisini de zayıflatır.

| Gün | Tür | Ne |
| --- | --- | --- |
| Pazartesi | **Yazı** | Sitedeki bir yazı ya da bölüm: karikatür + giriş paragrafı + bağlantı |
| Çarşamba | **Karikatür** | Tek görsel, sitedeki alt yazısıyla. Kısa. |
| Cuma | **Radar** | Dışarıda çıkan bir yazı: özet + bizim notumuz + kaynak bağlantısı |

Radar yazısı yoksa cuma boş kalır. Acele yok.

**Bağlantı nereye?** Metnin sonuna, düz. Facebook bağlantılı gönderiyi biraz geri itiyor ama
"bağlantıyı yoruma koy" numarası artık işe yaramıyor ve okuru yoruyor. Fotoğraf gönderisi
olarak paylaş, bağlantı metnin son satırında dursun.

**Etiket yok.** Facebook'ta etiket erişim getirmiyor, sadece gürültü.

---

## 3. İlk parti (5 hafta, 14 gönderi)

Metinler `metinler.md`'de. Yazı gönderilerinin metni sitedeki yazıdan otomatik çıkarılıyor:

```
python araclar/facebook_gonderi.py
```

Çıktılar `kaynaklar/facebook/<slug>-facebook.md` (git dışı). Bundan sonra her yeni yazıdan
sonra bu komut çalışır, dosya yeni yazının Facebook gönderisini üretir.

| # | Gün | Tür | Gönderi | Görsel |
| --- | --- | --- | --- | --- |
| 01 | Pzt | Yazı | Tanışma — bu kulüp ne? | koala.jpg |
| 02 | Çar | Karikatür | Kaplumbağa ve çita | kaplumbaga-cita.jpg |
| 03 | Cum | Radar | Portekiz'de sakin yaşamın bir yıllık faturası | — (bağlantı önizlemesi) |
| 04 | Pzt | Yazı | Sakin yaşam nedir, ne değildir? | salyangoz-tavsan.jpg |
| 05 | Çar | Karikatür | Koşu bandındaki dinozor | dinozor-kosu-bandi.jpg |
| 06 | Cum | Radar | Dört yıl sonra Yunanistan | — |
| 07 | Pzt | Yazı | Nefes Almayı Hatırlamak → `kaynaklar/facebook/nefes-almayi-hatirlamak-facebook.md` | dinozor-kosu-bandi.jpg |
| 08 | Çar | Karikatür | Doğanın deadline'ı yok | saksi-deadline.jpg |
| 09 | Cum | Radar | Hallmark kasabasına taşınan yazar | — |
| 10 | Pzt | Yazı | İlk Durak: Stoacılar → `kaynaklar/facebook/stoacilar-facebook.md` | stoaci-adana-gunes.jpg |
| 11 | Çar | Karikatür | Epikuros'un ziyafeti | epikuros-ziyafet.jpg |
| 12 | Pzt | Yazı | Her Şey Bir Tabak Makarnayla Başladı → `kaynaklar/facebook/sakin-yasamin-dogusu-facebook.md` | salyangoz-tavsan.jpg |
| 13 | Pzt | Yazı | Adı Çalınan Adam → `kaynaklar/facebook/epikuros-facebook.md` | epikuros-kapida.jpg |
| 14 | Pzt | Yazı | Kırk Yıldır Gitmediğim Yer → `kaynaklar/facebook/mcdonaldlasma-facebook.md` | adana-kebap-vs-burger.jpg |

Karikatürler tek tek gönderi olarak gittiği için (02, 05, 08, 11) aynı görsel daha sonra
yazı gönderisinde tekrar görünür; sorun değil, arada iki hafta var ve Facebook akışı
tekrarı Instagram ızgarası gibi yan yana göstermiyor.

---

## 4. Editoryal sınırlar (site ile aynı)

- Stok fotoğraf yok. Görsel dil = karikatürler.
- Temenni cümlesi, emir kipi, guru pozu yok. "Kendine iyi bak" yazan gönderi silinir.
- Sorular gerçek soru olsun: Facebook'ta yorum bir sohbettir, tuzak değil.
- Radar gönderisinde bizim notumuz ayrı paragrafta ve "Bizim notumuz:" diye başlar;
  özetle yorum karışmaz. Sitedeki kural burada da geçerli.
- Facebook kitlesi sitenin kendi yaşıtı: 45 üstü, okur, yorum yazar, paylaşır. Kısaltma yok,
  ironi az, cümleler tam.
