// Son 7 gun + linke gore tekillestirme.
//
// ONEMLI (3 Eyl 2026'da duzeltildi): bu node govde metnine KARISMAZ.
// Eskiden alti ayri alan arasindan "en uzun olani" secip sonucu yine
// 'content:encoded' adiyla geri yaziyordu. Iki sorun vardi:
//   1) Google News ogelerinde en uzun aday, yazinin metni degil <a href=...>
//      baglanti blogudur; gercek icerik onun altinda kaliyordu.
//      => Ekran: content:encoded alaninda "news.google.com/rss/articles/CBMi..." HTML'i.
//   2) Alan adi 'content:encoded' kaliyordu ama icinde description olabiliyordu;
//      asagi akista neyin ne oldugu anlasilmiyordu ve 02'deki bodyOf() gercek
//      adaylari hic goremiyordu (hepsi tek alana cokertilmisti).
// Artik butun govde alanlari OLDUGU GIBI geciriliyor; secimi 02-prepare yapar.

function guessFeed(link) {
  const u = String(link);
  if (u.includes('substack.com')) return 'Slow Living Collective';
  if (u.includes('onbetterliving.com')) return 'On Better Living';
  if (u.includes('realsimple.com')) return 'Real Simple';
  if (u.includes('businessinsider.com')) return 'Business Insider';
  if (u.includes('raptitude.com')) return 'Raptitude';
  if (u.includes('tinybuddha.com')) return 'Tiny Buddha';
  if (u.includes('nosidebar.com')) return 'No Sidebar';
  if (u.includes('medium.com')) return 'Medium';
  if (u.includes('news.google.com')) return 'Google News';
  try {
    return new URL(u).hostname.replace(/^www\./, '');
  } catch (e) {
    return 'Diğer';
  }
}

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const cutoff = Date.now() - WEEK_MS;
const MAX = 40000;

function pubMs(j) {
  const t = new Date(j.isoDate || j.pubDate || '').getTime();
  return Number.isNaN(t) ? null : t;
}

// Orijinali kirpar ama DEGISTIRMEZ; alan adi korunur.
function passthrough(v) {
  if (typeof v !== 'string') return '';
  return v.length > MAX ? v.slice(0, MAX) : v;
}

const seen = new Set();
const out = [];

for (const item of $input.all()) {
  const j = item.json || {};
  const link = String(j.link || j.guid || '');
  if (!link || seen.has(link)) continue;
  const ms = pubMs(j);
  if (ms == null || ms < cutoff) continue;
  seen.add(link);

  out.push({
    json: {
      feed: guessFeed(link),
      title: j.title || '(başlıksız)',
      link,
      guid: j.guid || '',
      pubDate: j.pubDate || '',
      isoDate: j.isoDate || '',
      creator: j.creator || j['dc:creator'] || '',

      // Govde alanlarinin TAMAMI, oldugu gibi. Secimi 02-prepare yapar.
      'content:encoded': passthrough(j['content:encoded']),
      'content:encodedSnippet': passthrough(j['content:encodedSnippet']),
      content: passthrough(j.content),
      contentSnippet: passthrough(j.contentSnippet),
      summary: passthrough(j.summary),
      description: passthrough(j.description),
    },
  });
}

if (!out.length) {
  return [{ json: { emptyWeek: true } }];
}
return out;
