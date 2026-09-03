// Son 7 gun + linke gore tekillestirme.
// ONEMLI: govde metni icin content:encoded* ONCE denenir; Substack/WordPress'te
// j.content kisa tanitimdir, tam metin content:encoded icindedir.

function guessFeed(link) {
  const u = String(link);
  if (u.includes('substack.com')) return 'Slow Living Collective';
  if (u.includes('onbetterliving.com')) return 'On Better Living';
  if (u.includes('realsimple.com')) return 'Real Simple';
  if (u.includes('businessinsider.com')) return 'Business Insider';
  if (u.includes('news.google.com')) return 'Google News';
  try {
    return new URL(u).hostname.replace(/^www\./, '');
  } catch (e) {
    return 'Diğer';
  }
}

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const cutoff = Date.now() - WEEK_MS;

function pubMs(j) {
  const t = new Date(j.isoDate || j.pubDate || '').getTime();
  return Number.isNaN(t) ? null : t;
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

  // En uzun govde adayini sec (ham HTML olarak birak, ayiklamayi Prepare yapar)
  let govde = '';
  for (const c of [
    j['content:encodedSnippet'],
    j['content:encoded'],
    j.contentSnippet,
    j.content,
    j.summary,
    j.description,
  ]) {
    if (typeof c === 'string' && c.length > govde.length) govde = c;
  }
  if (govde.length > 40000) govde = govde.slice(0, 40000);

  out.push({
    json: {
      feed: guessFeed(link),
      title: j.title || '(başlıksız)',
      link,
      guid: j.guid || '',
      pubDate: j.pubDate || '',
      isoDate: j.isoDate || '',
      creator: j.creator || j['dc:creator'] || '',
      'content:encoded': govde,
    },
  });
}

if (!out.length) {
  return [{ json: { emptyWeek: true } }];
}
return out;
