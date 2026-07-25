# No Time to Hurry — Hiçbir Yere Yetişmeyenler Kulübü

Yavaş yaşam (slow living) felsefesini sade bir dille ama en derin katmanlarına kadar
anlatan, birinci şahıs (Murat Saydan) sesiyle yazılmış bir **seyir defteri** ve etik
markalardan oluşan bir ekosistem. Rivea Beauty bu ekosistemin bir parçasıdır, öznesi
değil.

- **Alan adı:** [notimetohurry.com](https://notimetohurry.com)
- **Diller:** Türkçe (öncelikli) + İngilizce
- **İmza unsuru:** Her yazıda, en ağır fikri tatlıya bağlayan bir **karikatür**.

Tüm strateji, ton, marka mimarisi ve içerik ilkeleri için tek kaynak:
**[`proje-dokumani.md`](proje-dokumani.md)**.

## Konumlandırma (özet)

Türkiye'de bu felsefeyi bütünlüklü anlatan bir yapı yok; bu boşluğun üzerine oturuyoruz.
Guru değil, tanık: "yavaşla" demeden, "ben yavaşladım, şunlar değişti" diyoruz. Hızı
reddetmeden — işin ve teknolojinin tam ortasında — kendi ritmini korumak.

## Teknoloji

Saf HTML/CSS/JS — framework yok, dependency yok. Push → GitHub Actions → sunucuya rsync
→ `notimetohurry.com` canlı. Deploy tanımı: [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
sunucu ayarı: [`deploy/notimetohurry.com.nginx`](deploy/notimetohurry.com.nginx).

## Slow Living Radar

İçerik fikri beslemesi için n8n tabanlı ekosistem tarayıcısı (RSS + Google Haberler).
Ayrıntı: [`n8n-slow-living-radar.md`](n8n-slow-living-radar.md).

## Durum

Proje yeniden kuruluyor. Önceki sanal karakter (Nâgihan) yapısı tamamen kaldırıldı;
merkeze gerçek kişi ve birinci şahıs anlatım alındı. Site içeriği sıfırdan inşa
edilecek — bu README ve `proje-dokumani.md` güncel omurgadır.

## Ortak yerel sırlar (repo dışı)

API anahtarları, şifreler vb. repoya yazılmaz; global `%USERPROFILE%\.cursor\secrets.env`
dosyasında tutulur. Repoda araçlar için gerekiyorsa kökte `.env` üretilir (git'e girmez);
anahtar isimleri için `.env.example`'a bakın.
