# Nâgihan Projesi

## Proje Özeti

Nâgihan, sakin yaşam felsefesini temsil eden sanal bir karakter. Rivea Beauty ile bağlantılı, Mersin'de yaşayan, Londra geçmişi olan, 34 yaşında bir kadın.

## Klasör Yapısı

```
nagihan-project/
├── karakter/
│   ├── hayat-hikayesi.md       → Nâgihan'ın tam hayat hikayesi (iç belge)
│   ├── karakter-anayasasi.md   → İçerik üretim rehberi ve kırmızı çizgiler
│   └── karakter-profili.md     → Hızlı referans kartı
├── site/
│   ├── index.html              → Ana web sitesi
│   └── assets/                 → Görseller buraya eklenecek
└── README.md                   → Bu dosya
```

## Görseller İçin

`site/assets/` klasörüne şu isimlendirmeyle görseller ekle:

- `nagihan-hero.jpg` → Hero bölümü ana görsel
- `nagihan-portrait.jpg` → Hakkımda bölümü portre
- `rivea-1.jpg`, `rivea-2.jpg`, `rivea-3.jpg` → Rivea ürün görselleri

Görseller eklendikten sonra `index.html` içindeki yorum satırlarını (`<!-- -->`) kaldır.

## Renk Paleti

| İsim | Kod | Kullanım |
|------|-----|----------|
| Kum | #f0ebe1 | Arka plan varyantı |
| Toprak | #8b7355 | Ana vurgu rengi |
| Koyu toprak | #5c4a32 | Başlıklar, koyu arka plan |
| Zeytin | #6b7c5a | İkincil vurgu |
| Altın | #c9a96e | Çizgiler, aksan |
| Derin | #2c2416 | Ana metin rengi |

## Önemli Notlar

- Nâgihan sanal bir karakter — site bunu açıkça belirtiyor
- Grenfell asla açıkça anılmaz — bu iç belgede kalır
- İpek'in yanıkları hiçbir içerikte gösterilmez
- Rivea Beauty ayrı bir site ([https://riveabeauty.com](https://riveabeauty.com)) — bu site oraya bağlantı verir

## Teknoloji

Saf HTML/CSS/JS — framework yok, dependency yok. Herhangi bir web sunucusuna doğrudan yüklenebilir.

## Ortak yerel sırlar (repo dışı — tüm projeler)

API anahtarları, şifreler vb. **tek dosyada** tutulur; repoya yazılmaz. Cursor kuralı: agent göreve başlarken bu dosyayı okur, aynı bilgiler için tekrar tekrar sormaz.

| | |
|---|---|
| **Gerçek dosya** | `%USERPROFILE%\.cursor\secrets.env` |
| **Şablon** | `%USERPROFILE%\.cursor\secrets.env.example` → kopyalayıp `secrets.env` yapın |

Bu repoda araçlar için gerekiyorsa kökte **`.env`** üretilebilir (içerik `secrets.env`’den türetilir); `.env` git’e girmez. Anahtar isimleri için repoda **`.env.example`** (değersiz) bakın.
