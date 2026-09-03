// Her oge icin ayri bir LLM istemi hazirlar.
// Dogrudan feed'ler content:encoded ile tam metni tasir -> ayrintili aktarim.
// Google News ogelerinde govde yoktur -> yalnizca baslik cevirisi.

function stripHtml(h) {
  if (!h || typeof h !== 'string') return '';
  let s = h
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|h[1-6]|li|tr|blockquote)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ');
  s = s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#8217;|&rsquo;|&#39;|&#8216;|&lsquo;/g, "'")
    .replace(/&#8220;|&ldquo;|&#8221;|&rdquo;/g, '"')
    .replace(/&#8212;|&mdash;/g, '-')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#\d+;/g, ' ')
    .replace(/&[a-z]+;/gi, ' ');
  return s.replace(/[ \t ]+/g, ' ').replace(/\n{2,}/g, '\n').trim();
}

function bodyOf(j) {
  const cands = [
    j['content:encodedSnippet'],
    j['content:encoded'],
    j.contentSnippet,
    j.content,
    j.summary,
    j.description,
  ];
  let best = '';
  for (const c of cands) {
    const t = stripHtml(typeof c === 'string' ? c : '');
    if (t.length > best.length) best = t;
  }
  return best;
}

function publisherOf(link) {
  try {
    const h = new URL(link).hostname.replace(/^www\./, '');
    return h;
  } catch (e) {
    return '';
  }
}

const items = $input.all();
if (!items.length || (items.length === 1 && items[0].json && items[0].json.emptyWeek === true)) {
  return [{ json: { emptyWeek: true, hasArticles: false } }];
}

const KURALLAR =
  'Kurallar: Markdown kullanma, kod citi (```) kullanma, etiketleri degistirme, etiket adlarini aynen yaz. ' +
  'Turkce harfleri dogru kullan (s, g, u, o, c, i, I). Bilgi yoksa ilgili satira "yok" yaz.';

const ETIKETLER =
  'TR_BASLIK: <yazinin Turkce basligi, en fazla 12 kelime>\n' +
  'TUR: <kisisel deneme / haber / rehber / arastirma / urun tanitimi / gorus>\n' +
  'KIMIN_ICIN: <yazi kimi muhatap aliyor, tek cumle>\n' +
  'TEZ: <yazinin ana iddiasi, 1-2 cumle>\n' +
  'AKTARIM: <200-320 kelime akici Turkce. Yazinin soylediklerini kendi cumlelerinle aktar; kisi, yer ve kurum adlarini koru. Ceviri degil aktarim.>\n' +
  'SAYILAR: <metinde gecen somut rakam, fiyat, tarih, yuzde, sure. Madde madde. Yoksa: yok>\n' +
  'SESSIZLIK: <yazinin degimedigi ama konu acisindan onemli bir nokta varsa tek cumle. Yoksa: yok>\n' +
  'DEGER: <bu yazi yavas yasam uzerine bir seyir defteri icin kayda deger mi ve neden? 1-2 cumle. Durust ol, zayifsa zayif de.>';

const out = [];
for (const it of items) {
  const j = it.json || {};
  const link = String(j.link || '');
  const isGN = /news\.google\.com/.test(link);

  let title = String(j.title || '').trim();
  let publisher = publisherOf(link);
  const tm = title.match(/^(.*\S)\s+-\s+([^-]{2,45})$/);
  if (isGN && tm) {
    title = tm[1].trim();
    publisher = tm[2].trim();
  }

  let body = bodyOf(j);
  // Google News'te govde çogu zaman basligin tekrari; ise yaramaz say
  if (isGN && body.length < title.length + 160) body = '';
  if (body.length > 9000) body = body.slice(0, 9000);

  const tamMetin = body.length >= 400;

  const userPrompt = tamMetin
    ? [
        'Sen bir yavas yasam (slow living) arastirma kulubunun editor yardimcisisin.',
        'Asagidaki yazinin TAM METNI elinde. Editorun yaziyi acmadan icerigi bilmesini ve siteye alip almayacagina karar verebilmesini istiyoruz.',
        '',
        'Su etiketleri AYNEN, her biri yeni satirda kullan:',
        ETIKETLER,
        '',
        KURALLAR,
        '',
        'ORIJINAL BASLIK: ' + title,
        'KAYNAK: ' + (publisher || 'bilinmiyor'),
        'METIN:',
        body,
      ].join('\n')
    : [
        'Sen bir yavas yasam (slow living) arastirma kulubunun editor yardimcisisin.',
        'Bu oge icin YALNIZCA BASLIK elimizde; yazinin govdesi akista gelmiyor. Uydurma, sadece basliktan cikarabilecegini yaz.',
        '',
        'Su etiketleri AYNEN, her biri yeni satirda kullan:',
        'TR_BASLIK: <baslikin Turkce karsiligi, en fazla 12 kelime>',
        'TUR: <basliktan anlasilan tur; emin degilsen: belirsiz>',
        'KIMIN_ICIN: yok',
        'TEZ: <baslikin ima ettigi iddia, tek cumle>',
        'AKTARIM: Govde metni akista gelmedigi icin ayrintili aktarim yapilamadi.',
        'SAYILAR: yok',
        'SESSIZLIK: yok',
        'DEGER: <baslik yavas yasam seyir defteri icin ilgi cekici mi, tek cumle>',
        '',
        KURALLAR,
        '',
        'ORIJINAL BASLIK: ' + title,
        'KAYNAK: ' + (publisher || 'bilinmiyor'),
      ].join('\n');

  out.push({
    json: {
      title,
      link,
      publisher,
      pubDate: j.pubDate || j.isoDate || '',
      isoDate: j.isoDate || '',
      creator: j.creator || j['dc:creator'] || '',
      tamMetin,
      govdeUzunluk: body.length,
      hasArticles: true,
      userPrompt,
    },
  });
}

return out;
