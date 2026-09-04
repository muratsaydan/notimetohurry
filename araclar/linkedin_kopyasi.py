# -*- coding: utf-8 -*-
"""
LinkedIn makale kopyası üretici.

Kullanım:
    python araclar/linkedin_kopyasi.py                     # tüm TR yazılar
    python araclar/linkedin_kopyasi.py tr/makaleler/x.html  # tek yazı

Çıktı: kaynaklar/linkedin/<slug>-linkedin.html  (git dışı)
Kullanımı: dosyayı tarayıcıda aç → Ctrl+A, Ctrl+C → LinkedIn makale gövdesine Ctrl+V.

Dönüşüm kuralları:
- Sitedeki konuşma balonları röportaj biçimine iner: Murat'ın turları kalın, yapay zekâ düz.
- h2, blockquote, strong/em/a korunur. Site içi göreli linkler mutlak adrese çevrilir.
- Karikatür figürleri: mutlak URL'li <img> + italik alt yazı (LinkedIn görseli düşürürse elle ekle).
- Başa kulüp paragrafı + site linki, sona "ilk olarak ... yayımlandı" satırı eklenir.
"""
import io, os, re, sys, glob

SITE = "https://notimetohurry.com"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "kaynaklar", "linkedin")

KULUP = (
    '<p>Bir süredir "sakin yaşam" denen şeyin peşindeyim. Yirmi yedi yıl yazılımla geçti; hızın '
    'kullanıcısı değil, esiri olduğumu fark ettiğimde artık ellisini geçmiştim. Bunu bir kulüp gibi '
    'kurdum, adı bile hazır: Hiçbir Yere Yetişmeyenler Kulübü. Satılan bir şey yok, üyelik yok. '
    'Sadece bir adamın yavaşlamayı öğrenirken tuttuğu saha defteri.</p>'
)
DIYALOG_NOTU = '<p><strong>Kalın yazılar benim sorularım</strong>, gerisi yapay zekânın cevabı.</p>'
SITE_LINKI = (
    '<p>Bu yazının İngilizcesi, diğer yazılar ve kulübün geri kalanı burada: '
    f'<a href="{SITE}/tr/makaleler/index.html">notimetohurry.com</a></p>'
    '<p>Yavaş yavaş okuyun. Acele yok, biliyorsunuz.</p>'
)

def clean(t):
    t = re.sub(r"<img[^>]*>", "", t)
    return re.sub(r"\s+", " ", t).strip()

def absolutize(html, page_dir):
    def fix(m):
        href = m.group(1)
        if href.startswith(("http", "mailto", "#")):
            return m.group(0)
        path = os.path.normpath(os.path.join(page_dir, href)).replace("\\", "/")
        return f'href="{SITE}/{path}"'
    return re.sub(r'href="([^"]+)"', fix, html)

def convert(path):
    src = io.open(path, encoding="utf-8").read()
    page_dir = os.path.dirname(os.path.relpath(path, ROOT)).replace("\\", "/")
    title = clean(re.search(r"<h1>(.*?)</h1>", src, re.S).group(1))
    slug = os.path.splitext(os.path.basename(path))[0]
    body = src[src.index('<section style="padding-top:1rem;">'):src.index('<nav class="pager"')]

    # Konuşma turlarını yer tutucuya çevir
    turns = []
    def stash(m):
        kind = m.group(1)
        ps = [clean(p) for p in re.findall(r"<p[^>]*>(.*?)</p>", m.group(2), re.S)]
        turns.append((kind, ps))
        return f"\n@@TURN{len(turns)-1}@@\n"
    body = re.sub(r'<div class="turn (ask|answer)">\s*<div class="speaker">.*?</div>(.*?)</div>', stash, body, flags=re.S)

    out = []
    token = re.compile(
        r"@@TURN(\d+)@@|<h2>(.*?)</h2>|<blockquote>(.*?)</blockquote>|<figure[^>]*>(.*?)</figure>"
        r'|<p(?![^>]*class="muted")[^>]*>(.*?)</p>', re.S)
    for m in token.finditer(body):
        t, h2, bq, fig, p = m.groups()
        if t is not None:
            kind, ps = turns[int(t)]
            for x in ps:
                out.append(f"<p><strong>{x}</strong></p>" if kind == "ask" else f"<p>{x}</p>")
        elif h2 is not None:
            out.append(f"<h2>{clean(h2)}</h2>")
        elif bq is not None:
            out.append(f"<blockquote>{clean(bq)}</blockquote>")
        elif fig is not None:
            img = re.search(r'src="([^"]+)"', fig).group(1)
            img = SITE + "/" + os.path.normpath(os.path.join(page_dir, img)).replace("\\", "/")
            cap = re.search(r"<figcaption>(.*?)</figcaption>", fig, re.S)
            out.append(f'<p><img src="{img}" alt=""></p>')
            if cap:
                out.append(f"<p><em>{clean(cap.group(1))}</em></p>")
        elif p is not None:
            out.append(f"<p>{clean(p)}</p>")

    has_dialog = any(k == "ask" for k, _ in turns)
    head = KULUP + (DIYALOG_NOTU if has_dialog else "") + SITE_LINKI + "<hr>"
    tail = (
        "<hr>"
        f'<p><em>Bu yazı ilk olarak <a href="{SITE}/{page_dir}/{slug}.html">notimetohurry.com</a>\'da '
        "yayımlandı. Diğer yazılar ve yazının İngilizcesi orada.</em></p>"
    )
    html = absolutize(head + "\n" + "\n".join(out) + "\n" + tail, page_dir)

    doc = (
        '<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8">'
        f"<title>{title} — LinkedIn kopyası</title>"
        "<style>body{font:17px/1.6 Georgia,serif;max-width:44rem;margin:3rem auto;padding:0 1rem;color:#222}"
        "h2{font-size:1.4rem;margin-top:2.5rem}hr{border:0;border-top:1px solid #ccc;margin:2.5rem 0}"
        "blockquote{border-left:3px solid #ccc;margin:1.5rem 0;padding-left:1rem;font-style:italic}"
        "img{max-width:100%}a{color:#0a66c2}</style></head><body>\n"
        '<p style="background:#fff8d6;padding:.8rem 1rem;border:1px solid #e6d98a;font-family:sans-serif;font-size:.9rem">'
        f"KULLANIM: Ctrl+A, Ctrl+C; LinkedIn makale gövdesine Ctrl+V. Sonra bu sarı kutuyu sil. "
        f"Başlık: <b>{title}</b> (LinkedIn'in başlık alanına). Kapak görseli: yazının karikatürü. "
        "Gövdedeki görsel düşerse görsel düğmesiyle elle ekle.</p>\n"
        + html + "\n</body></html>"
    )
    os.makedirs(OUT_DIR, exist_ok=True)
    dst = os.path.join(OUT_DIR, f"{slug}-linkedin.html")
    io.open(dst, "w", encoding="utf-8").write(doc)
    print(f"{os.path.relpath(dst, ROOT)}  ({len(turns)} tur, {html.count('<p')} paragraf)")

if __name__ == "__main__":
    files = sys.argv[1:] or sorted(
        f for f in glob.glob(os.path.join(ROOT, "tr", "makaleler", "*.html")) if not f.endswith("index.html"))
    for f in files:
        convert(f)
