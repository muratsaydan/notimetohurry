// Radar kaynaklari — uc katman. Katman, ne kadar ayrinti uretilebilecegini belirler.
// Kural: Radar sayfasinda kaydi yayimlanan her kaynagin akisi buraya eklenir.

return [
  // === 1) TAM METIN (content:encoded) — ayrintili Turkce aktarim uretilebilir ===
  { json: { feed: 'Raptitude', url: 'https://www.raptitude.com/feed/' } },
  { json: { feed: 'Tiny Buddha', url: 'https://tinybuddha.com/feed/' } },
  { json: { feed: 'Slow Living Collective', url: 'https://theslowlivingcollective.substack.com/feed' } },
  // On Better Living: site Cloudflare arkasinda. 403 gelirse bu satiri silip
  // asagidaki Google News yedegini ac (yedek yalnizca baslik verir).
  { json: { feed: 'On Better Living', url: 'https://onbetterliving.com/feed/' } },
  // { json: { feed: 'On Better Living', url: 'https://news.google.com/rss/search?q=%22slow+living%22+OR+%22slow+travel%22+OR+%22cost+of+living%22+site:onbetterliving.com&hl=en&gl=US&ceid=US:en' } },

  // === 2) TANITIM METNI (~500-700 karakter) — kisa ozet, link gercek adres ===
  { json: { feed: 'Medium — slow living', url: 'https://medium.com/feed/tag/slow-living' } },
  { json: { feed: 'No Sidebar', url: 'https://nosidebar.com/feed/' } },

  // === 3) GOVDESIZ — yalnizca baslik taramasi ===
  // Google News linkleri (CBMi...) gercek adrese cozulemiyor; tam metin gelmez.
  { json: { feed: 'Google News (EN)', url: 'https://news.google.com/rss/search?q=slow+living&hl=en&gl=US&ceid=US:en' } },
  { json: { feed: 'Real Simple (slow living)', url: 'https://news.google.com/rss/search?q=%22slow+living%22+OR+%22slow+life%22+OR+%22simple+living%22+site:realsimple.com&hl=en&gl=US&ceid=US:en' } },
  { json: { feed: 'Business Insider (slow living)', url: 'https://news.google.com/rss/search?q=%22slow+living%22+OR+%22slow+travel%22+OR+%22I+moved+to%22+site:businessinsider.com&hl=en&gl=US&ceid=US:en' } }
];
