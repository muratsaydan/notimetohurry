/* Instagram Yayın Defteri — tek dosyalık HTML sayfası üretir (görseller gömülü).
   Kullanım: node instagram/artifact.mjs   →   .build/yayin-defteri.html            */

import { gonderiler, hesap } from './icerik.mjs';
import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const KOK = path.dirname(fileURLToPath(import.meta.url));
const CIKTI = path.join(KOK, 'cikti');
const GECICI = path.join(KOK, '.build', 'kucuk');

execFileSync('python', ['-c', `
import os, sys
from PIL import Image
kaynak, hedef = sys.argv[1], sys.argv[2]
os.makedirs(hedef, exist_ok=True)
for kok, _, dosyalar in os.walk(kaynak):
    for d in dosyalar:
        if not d.endswith('.png'): continue
        p = os.path.join(kok, d)
        ad = os.path.relpath(p, kaynak).replace(os.sep, '__').replace('.png', '.jpg')
        im = Image.open(p).convert('RGB')
        im.thumbnail((480, 480 * 5 // 4), Image.LANCZOS)
        im.save(os.path.join(hedef, ad), 'JPEG', quality=80, optimize=True)
`, CIKTI, GECICI], { stdio: 'inherit' });

const veri = (klasor, dosya) =>
  'data:image/jpeg;base64,' +
  readFileSync(path.join(GECICI, `${klasor}__${dosya}.jpg`)).toString('base64');

const kac = (t) => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ---------- gönderi kartları ---------- */
const kartlar = gonderiler.map((g, n) => {
  const no = String(n + 1).padStart(2, '0');
  const slaytlar = g.slaytlar.map((s, i) =>
    `<img src="${veri(g.id, i + 1)}" alt="${kac(s.alt || s.baslik || s.ara || s.alinti || '')}" loading="lazy">`
  ).join('');
  const altlar = g.slaytlar.filter(s => s.alt);
  return `<article class="gonderi" id="g${no}">
  <header>
    <label class="isaret">
      <input type="checkbox" data-no="${no}">
      <span class="no">${no}</span>
    </label>
    <h3>${kac(g.ad)}</h3>
    <span class="rozet">${g.tip === 'karusel' ? g.slaytlar.length + ' görsel' : 'tek kare'}</span>
  </header>
  <div class="slaytlar">${slaytlar}</div>
  <div class="metin-blok">
    <div class="blok-basi">
      <span class="yol"><code>cikti/${g.id}/</code></span>
      <button class="kopyala" type="button">Açıklamayı kopyala</button>
    </div>
    <pre class="metin">${kac(g.metin)}

${kac(g.etiketler.join(' '))}</pre>
  </div>
  ${altlar.length ? `<details class="alt-metin">
    <summary>Alternatif metinler (${altlar.length})</summary>
    <ul>${altlar.map(s => `<li><div class="blok-basi"><button class="kopyala mini" type="button">kopyala</button></div><pre>${kac(s.alt)}</pre></li>`).join('')}</ul>
  </details>` : ''}
</article>`;
}).join('\n');

const oneCikanlar = hesap.oneCikanlar.map((h, i) =>
  `<figure><img src="${veri('00-hesap', `one-cikan-${i + 1}-${h.ad.replace(/\s+/g, '-')}`)}" alt="${kac(h.ad)} kapağı"><figcaption>${kac(h.ad)}</figcaption></figure>`
).join('');

const html = `<meta charset="utf-8">
<title>Instagram Yayın Defteri</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..500&family=Newsreader:ital,wght@0,300..600;1,300..500&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
:root{
  --kagit:#f5f0e6; --kagit-alt:#ece4d5; --yuzey:#fbf8f1;
  --murekkep:#2c2416; --murekkep-soft:#6b6153;
  --adacayi:#54633f; --toprak:#8b7355; --altin:#b5924f;
  --cizgi:rgba(44,36,22,.16); --cizgi-ince:rgba(44,36,22,.08);
  --uyari:#9a4a33; --uyari-zemin:rgba(154,74,51,.09);
  --tamam:#4d6b43;
  --golge:0 1px 2px rgba(44,36,22,.06), 0 8px 24px -16px rgba(44,36,22,.3);
}
@media (prefers-color-scheme: dark){
  :root:not([data-theme="light"]){
    --kagit:#1b1811; --kagit-alt:#241f16; --yuzey:#221d15;
    --murekkep:#ece5d6; --murekkep-soft:#a29885;
    --adacayi:#9aab82; --toprak:#c0a684; --altin:#d3b273;
    --cizgi:rgba(236,229,214,.16); --cizgi-ince:rgba(236,229,214,.08);
    --uyari:#e0917a; --uyari-zemin:rgba(224,145,122,.12);
    --tamam:#9aba8c;
    --golge:0 1px 2px rgba(0,0,0,.4), 0 8px 24px -16px rgba(0,0,0,.8);
  }
}
:root[data-theme="dark"]{
  --kagit:#1b1811; --kagit-alt:#241f16; --yuzey:#221d15;
  --murekkep:#ece5d6; --murekkep-soft:#a29885;
  --adacayi:#9aab82; --toprak:#c0a684; --altin:#d3b273;
  --cizgi:rgba(236,229,214,.16); --cizgi-ince:rgba(236,229,214,.08);
  --uyari:#e0917a; --uyari-zemin:rgba(224,145,122,.12);
  --tamam:#9aba8c;
  --golge:0 1px 2px rgba(0,0,0,.4), 0 8px 24px -16px rgba(0,0,0,.8);
}

*,*::before,*::after{box-sizing:border-box}
body{
  margin:0; background:var(--kagit); color:var(--murekkep);
  font-family:"Newsreader",Georgia,serif; font-size:17px; line-height:1.65;
  -webkit-font-smoothing:antialiased;
}
.sar{max-width:820px; margin-inline:auto; padding:clamp(28px,6vw,64px) clamp(18px,5vw,32px) 120px}
h1,h2,h3{font-family:"Fraunces",Georgia,serif; font-weight:400; line-height:1.14; text-wrap:balance; margin:0}
h1{font-size:clamp(34px,7vw,52px); letter-spacing:-.015em}
h2{font-size:clamp(24px,4.4vw,31px); margin-bottom:6px}
h3{font-size:20px}
p{margin:0}
code,pre,.mono{font-family:"IBM Plex Mono",ui-monospace,monospace}

.etiket{
  font-family:"IBM Plex Mono",monospace; font-size:11.5px; letter-spacing:.18em;
  text-transform:uppercase; color:var(--toprak); margin-bottom:14px; display:block;
}
.giris p{color:var(--murekkep-soft); max-width:60ch; margin-top:14px}
.kural{border:0; border-top:1px solid var(--cizgi); margin:56px 0 0}

section{margin-top:52px}
.bolum-basi{display:flex; align-items:baseline; gap:14px; flex-wrap:wrap; margin-bottom:22px}
.bolum-basi p{color:var(--murekkep-soft); font-size:15px}

/* --- uyarı --- */
.uyari{
  background:var(--uyari-zemin); border-left:3px solid var(--uyari);
  border-radius:0 10px 10px 0; padding:18px 22px; display:flex; gap:14px; align-items:flex-start;
}
.uyari .im{color:var(--uyari); font-family:"IBM Plex Mono",monospace; font-size:13px;
  letter-spacing:.14em; text-transform:uppercase; padding-top:3px; white-space:nowrap}
.uyari p{font-size:16px}
.uyari strong{color:var(--uyari)}

/* --- ayar tablosu --- */
.ayarlar{width:100%; border-collapse:collapse; margin-top:20px; font-size:16px}
.ayarlar th{
  text-align:left; font-family:"IBM Plex Mono",monospace; font-weight:500; font-size:11.5px;
  letter-spacing:.14em; text-transform:uppercase; color:var(--murekkep-soft);
  padding:0 12px 10px 0; border-bottom:1px solid var(--cizgi);
}
.ayarlar td{padding:13px 12px 13px 0; border-bottom:1px solid var(--cizgi-ince); vertical-align:top; overflow-wrap:anywhere}
.ayarlar .olacak.mono{font-size:13.5px}
.ayarlar td:first-child{color:var(--murekkep-soft); white-space:nowrap}
.ayarlar .simdi{font-family:"IBM Plex Mono",monospace; font-size:14px; color:var(--murekkep-soft); text-decoration:line-through}
.ayarlar .olacak{font-weight:500}
.ayarlar .olacak.vurgu{color:var(--uyari)}

/* --- kopyalanabilir blok --- */
.metin-blok{margin-top:16px; display:flex; flex-direction:column; gap:8px}
.blok-basi{display:flex; align-items:center; justify-content:space-between; gap:12px}
.blok-basi:only-child,.alt-metin .blok-basi{justify-content:flex-end}
pre{
  margin:0; background:var(--kagit-alt); border:1px solid var(--cizgi-ince);
  border-radius:10px; padding:18px 20px; font-size:13.5px; line-height:1.7;
  white-space:pre-wrap; overflow-x:auto; color:var(--murekkep); font-size:14px;
}
.kopyala{
  flex:0 0 auto;
  font-family:"IBM Plex Mono",monospace; font-size:11px; letter-spacing:.1em; text-transform:uppercase;
  background:var(--yuzey); color:var(--murekkep-soft);
  border:1px solid var(--cizgi); border-radius:6px; padding:6px 11px; cursor:pointer;
  transition:color .15s, border-color .15s;
}
.kopyala:hover{color:var(--adacayi); border-color:var(--adacayi)}
.kopyala:focus-visible{outline:2px solid var(--adacayi); outline-offset:2px}
.kopyala.oldu{color:var(--tamam); border-color:var(--tamam)}

/* --- profil ızgarası --- */
.izgara-sar{display:flex; gap:26px; flex-wrap:wrap; align-items:flex-start; margin-top:20px}
.izgara{
  display:grid; grid-template-columns:repeat(3,1fr); gap:3px;
  width:min(330px,100%); padding:3px; background:var(--cizgi);
  border:1px solid var(--cizgi); border-radius:4px;
}
.izgara img{width:100%; aspect-ratio:4/5; object-fit:cover; display:block}
.izgara-not{flex:1 1 220px; color:var(--murekkep-soft); font-size:15px}

.oneler{display:flex; gap:14px; flex-wrap:wrap; margin-top:22px}
.oneler figure{margin:0; width:96px; text-align:center}
.oneler img{width:96px; height:96px; border-radius:50%; display:block; border:1px solid var(--cizgi)}
.oneler figcaption{font-family:"IBM Plex Mono",monospace; font-size:11px; letter-spacing:.1em;
  color:var(--murekkep-soft); margin-top:8px}

/* --- gönderi kartı --- */
.gonderi{
  background:var(--yuzey); border:1px solid var(--cizgi-ince); border-radius:14px;
  padding:20px 20px 22px; margin-top:18px; box-shadow:var(--golge);
}
.gonderi header{display:flex; align-items:center; gap:12px; flex-wrap:wrap}
.gonderi h3{flex:1 1 auto; min-width:0}
.isaret{display:flex; align-items:center; gap:9px; cursor:pointer; user-select:none}
.isaret input{width:17px; height:17px; accent-color:var(--adacayi); cursor:pointer; margin:0}
.no{font-family:"IBM Plex Mono",monospace; font-size:13px; letter-spacing:.1em; color:var(--altin)}
.gonderi.bitti{opacity:.55}
.gonderi.bitti h3{text-decoration:line-through; text-decoration-color:var(--cizgi)}
.rozet{
  font-family:"IBM Plex Mono",monospace; font-size:10.5px; letter-spacing:.14em; text-transform:uppercase;
  color:var(--murekkep-soft); border:1px solid var(--cizgi); border-radius:100px; padding:3px 10px; white-space:nowrap;
}
.slaytlar{display:flex; gap:9px; overflow-x:auto; padding:16px 0 8px; scroll-snap-type:x mandatory}
.slaytlar img{
  width:172px; flex:0 0 auto; border-radius:7px; border:1px solid var(--cizgi-ince);
  scroll-snap-align:start; background:var(--kagit-alt);
}
.yol{font-family:"IBM Plex Mono",monospace; font-size:12px; color:var(--murekkep-soft)}
.yol code{background:none}
.alt-metin{margin-top:14px}
.alt-metin summary{
  font-family:"IBM Plex Mono",monospace; font-size:11.5px; letter-spacing:.12em; text-transform:uppercase;
  color:var(--murekkep-soft); cursor:pointer;
}
.alt-metin summary:focus-visible{outline:2px solid var(--adacayi); outline-offset:3px}
.alt-metin ul{list-style:none; margin:12px 0 0; padding:0; display:flex; flex-direction:column; gap:10px}
.alt-metin pre{font-size:12.5px}
.kopyala.mini{font-size:10px; padding:4px 8px}
.alt-metin li{display:flex; flex-direction:column; gap:6px}

/* --- ton kuralları --- */
.kurallar{list-style:none; margin:20px 0 0; padding:0; display:flex; flex-direction:column; gap:14px}
.kurallar li{display:flex; gap:14px; align-items:baseline}
.kurallar .yok{
  font-family:"IBM Plex Mono",monospace; font-size:11px; letter-spacing:.12em; text-transform:uppercase;
  color:var(--uyari); border:1px solid var(--uyari); border-radius:5px; padding:2px 8px;
  white-space:nowrap; flex:0 0 auto;
}
.kurallar p{font-size:16px}
.kurallar strong{font-weight:600}

.sonsoz{margin-top:56px; padding-top:26px; border-top:1px solid var(--cizgi); color:var(--murekkep-soft); font-size:15px}
.sonsoz a{color:var(--adacayi)}

@media (max-width:560px){
  .slaytlar img{width:148px}
  .oneler figure,.oneler img{width:76px}
  .oneler img{height:76px}
}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
</style>

<div class="sar">

<header class="giris">
  <span class="etiket">hiçbir yere yetişmeyenler kulübü · instagram</span>
  <h1>Yayın defteri</h1>
  <p>Hesap ayarları, 12 hazır gönderi ve metinleri. Telefondan açıp sırayla paylaşmak için —
  her açıklamanın yanında kopyala düğmesi var, paylaştıklarını işaretledikçe kayboluyorlar.</p>
</header>

<hr class="kural">

<section>
  <div class="bolum-basi"><h2>Önce hesap</h2><p>Gönderiler bundan sonra.</p></div>
  <div class="uyari">
    <span class="im">önce bu</span>
    <p>Hesabın ad alanında <strong>“Nagihan”</strong> yazıyor. Instagram aramasında taranan
    tek serbest metin orası; ayrıca profile giren ilk kişi kulübün adını değil başka bir ad
    görüyor. Gönderi atmadan önce değiştir.</p>
  </div>

  <table class="ayarlar">
    <thead><tr><th>Alan</th><th>Şu an</th><th>Olacak</th></tr></thead>
    <tbody>
      <tr><td>Ad (Name)</td><td class="simdi">Nagihan</td><td class="olacak vurgu">${kac(hesap.isim)}</td></tr>
      <tr><td>Kullanıcı adı</td><td class="simdi">—</td><td class="olacak mono">${kac(hesap.kullaniciAdi)}</td></tr>
      <tr><td>Kategori</td><td class="simdi">—</td><td class="olacak">${kac(hesap.kategori)}</td></tr>
      <tr><td>Bağlantı</td><td class="simdi">yok</td><td class="olacak mono">${kac(hesap.baglanti)}</td></tr>
      <tr><td>Hesap türü</td><td class="simdi">kişisel</td><td class="olacak">Yaratıcı (Creator)</td></tr>
    </tbody>
  </table>

  <div class="metin-blok">
    <div class="blok-basi">
      <span class="yol">biyografi · ${hesap.bio.length}/150 karakter</span>
      <button class="kopyala" type="button">Kopyala</button>
    </div>
    <pre>${kac(hesap.bio)}</pre>
  </div>
  <p class="yol" style="margin-top:10px">profil fotoğrafı · <code>cikti/00-hesap/profil-fotografi.png</code></p>

  <div class="oneler">${oneCikanlar}</div>
  <p class="yol" style="margin-top:10px">öne çıkan kapakları · <code>cikti/00-hesap/</code></p>
</section>

<section>
  <div class="bolum-basi"><h2>Izgara nasıl görünecek</h2><p>12 gönderi paylaşıldığında.</p></div>
  <div class="izgara-sar">
    <div class="izgara" id="izgara"></div>
    <p class="izgara-not">Sıra rastgele değil: ağır karusel ile hafif tek kare dönüşümlü,
    konular da “bir oradan bir buradan”. Kağıt, koyu ve sarı karikatür kartları ızgarada
    kendiliğinden bir ritim kuruyor — profile giren biri düzeni bir bakışta görüyor.</p>
  </div>
</section>

<section>
  <div class="bolum-basi"><h2>Sıra</h2><p>Haftada iki — salı ve cuma. Yaklaşık altı hafta.</p></div>
  ${kartlar}
</section>

<section>
  <div class="bolum-basi"><h2>Bu hesabın yapmayacağı şeyler</h2></div>
  <p style="color:var(--murekkep-soft); max-width:62ch">Instagram’da “slow living” nişi tıka basa
  dolu ve neredeyse tamamı aynı: bej filtre, keten gömlek, buharı tüten kahve, “kendine iyi bak”
  temennisi. Site zaten bunu eleştiriyor — <em>“kolayca bir lüks ya da statü göstergesine
  dönüşebiliyor.”</em> O tuzağa düşersek hesap, sitenin kendi yazdığının karşıtı olur.</p>
  <ul class="kurallar">
    <li><span class="yok">yok</span><p><strong>Stok fotoğraf.</strong> Görsel dil = kendi karikatürlerin + tipografi. Başkasının kahvesi, başkasının Toskana’sı yok.</p></li>
    <li><span class="yok">yok</span><p><strong>Temenni.</strong> “Nefes al, kendine zaman ayır” yerine bir tarih, bir düşünür, bir itiraz.</p></li>
    <li><span class="yok">yok</span><p><strong>Guru pozu.</strong> Emir kipi yok: “şunu yap” değil, “ben şunu fark ettim”.</p></li>
    <li><span class="yok">yok</span><p><strong>Reels zorlaması.</strong> Elinde video yok; olmayan formatı taklit etme.</p></li>
    <li><span class="yok">yok</span><p><strong>Etiket duvarı.</strong> Sekiz etiket yeter, hepsi konuyla ilgili.</p></li>
  </ul>
  <p style="margin-top:22px; color:var(--murekkep-soft); max-width:62ch">Riskli ama doğru olan:
  <strong style="color:var(--murekkep)">08 numaralı gönderi</strong> — “fark edilmeden yaşa”yı
  Instagram’da paylaşmanın çelişkisini açıkça itiraf ediyor. Muhtemelen en çok konuşulacak olan o.
  Yumuşatma.</p>
</section>

<p class="sonsoz">Kaynak dosyalar depoda: <code>instagram/icerik.mjs</code> ·
yeni gönderi eklemek için <code>node instagram/uret.mjs</code> ·
site: <a href="https://notimetohurry.com">notimetohurry.com</a></p>

</div>

<script>
(function(){
  // Izgara: her gönderinin ilk slaydını kopyalayarak kur (görseli iki kez gömmemek için).
  var izgara = document.getElementById('izgara');
  document.querySelectorAll('.gonderi .slaytlar img:first-child').forEach(function(im){
    var k = im.cloneNode(true); k.removeAttribute('loading'); izgara.appendChild(k);
  });

  // Kopyala
  document.addEventListener('click', function(e){
    var d = e.target.closest('.kopyala'); if(!d) return;
    var kap = d.closest('.metin-blok, li'); var blok = kap && kap.querySelector('pre'); if(!blok) return;
    var bitir = function(ok){
      var eski = d.textContent;
      d.textContent = ok ? 'kopyalandı' : 'kopyalanamadı';
      d.classList.toggle('oldu', ok);
      setTimeout(function(){ d.textContent = eski; d.classList.remove('oldu'); }, 1600);
    };
    try {
      navigator.clipboard.writeText(blok.textContent).then(function(){ bitir(true); }, function(){ bitir(false); });
    } catch(x){ bitir(false); }
  });

  // Paylaşıldı işaretleri — yalnızca bu tarayıcıda saklanır
  var ANAHTAR = 'ntth-ig-paylasildi';
  var durum = {};
  try { durum = JSON.parse(localStorage.getItem(ANAHTAR) || '{}') || {}; } catch(x){ durum = {}; }
  document.querySelectorAll('.gonderi input[type=checkbox]').forEach(function(k){
    var no = k.dataset.no;
    k.checked = !!durum[no];
    k.closest('.gonderi').classList.toggle('bitti', k.checked);
    k.addEventListener('change', function(){
      k.closest('.gonderi').classList.toggle('bitti', k.checked);
      durum[no] = k.checked;
      try { localStorage.setItem(ANAHTAR, JSON.stringify(durum)); } catch(x){}
    });
  });
})();
</script>`;

const hedef = path.join(KOK, '.build', 'yayin-defteri.html');
writeFileSync(hedef, html, 'utf8');
console.log(`${hedef} — ${(statSync(hedef).size / 1048576).toFixed(2)} MB`);
