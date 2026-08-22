# Karikatür Rehberi — No Time to Hurry

Sitenin imza unsuru: her yazıda, en ağır fikri tatlıya bağlayan tek panel bir karikatür.
Bu belge, o karikatürlerin **stilini** ve **üretim reçetesini** sabitler ki her seferinde
aynı el, aynı doku çıksın.

## 1. Kilitlenen stil — "Gırgır ekolü"

- **Çizgi:** kaba/gritty, elle çizilmiş siyah mürekkep; yoğun çapraz tarama (cross-hatching).
- **Renk:** **sadece siyah mürekkep**; zemin **parlak, doygun kanarya sarısı** (Gırgır kapak
  sarısı). Başka renk yok, yüksek kontrast siyah-üstüne-sarı.
- **Ton:** grotesk-komik; ama **anlatıcı karakter** için "gently exaggerated, sevimli/güler
  yüzlü" — sert grotesk değil.
- **Format:** tek panel, ~3:2 (sahne) / kare (portre avatar).

## 2. Anlatıcı karakter (tekrar eden avatar)

Site birinci şahıs (Murat). Gırgır geleneğindeki köşe avatarı gibi, her yazıda belirebilen
tekrar eden bir karakter var: **Murat'ın sıcak/güler yüzlü karikatürü.**

- **Güncel avatar:** [`assets/karakter/avatar.jpg`](assets/karakter/avatar.jpg) — renkli
  nano banana illüstrasyonu (yeşil tişört, kendi odası); Murat'a benzeyen sıcak hâl.
  **Bundan sonra hep bu kullanılır.** (Eski Gırgır siyah-beyaz PuLID büstü emekliye ayrıldı.)
- Görsel üretimi artık Murat'ta (nano banana / Gemini); Claude görselleri siteye
  yerleştirir, web'e optimize eder ve düzeni kurar.

## 3. Üretim boru hattı (fal.ai)

Anahtar: repo kökünde `.env` içinde `FAL_Key` (git'e girmez).

- **Sahne karikatürleri (karaktersiz veya serbest):** `fal-ai/flux/dev`, sadece prompt.
  1200×800, guidance ~4, steps ~32.
- **Anlatıcıyı içeren karikatürler:** `fal-ai/flux-pulid` + referans fotoğraf
  (`reference_image_url`, base64 data URI). `id_weight ~0.9`, steps ~22, guidance ~4,
  `image_size: square_hd`. Avatar "A" seed **111** ile üretildi.
- **Uyarı:** PuLID renkli/temiz karikatüre kaçma eğiliminde. Prompt'ta "black and white ink
  only, on flat canary yellow background", negative'de "color, grotesque, angry" şart.

İstek gövdesi base64 foto içerdiğinden komut satırına sığmaz; gövde dosyaya parça parça
yazılır (prefix + `base64 -w0` + kapanış), sonra `curl -d @gövde`. Not: bu ortamda taze
kabukta ilk fal isteği ara sıra sessiz düşüyor → `--retry` kullan; yanıtı Windows `python`
mingw `/tmp` yolunu göremiyor → yanıtı `grep` ile oku ya da proje-içi yola yaz.

## 4. Pürüzler ve kararlar
- **Sahte imza karalaması KALIR.** Model sağ alta anlamsız bir "imza" koyabiliyor;
  bunu bilerek bırakıyoruz — elle çizilmiş dergi karikatürü havası veriyor. (Karar: Murat.)
- **Renk sızıntısı temizlenir.** Ara sıra mavi kask, pembe ağız gibi renkler kaçıyor;
  stil "sarı zemin + siyah mürekkep" olduğu için bu renkler gri'ye çevrilir (imza hariç).
- Sahne öğesi (ör. koşu bandı, kaplumbağa kabuğu) kayabiliyor → prompt'ta net tarif et,
  gerekirse yeniden üret; birden çok karakteri birleştirmek için PIL composite (sarıyı
  şeffaflaştırıp çizgiyi taşı) işe yarıyor.

## 5. İlke: sabit olan stil, değişen özne
Değişmeyen tek şey **stil** (siyah mürekkep + Gırgır sarısı). Karikatürün **öznesi** yazının
hikâyesine göre değişir: bazen Murat (anlatıcı avatar, PuLID ile), bazen dinozor, bazen
kaplumbağa, salyangoz, ne gerekiyorsa. Yavaşlıktan bahsederken bir salyangoz/kaplumbağa
esprisi tam yerine oturur. **Karikatürü hikâye belirler; karakter ona hizmet eder, tersi
değil.** Anlatıcı avatar sadece kutudaki araçlardan biridir — zorunluluk değil.
