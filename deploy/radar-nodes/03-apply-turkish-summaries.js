// LLM ciktisini duz metin olarak ayristirir. JSON'a hic guvenmiyoruz:
// model kod citi ekleyebiliyor ve ic tirnaklari kacirmadigi icin JSON.parse kiriliyordu.

const ETIKETLER = ['TR_BASLIK', 'TUR', 'KIMIN_ICIN', 'TEZ', 'AKTARIM', 'SAYILAR', 'SESSIZLIK', 'DEGER'];

function bolum(metin, etiket) {
  const i = ETIKETLER.indexOf(etiket);
  const sonrakiler = ETIKETLER.slice(i + 1);
  const ileri = sonrakiler.length ? '(?=\\n\\s*(?:' + sonrakiler.join('|') + ')\\s*:)|$' : '$';
  const re = new RegExp(etiket + '\\s*:\\s*([\\s\\S]*?)(?:' + ileri + ')', 'i');
  const m = metin.match(re);
  if (!m) return '';
  return String(m[1])
    .replace(/^[\s*#>-]+/, '')
    .replace(/\s+$/, '')
    .replace(/^```[a-z]*\s*/i, '')
    .replace(/```\s*$/, '')
    .trim();
}

const kaynak = $('Prepare LLM prompt').all();
const ciktilar = $input.all();

return ciktilar.map((o, i) => {
  const j = (kaynak[i] && kaynak[i].json) || {};
  const oj = o.json || {};
  let metin = oj.text || oj.response || oj.output || '';
  if (typeof metin !== 'string') metin = JSON.stringify(metin);
  metin = metin.replace(/^\s*```[a-z]*\s*/i, '').replace(/```\s*$/, '');

  const trBaslik = bolum(metin, 'TR_BASLIK');
  const aktarim = bolum(metin, 'AKTARIM');

  return {
    json: {
      ...j,
      userPrompt: undefined,
      trBaslik: trBaslik || j.title || '(baslik cevrilemedi)',
      tur: bolum(metin, 'TUR'),
      kiminIcin: bolum(metin, 'KIMIN_ICIN'),
      tez: bolum(metin, 'TEZ'),
      aktarim: aktarim || 'Aktarim uretilemedi.',
      sayilar: bolum(metin, 'SAYILAR'),
      sessizlik: bolum(metin, 'SESSIZLIK'),
      deger: bolum(metin, 'DEGER'),
      llmHam: metin.length,
      llmBasarili: Boolean(trBaslik),
    },
  };
});
