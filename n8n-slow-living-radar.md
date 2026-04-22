# Slow living “radar” — n8n + e-posta ile ortamı tanıma

Bu belge, **önce piyasayı ve dilini tanımak** için haftalık / günlük bir tarama hattı kurmanızı ve çıktıyı **tek e-postada özet listelemeyi** hedefler. Repoda e-posta adresi ve gizli anahtar tutulmaz; bunlar yalnızca n8n içinde tanımlanır.

---

## 1. “Dünyadaki ve Türkiye’deki tüm haberler” — gerçekçi çerçeve

**Teknik olarak “tümü” mümkün değildir** (hiçbir ücretsiz API tüm basını ve blogları anlık kapsamaz). Pratikte üç katman birleşir:

| Katman | Ne sağlar | Not |
|--------|-----------|-----|
| **RSS** | Blog / dergi / Substack düzenli akışı | En stabil, n8n’de en az sürtünme |
| **Google Haberler RSS araması** | “slow living”, “sakin yaşam” vb. geniş haber yüzeyi | URL’yi tarayıcıda açıp XML geldiğini doğrulayın; bazen hız limiti / engel olabilir |
| **Google Uyarıları → RSS** | Sizin seçtiğiniz kelimelerle sürekli tarama | Uyarı oluştururken “RSS” teslimatı seçilir; size özel bir **feed URL’si** üretir — bunu n8n’e yapıştırırsınız |

İleride bütçe varsa: NewsAPI, SerpAPI, GDELT vb. ile genişletme ayrı karar.

---

## 2. AI slow living yazısı yazabilir mi?

**Evet, ama “ham gazeteci” gibi değil.** İyi sonuç için üç sabit girdi gerekir:

1. **`karakter-anayasasi.md`** (ton, yasak klişeler, Nehir/İpek/Grenfell sınırları) — kısaltılmış sistem mesajı olarak.
2. **Sizden 2–3 referans paragraf** (Nâgihan’a yakın örnek yazı).
3. **Brief**: konu, uzunluk, “bu yazıda olmasın” maddeleri.

Aksi halde model “farkındalık yolculuğu / bilinçli tüketici” diline kayar; anayasa bunu zaten yasaklıyor. **Tarama e-postası** ile önce ekosistemi görüp, sonra brief’i siz netleştirmek doğru sıra.

---

## 3. n8n iş akışı (önerilen iskelet)

**Amaç:** Birden çok kaynaktan öğeleri topla → mümkünse tekilleştir → tek HTML e-postada listele → **sizin adresinize** gönder.

1. **Schedule Trigger** — örn. Pazartesi+Perşembe 09:00 veya her gün 08:00 (siz seçin).
2. Birden fazla **RSS Read** düğümü (her kaynak bir düğüm) *veya* tek **RSS Read** + önceki adımda URL listesi (n8n sürümüne göre “Read RSS Feed from multiple URLs” benzeri pattern).
3. **Merge** — tüm öğeleri bir akışta birleştir.
4. **Code** (veya **Item Lists** + **Remove Duplicates**) — `link` / `guid` alanına göre **aynı URL tek kalsın**.
5. *(İsteğe bağlı)* **OpenAI / Anthropic** düğümü: Her başlığa tek cümle “Nâgihan’a uygunluk skoru” veya sadece “slow living ile ilgili mi?” filtrelemesi — maliyet ve gürültü için başta **kapalı** da kalabilir.
6. **HTML** birleştirme: Başlık + kaynak + tarih + link tablosu veya madde madde liste.
7. **Send Email** (SMTP) — Gmail uygulama şifresi, Outlook SMTP, ya da kendi sunucunuzdaki Postfix. Alıcı: sizin kutunuz.

**n8n’de saklanacaklar (Credentials):** SMTP kullanıcı/şifre; asla repoya yazılmaz.

---

## 4. Başlangıç için örnek RSS / arama URL’leri (doğrulayıp çoğaltın)

Aşağıdakiler **örnek başlangıç**tır; n8n’de “Execute node” ile 200 dönüyor mu kontrol edin. Kırık olanları silin, beğendiklerinizi ekleyin.

**Uluslararası / İngilizce (doğrudan RSS):**

- Zen Habits (FeedBurner): `https://feeds.feedburner.com/zenhabits`
- The Slow Living Collective (Substack): `https://theslowlivingcollective.substack.com/feed`

**Türkçe ve genel haber yüzeyi (Google Haberler RSS — tarayıcıda test):**

- İngilizce anahtar kelime (örnek):  
  `https://news.google.com/rss/search?q=slow+living&hl=en&gl=US&ceid=US:en`
- Türkçe (örnek, URL encode edilmiş):  
  `https://news.google.com/rss/search?q=sakin+ya%C5%9Fam+OR+yava%C5%9F+ya%C5%9Fam&hl=tr&gl=TR&ceid=TR:tr`

**Google Uyarıları:** Şu sorgular için ayrı uyarı + RSS çıktısı üretmek iyi başlangıçtır:  
`slow living`, `slow movement`, `sakin yaşam`, `Cittaslow Türkiye`, `yavaş şehir`, `minimalizm blog` (gürültü artabilir; daraltırsınız).

**Kurumsal / hareket siteleri:** Cittaslow International, Slow Food ağ sayfalarında zaman zaman `/feed` veya haber RSS’i olur; site yenilendikçe **elle doğrulayıp** n8n listesine ekleyin.

---

## 5. Sonraki adımlar (içerik stratejisiyle bağlantı)

1. **2–4 hafta** sadece bu e-postayı okuyun; kaynakları “kaliteli / gürültülü” diye işaretleyin.
2. Listeyi **Nâgihan’ın üç iddiası** (anayasa) ile eşleştirin: hangi dış yazılar “tanıklık” diline yakın, hangileri reklam dili.
3. Sonra ayrı bir n8n kolu veya manuel süreç: **seçilen 1 makale → özet + kendi yorumunuz + (isteğe) TR video metni**.

---

## 6. Bu belge ve proje geçmişi

Strateji ve “önce ortamı tanıyalım” kararı **`proje-gecmisi.md`** içinde Bölüm 13 sonrası akışla uyumludur; bu dosya **operasyonel rehber** olarak güncellenmeye devam edebilir.

---

*No Time to Hurry — iç operasyon notu*
