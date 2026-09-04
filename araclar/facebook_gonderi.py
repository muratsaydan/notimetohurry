# -*- coding: utf-8 -*-
"""
Facebook gönderi metni üretici — sitedeki bir yazıdan Facebook sayfası için
yapıştırmaya hazır gönderi çıkarır.

Kullanım:
    python araclar/facebook_gonderi.py                      # tüm TR yazılar
    python araclar/facebook_gonderi.py tr/makaleler/x.html   # tek yazı

Çıktı: kaynaklar/facebook/<slug>-facebook.md (git dışı)

Gönderi biçimi (sitenin kendisi örnek alınır, kart yok):
- Görsel: yazının karikatürü (assets/karikatur/…), alt yazısı ilk satır.
- Metin: yazının kendi giriş paragrafı + "bana ne kaldı" bölümünün son paragrafı.
- Sonda yazının adresi. Etiket yok; Facebook'ta etiket erişim getirmiyor.
"""
import io, os, re, sys, glob

SITE = "https://notimetohurry.com"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "kaynaklar", "facebook")

def duz(t):
    t = re.sub(r"<img[^>]*>", "", t)
    t = re.sub(r"<[^>]+>", "", t)
    return re.sub(r"\s+", " ", t).strip()

def convert(path):
    src = io.open(path, encoding="utf-8").read()
    rel = os.path.relpath(path, ROOT).replace("\\", "/")
    slug = os.path.splitext(os.path.basename(path))[0]
    url = f"{SITE}/{rel}"
    baslik = duz(re.search(r"<h1>(.*?)</h1>", src, re.S).group(1))
    eyebrow = duz(re.search(r'<p class="eyebrow">(.*?)</p>', src, re.S).group(1))
    body = src[src.index('<section style="padding-top:1rem;">'):src.index('<nav class="pager"')]

    # Giriş: ilk prose bloğunun ilk paragrafı
    giris = duz(re.search(r'<div class="prose">\s*<p[^>]*>(.*?)</p>', body, re.S).group(1))

    # Kapanış: h2'li son prose bloğunun son "muted" olmayan paragrafı
    kapanis_blok = re.findall(r"<h2>.*?</h2>(.*?)</div>", body, re.S)
    kapanis = ""
    if kapanis_blok:
        ps = re.findall(r'<p(?![^>]*class="muted")[^>]*>(.*?)</p>', kapanis_blok[-1], re.S)
        if ps:
            kapanis = duz(ps[-1])

    # Karikatür(ler)
    figs = []
    for fig in re.findall(r"<figure[^>]*>(.*?)</figure>", body, re.S):
        img = re.search(r'src="([^"]+)"', fig).group(1)
        img = os.path.normpath(os.path.join(os.path.dirname(rel), img)).replace("\\", "/")
        cap = re.search(r"<figcaption>(.*?)</figcaption>", fig, re.S)
        figs.append((img, duz(cap.group(1)) if cap else ""))

    gorsel = figs[0] if figs else None
    metin = []
    if gorsel and gorsel[1]:
        metin.append(gorsel[1])
        metin.append("")
    metin.append(giris)
    if kapanis:
        metin.append("")
        metin.append(kapanis)
    metin.append("")
    metin.append(f"Yazının tamamı: {url}")

    md = [f"# {baslik}", "", f"*{eyebrow}*", "",
          "**Gönderi türü:** fotoğraf gönderisi (metnin sonunda bağlantı)", ""]
    if gorsel:
        md += [f"**Görsel:** `{gorsel[0]}`", ""]
    for extra in figs[1:]:
        md += [f"**İkinci görsel (isteğe bağlı, aynı gönderiye ekle):** `{extra[0]}` — {extra[1]}", ""]
    md += ["**Metin:**", "", "```", "\n".join(metin), "```", ""]

    os.makedirs(OUT_DIR, exist_ok=True)
    dst = os.path.join(OUT_DIR, f"{slug}-facebook.md")
    io.open(dst, "w", encoding="utf-8").write("\n".join(md))
    print(f"{os.path.relpath(dst, ROOT)}  ({len('\n'.join(metin))} karakter)")

if __name__ == "__main__":
    files = sys.argv[1:] or sorted(
        f for f in glob.glob(os.path.join(ROOT, "tr", "makaleler", "*.html")) if not f.endswith("index.html"))
    for f in files:
        convert(f)
