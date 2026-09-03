// Haftalik radar e-postasi. Iki katman:
//   1) Tam metin okunanlar  -> ayrintili Turkce aktarim
//   2) Yalnizca baslik      -> Google News ogeleri (govde akista gelmiyor)

function esc(x) {
  return String(x == null ? '' : x)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
function bos(x) {
  const t = String(x || '').trim().toLowerCase();
  return !t || t === 'yok' || t === '-' || t === 'belirsiz';
}
function tarih(x) {
  try {
    const d = new Date(x);
    if (isNaN(d)) return '';
    const p = (n) => String(n).padStart(2, '0');
    return p(d.getDate()) + '.' + p(d.getMonth() + 1) + '.' + d.getFullYear();
  } catch (e) {
    return '';
  }
}
function paragrafla(t) {
  return String(t || '')
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map(
      (p) =>
        '<p style="margin:0 0 10px;font-size:14.5px;line-height:1.62;color:#2c2416;">' + esc(p) + '</p>',
    )
    .join('');
}
function maddele(t) {
  const satirlar = String(t || '')
    .split(/\n|;/)
    .map((x) => x.replace(/^[\s*•\-–]+/, '').trim())
    .filter(Boolean);
  if (!satirlar.length) return '';
  return (
    '<ul style="margin:6px 0 0;padding-left:18px;">' +
    satirlar
      .map((x) => '<li style="font-size:13.5px;line-height:1.55;color:#4a4034;margin:0 0 3px;">' + esc(x) + '</li>')
      .join('') +
    '</ul>'
  );
}

const items = $input.all().map((x) => x.json);
const bosHafta = items.length === 1 && items[0].emptyWeek === true;

const HEAD =
  '﻿<!DOCTYPE html><html lang="tr"><head>' +
  '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta charset="utf-8">' +
  '<meta name="viewport" content="width=device-width, initial-scale=1"></head>' +
  '<body style="margin:0;padding:22px;background:#f4f2ec;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;">' +
  '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:760px;margin:0 auto;">' +
  '<tr><td style="background:#1f3d2b;padding:22px 26px;border-radius:10px 10px 0 0;">' +
  '<div style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#9fc0ac;">Slow Living Radar</div>' +
  '<div style="font-size:23px;color:#fff;margin-top:6px;font-weight:600;">Haftalık sakin yaşam özeti</div>';

const FOOT_NOTE =
  'Tam metin, yalnızca yayıncının kendi RSS akışında gelir. Google News üzerinden gelen öğelerde ' +
  'gövde metni bulunmaz; o yayıncının doğrudan akışı varsa hatta ekleyebiliriz.';

function altbilgi() {
  return (
    '<tr><td style="padding:16px 26px 22px;background:#faf9f6;border-top:1px solid #e6e2d8;border-radius:0 0 10px 10px;">' +
    '<p style="margin:0;font-size:12px;color:#7a7266;line-height:1.55;">' +
    esc(FOOT_NOTE) +
    ' Türkçe aktarımlar Google Vertex AI (Gemini) ile üretiliyor. Zamanlama: her Pazartesi 08:00.' +
    '</p></td></tr></table></body></html>'
  );
}

if (bosHafta) {
  const html =
    HEAD +
    '<div style="font-size:13px;color:#c9dccf;margin-top:8px;">' +
    esc(new Date().toLocaleDateString('tr-TR')) +
    '</div></td></tr>' +
    '<tr><td style="background:#fff;padding:26px;">' +
    '<p style="margin:0;font-size:14.5px;line-height:1.6;color:#2c2416;">Son <strong>7 gün</strong> içinde yayınlanmış, geçerli tarihli bir içerik bulunamadı. Bir sonraki çalıştırmada tekrar denenecek.</p>' +
    '</td></tr>' +
    altbilgi();
  return [{ json: { html, itemCount: 0 } }];
}

const tam = items.filter((x) => x.tamMetin);
const baslikOnly = items.filter((x) => !x.tamMetin);

function kart(x, i) {
  const url = esc(x.link);
  const bits = [];
  if (x.publisher) bits.push(esc(x.publisher));
  if (x.creator) bits.push(esc(x.creator));
  const t = tarih(x.isoDate || x.pubDate);
  if (t) bits.push(t);

  let s = '';
  s +=
    '<tr><td style="padding:20px 26px;border-bottom:1px solid #ece8dd;">' +
    '<div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#8b7355;margin-bottom:7px;">' +
    String(i + 1) +
    (bits.length ? ' &middot; ' + bits.join(' &middot; ') : '') +
    '</div>' +
    '<div style="font-size:19px;line-height:1.3;font-weight:600;margin-bottom:5px;">' +
    '<a href="' + url + '" style="color:#1f3d2b;text-decoration:none;">' + esc(x.trBaslik) + '</a>' +
    '</div>' +
    '<div style="font-size:12.5px;color:#8a8175;font-style:italic;margin-bottom:12px;">' +
    esc(x.title) +
    '</div>';

  const etiketler = [];
  if (!bos(x.tur)) etiketler.push(esc(x.tur));
  if (!bos(x.kiminIcin)) etiketler.push(esc(x.kiminIcin));
  if (etiketler.length) {
    s +=
      '<div style="font-size:12.5px;color:#6b6153;margin-bottom:10px;">' +
      etiketler.join(' &nbsp;|&nbsp; ') +
      '</div>';
  }

  if (!bos(x.tez)) {
    s +=
      '<div style="border-left:3px solid #c9a96e;padding:8px 0 8px 12px;margin:0 0 12px;">' +
      '<div style="font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:#8b7355;margin-bottom:3px;">Tez</div>' +
      '<div style="font-size:14.5px;line-height:1.5;color:#2c2416;">' + esc(x.tez) + '</div></div>';
  }

  s += paragrafla(x.aktarim);

  if (!bos(x.sayilar)) {
    s +=
      '<div style="margin-top:12px;background:#faf8f2;border:1px solid #ece8dd;border-radius:6px;padding:10px 12px;">' +
      '<div style="font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:#8b7355;">Sayılar</div>' +
      maddele(x.sayilar) +
      '</div>';
  }
  if (!bos(x.sessizlik)) {
    s +=
      '<div style="margin-top:10px;font-size:13.5px;line-height:1.55;color:#6b6153;">' +
      '<strong style="color:#8b7355;">Değinmediği:</strong> ' + esc(x.sessizlik) + '</div>';
  }
  if (!bos(x.deger)) {
    s +=
      '<div style="margin-top:12px;background:#eef3ec;border-radius:6px;padding:10px 12px;">' +
      '<div style="font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:#4e6b58;margin-bottom:3px;">Radar için değeri</div>' +
      '<div style="font-size:13.5px;line-height:1.55;color:#2c3a30;">' + esc(x.deger) + '</div></div>';
  }

  s +=
    '<div style="margin-top:13px;"><a href="' + url + '" ' +
    'style="font-size:12.5px;color:#54633f;text-decoration:none;border:1px solid #cfd8c4;border-radius:999px;padding:6px 13px;">Orijinali oku &rarr;</a></div>' +
    '</td></tr>';
  return s;
}

function satir(x, i) {
  const url = esc(x.link);
  const t = tarih(x.isoDate || x.pubDate);
  return (
    '<tr><td style="padding:13px 26px;border-bottom:1px solid #f0ede4;">' +
    '<div style="font-size:15px;line-height:1.35;margin-bottom:3px;">' +
    '<a href="' + url + '" style="color:#1f3d2b;text-decoration:none;font-weight:600;">' + esc(x.trBaslik) + '</a></div>' +
    '<div style="font-size:12px;color:#8a8175;font-style:italic;margin-bottom:4px;">' + esc(x.title) + '</div>' +
    '<div style="font-size:11.5px;color:#8b7355;">' +
    (x.publisher ? esc(x.publisher) : '') + (t ? ' &middot; ' + t : '') +
    (bos(x.deger) ? '' : ' &middot; ' + esc(x.deger)) +
    '</div></td></tr>'
  );
}

let html =
  HEAD +
  '<div style="font-size:13px;color:#c9dccf;margin-top:8px;">' +
  esc(new Date().toLocaleDateString('tr-TR')) +
  ' &middot; son 7 günde <strong>' + items.length + '</strong> içerik &middot; ' +
  '<strong>' + tam.length + '</strong> tam metin, ' + baslikOnly.length + ' yalnızca başlık' +
  '</div></td></tr>';

if (tam.length) {
  html +=
    '<tr><td style="background:#fff;padding:18px 26px 6px;">' +
    '<div style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#8b7355;">Tam metin okundu</div>' +
    '<div style="font-size:12.5px;color:#7a7266;margin-top:5px;line-height:1.5;">Aşağıdaki yazıların tamamı akıştan alınıp Türkçeye aktarıldı. Siteye alıp almayacağına buradan karar verebilirsin.</div>' +
    '</td></tr>';
  html += '<tr><td style="background:#fff;padding:0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">';
  html += tam.map(kart).join('');
  html += '</table></td></tr>';
}

if (baslikOnly.length) {
  html +=
    '<tr><td style="background:#fff;padding:20px 26px 6px;border-top:8px solid #f4f2ec;">' +
    '<div style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#8b7355;">Yalnızca başlık</div>' +
    '<div style="font-size:12.5px;color:#7a7266;margin-top:5px;line-height:1.5;">Bu öğeler Google News üzerinden geldi; akışta gövde metni yok. İlgini çeken olursa bağlantıyı aç.</div>' +
    '</td></tr>';
  html += '<tr><td style="background:#fff;padding:0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">';
  html += baslikOnly.map(satir).join('');
  html += '</table></td></tr>';
}

html += altbilgi();

return [{ json: { html, itemCount: items.length, tamMetin: tam.length, baslikOnly: baslikOnly.length } }];
