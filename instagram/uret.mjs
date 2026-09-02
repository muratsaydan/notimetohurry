/* ============================================================
   Kart üreteci — icerik.mjs'yi okur, 1080x1350 PNG'ler basar.
   Kullanım:  node instagram/uret.mjs
   Gereksinim: Chrome ya da Edge (headless ekran görüntüsü için)
   ============================================================ */

import { gonderiler, hesap } from './icerik.mjs';
import { mkdirSync, writeFileSync, rmSync, existsSync, readdirSync, statSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const KOK    = path.dirname(fileURLToPath(import.meta.url));
const BUILD  = path.join(KOK, '.build');
const CIKTI  = path.join(KOK, 'cikti');
const ESZAMAN = 6;                       // aynı anda kaç Chrome

const TARAYICILAR = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
];
const TARAYICI = TARAYICILAR.find(p => existsSync(p));
if (!TARAYICI) { console.error('Chrome ya da Edge bulunamadı.'); process.exit(1); }

const FONTLAR = 'https://fonts.googleapis.com/css2' +
  '?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..500' +
  '&family=Newsreader:ital,wght@0,300..600;1,300..500' +
  '&family=Inter:wght@400;500;600&display=swap';

/* ---------- yardımcılar ---------- */
const kacinci = (i, n) => n > 1 ? `${i + 1} / ${n}` : '';

function altSerit(i, n) {
  return `<div class="alt"><span class="marka">hiçbir yere yetişmeyenler</span>` +
         `<span class="sayac">${kacinci(i, n)}</span></div>`;
}
function ustSerit(eyebrow) {
  if (!eyebrow) return '<div class="ust"></div>';
  return `<div class="ust"><p class="eyebrow">${eyebrow}</p><div class="cizgi"></div></div>`;
}

/* ---------- slayt türleri ---------- */
function slaytIci(s) {
  switch (s.tur) {

    case 'kapak':
      return `<div class="orta">
        <h1 class="baslik${s.buyuk ? ' buyuk' : ''}">${s.baslik}</h1>
        ${s.kicik ? `<p class="kicik">${s.kicik}</p>` : ''}
        ${s.kaydir ? `<p class="kaydir">${s.kaydir}</p>` : ''}
      </div>`;

    case 'metin':
      return `<div class="orta">
        ${s.ara ? `<h2 class="ara">${s.ara}</h2>` : ''}
        ${(s.govde || []).map(p => `<p class="govde">${p}</p>`).join('')}
        ${s.kicik ? `<p class="kicik">${s.kicik}</p>` : ''}
      </div>`;

    case 'alinti':
      return `<div class="orta">
        <p class="alinti${(s.alinti.length > 60) ? ' kucuk' : ''}">${s.alinti}</p>
        ${s.kaynak ? `<p class="kaynak">${s.kaynak}</p>` : ''}
      </div>`;

    case 'diyalog':
      return `<div class="orta">
        <div class="tur soru">
          <p class="konusan"><img src="../../assets/karakter/avatar.jpg" alt="">Murat</p>
          <p>${s.soru}</p>
        </div>
        <div class="tur cevap">
          <p class="konusan">Yapay zekâ</p>
          ${(s.cevap || []).map(p => `<p>${p}</p>`).join('')}
        </div>
      </div>`;

    case 'gorsel':
      return `<div class="orta">
        <figure class="gorsel">
          ${s.ara ? `<h2 class="ara">${s.ara}</h2>` : ''}
          <img src="../../assets/karikatur/${s.src}" alt="${s.alt || ''}">
          ${s.caption ? `<figcaption>${s.caption}</figcaption>` : ''}
        </figure>
      </div>`;

    case 'kapanis':
      return `<div class="orta">
        <h1 class="baslik kucuk">${s.baslik}</h1>
        ${s.link ? `<p class="baglanti">${s.link}</p>` : ''}
        ${s.kicik ? `<p class="kicik">${s.kicik}</p>` : ''}
      </div>`;

    default:
      throw new Error('bilinmeyen slayt türü: ' + s.tur);
  }
}

function kartHtml(s, i, n) {
  const gorselSinif = s.tur === 'gorsel' ? ' gorsel-kart' : '';
  return `<div class="kart ${s.zemin || ''}${gorselSinif}">
    ${ustSerit(s.eyebrow)}
    ${slaytIci(s)}
    ${altSerit(i, n)}
  </div>`;
}

function sayfa(icerik) {
  return `<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${FONTLAR}" rel="stylesheet">
<link rel="stylesheet" href="../sablon/kart.css">
</head><body>${icerik}</body></html>`;
}

/* ---------- hesap kartları (profil foto + öne çıkanlar) ---------- */
function hesapKartlari() {
  const liste = [];
  liste.push({
    dosya: 'profil-fotografi',
    en: 1080, boy: 1080,
    html: `<div class="kare" style="padding:0">
      <img src="../../assets/karakter/avatar.jpg" alt=""
           style="width:100%;height:100%;object-fit:cover;object-position:47% 50%">
    </div>`,
  });
  hesap.oneCikanlar.forEach((h, i) => {
    liste.push({
      dosya: `one-cikan-${i + 1}-${h.ad.replace(/\s+/g, '-')}`,
      en: 1080, boy: 1080,
      html: `<div class="kare ${h.zemin}">
        <span class="simge">${h.simge}</span>
        <span class="isim">${h.ad}</span>
      </div>`,
    });
  });
  return liste;
}

/* ---------- render ---------- */
let profilNo = 0;
function ekranGoruntusu(htmlYol, pngYol, en, boy) {
  // Her Chrome örneğine ayrı profil klasörü — aynı klasör paylaşılırsa kilit çakışıyor (exit 21).
  const profil = path.join(BUILD, 'profil-' + (profilNo++));
  return new Promise((coz, red) => {
    execFile(TARAYICI, [
      '--headless', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
      '--force-device-scale-factor=1',
      `--user-data-dir=${profil}`,
      `--window-size=${en},${boy}`,
      '--virtual-time-budget=9000',
      `--screenshot=${pngYol}`,
      'file:///' + htmlYol.replace(/\\/g, '/'),
    ], { timeout: 90000 }, (hata) => hata ? red(hata) : coz());
  });
}

async function kuyruk(isler, es) {
  const sonuc = [];
  let sira = 0;
  const isci = async () => {
    while (sira < isler.length) {
      const i = sira++;
      sonuc[i] = await isler[i]();
    }
  };
  await Promise.all(Array.from({ length: es }, isci));
  return sonuc;
}

/* ---------- ana akış ---------- */
rmSync(BUILD, { recursive: true, force: true });
rmSync(CIKTI, { recursive: true, force: true });
mkdirSync(BUILD, { recursive: true });
mkdirSync(CIKTI, { recursive: true });

const isler = [];

for (const g of gonderiler) {
  const klasor = path.join(CIKTI, g.id);
  mkdirSync(klasor, { recursive: true });
  g.slaytlar.forEach((s, i) => {
    const ad = `${g.id}-${String(i + 1).padStart(2, '0')}`;
    const htmlYol = path.join(BUILD, ad + '.html');
    writeFileSync(htmlYol, sayfa(kartHtml(s, i, g.slaytlar.length)), 'utf8');
    isler.push(async () => {
      await ekranGoruntusu(htmlYol, path.join(klasor, `${i + 1}.png`), 1080, 1350);
      process.stdout.write('.');
    });
  });
}

const hesapKlasor = path.join(CIKTI, '00-hesap');
mkdirSync(hesapKlasor, { recursive: true });
for (const k of hesapKartlari()) {
  const htmlYol = path.join(BUILD, k.dosya + '.html');
  writeFileSync(htmlYol, sayfa(k.html), 'utf8');
  isler.push(async () => {
    await ekranGoruntusu(htmlYol, path.join(hesapKlasor, k.dosya + '.png'), k.en, k.boy);
    process.stdout.write('.');
  });
}

console.log(`${isler.length} kart render ediliyor (${path.basename(TARAYICI)})…`);
const t0 = Date.now();
await kuyruk(isler, ESZAMAN);
console.log(`\nBitti — ${((Date.now() - t0) / 1000).toFixed(1)} sn`);

/* ---------- metinler.md ---------- */
const md = [];
md.push('# Instagram metinleri — Hiçbir Yere Yetişmeyenler Kulübü\n');
md.push('> Bu dosya `icerik.mjs`den otomatik üretilir. Elle düzenleme; kaynağı düzenle.\n');
md.push('## Hesap ayarları\n');
md.push('| Alan | Değer |');
md.push('| --- | --- |');
md.push(`| Kullanıcı adı | \`${hesap.kullaniciAdi}\` |`);
md.push(`| Ad (Name) | **${hesap.isim}** (${hesap.isim.length}/30) |`);
md.push(`| Kategori | ${hesap.kategori} |`);
md.push(`| Bağlantı | ${hesap.baglanti} |`);
md.push(`\n**Biyografi** (${hesap.bio.length}/150):\n`);
md.push('```\n' + hesap.bio + '\n```\n');
md.push('---\n');

for (const [n, g] of gonderiler.entries()) {
  md.push(`## ${String(n + 1).padStart(2, '0')} · ${g.ad}\n`);
  md.push(`**Tür:** ${g.tip === 'karusel' ? `karusel (${g.slaytlar.length} görsel)` : 'tek kare'}  `);
  md.push(`**Dosyalar:** \`instagram/cikti/${g.id}/\` → ${g.slaytlar.map((_, i) => `${i + 1}.png`).join(', ')}\n`);
  md.push('**Açıklama:**\n');
  md.push('```\n' + g.metin + '\n```\n');
  md.push('**Etiketler:**\n');
  md.push('```\n' + g.etiketler.join(' ') + '\n```\n');
  const alt = g.slaytlar.filter(s => s.alt).map(s => s.alt);
  if (alt.length) {
    md.push('**Alternatif metin (erişilebilirlik — Gelişmiş ayarlar):**\n');
    alt.forEach(a => md.push(`- ${a}`));
    md.push('');
  }
  md.push('---\n');
}
writeFileSync(path.join(KOK, 'metinler.md'), md.join('\n'), 'utf8');

/* ---------- onizleme.html ---------- */
const kutular = gonderiler.map((g, n) => {
  const slaytlar = g.slaytlar.map((_, i) =>
    `<img src="cikti/${g.id}/${i + 1}.png" alt="" loading="lazy">`).join('');
  return `<section class="gonderi">
    <h2><span>${String(n + 1).padStart(2, '0')}</span> ${g.ad}
      <em>${g.tip === 'karusel' ? g.slaytlar.length + ' görsel' : 'tek kare'}</em></h2>
    <div class="serit">${slaytlar}</div>
    <pre>${g.metin.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))}

${g.etiketler.join(' ')}</pre>
  </section>`;
}).join('');

const izgara = gonderiler.map(g => `<img src="cikti/${g.id}/1.png" alt="" loading="lazy">`).join('');

writeFileSync(path.join(KOK, 'onizleme.html'), `<!DOCTYPE html><html lang="tr"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Instagram önizleme — Hiçbir Yere Yetişmeyenler Kulübü</title>
<style>
 body{margin:0;background:#e7e1d5;color:#2c2416;font:16px/1.6 system-ui,Segoe UI,sans-serif}
 .sar{max-width:1180px;margin:0 auto;padding:48px 24px 96px}
 h1{font:400 34px/1.2 Georgia,serif;margin:0 0 6px}
 .not{color:#6b6153;margin:0 0 48px}
 .izgara{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;max-width:460px;
         margin:0 0 64px;background:#fff;padding:4px;border:1px solid rgba(44,36,22,.14)}
 .izgara img{width:100%;aspect-ratio:4/5;object-fit:cover;display:block}
 .gonderi{margin-bottom:56px;background:#f5f0e6;border:1px solid rgba(44,36,22,.14);
          border-radius:10px;padding:22px 22px 26px}
 .gonderi h2{font:400 21px/1.3 Georgia,serif;margin:0 0 16px;display:flex;align-items:baseline;gap:10px}
 .gonderi h2 span{color:#c9a96e;font-size:15px;letter-spacing:.1em}
 .gonderi h2 em{margin-left:auto;font:normal 13px/1 system-ui;letter-spacing:.08em;
                text-transform:uppercase;color:#6b6153}
 .serit{display:flex;gap:12px;overflow-x:auto;padding-bottom:10px}
 .serit img{width:236px;flex:0 0 auto;border-radius:6px;border:1px solid rgba(44,36,22,.14)}
 pre{white-space:pre-wrap;font:14px/1.65 system-ui;background:#ece4d5;color:#3a3123;
     padding:16px 18px;border-radius:8px;margin:16px 0 0}
</style></head><body><div class="sar">
<h1>Instagram önizleme</h1>
<p class="not">Profil ızgarasının nasıl görüneceği + 12 gönderi, görselleri ve metinleriyle.
Yeniden üretmek için: <code>node instagram/uret.mjs</code></p>
<div class="izgara">${izgara}</div>
${kutular}
</div></body></html>`, 'utf8');

/* ---------- geçici Chrome profillerini sil (~300 MB) ---------- */
for (const d of readdirSync(BUILD)) {
  if (d.startsWith('profil-')) rmSync(path.join(BUILD, d), { recursive: true, force: true });
}

/* ---------- özet ---------- */
let toplam = 0, adet = 0;
const gez = d => readdirSync(d).forEach(f => {
  const p = path.join(d, f);
  statSync(p).isDirectory() ? gez(p) : (toplam += statSync(p).size, adet++);
});
gez(CIKTI);
console.log(`${adet} dosya, ${(toplam / 1048576).toFixed(1)} MB → instagram/cikti/`);
console.log('metinler.md ve onizleme.html güncellendi.');
