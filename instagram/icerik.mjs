/* ============================================================
   Instagram içerik dosyası — Hiçbir Yere Yetişmeyenler Kulübü
   Buradaki her şey sitedeki yazılardan çıkarıldı. Yeni gönderi
   eklemek için diziye yeni bir nesne yaz, sonra: node uret.mjs
   Metin alanlarında ` kullanma (hepsi template literal).
   ============================================================ */

export const hesap = {
  kullaniciAdi: `hicbiryereyetismeyenlerkulubu`,
  isim: `Hiçbir Yere Yetişmeyenler`,            // 30 karakter sınırı — aramada bu alan taranır
  kategori: `Kişisel blog`,
  baglanti: `https://notimetohurry.com`,
  bio: [
    `Sakin yaşam felsefesini araştıran, deneyen ve`,
    `dürüstçe sorgulayan bir seyir defteri.`,
    `Guru yok, ajanda yok. Kulübün tek üyesi benim.`,
    `Yer var ↓`,
  ].join(`\n`),
  oneCikanlar: [
    { ad: `kulüp`,       simge: `¶`, zemin: `zemin-koyu` },
    { ad: `sakin yaşam`, simge: `≈`, zemin: `` },
    { ad: `duraklar`,    simge: `§`, zemin: `zemin-alt` },
    { ad: `karikatür`,   simge: `☺`, zemin: `` },
    { ad: `ben`,         simge: `M`, zemin: `zemin-koyu` },
  ],
};

const ETIKET = [
  `#sakinyaşam`, `#slowliving`, `#yavaşyaşam`, `#hiçbiryereyetişmeyenlerkulübü`,
  `#notimetohurry`, `#felsefe`, `#dijitalminimalizm`, `#zamanınıgerial`,
];

export const gonderiler = [

/* ---------------------------------------------------------- 01 */
{
  id: `01-acilis`,
  ad: `Açılış — bu kulüp ne?`,
  tip: `karusel`,
  etiketler: ETIKET,
  slaytlar: [
    { tur: `kapak`, zemin: ``, eyebrow: `hiçbir yere yetişmeyenler kulübü`,
      baslik: `Acele edecek<br><em>vaktim</em> yok.`,
      kicik: `Kulübün şu anki tek üyesi benim.`, kaydir: `kaydır →` },

    { tur: `gorsel`, zemin: `zemin-alt`, eyebrow: `nerede duruyorum`,
      ara: `Kaçmak değil — <em>durmak.</em>`,
      src: `koala.jpg`,
      alt: `Gökdelenler, trafik ve kalabalığın tam ortasında, bir binanın çatısında huzurla meditasyon yapan bir koala.`,
      caption: `Şehir aynı hızda akıyor. Değişen tek şey, artık koşmuyor olmam.` },

    { tur: `metin`, zemin: ``, ara: `Burası ne?`,
      govde: [
        `Sakin yaşam felsefesini <strong>araştıran, deneyen ve dürüstçe sorgulayan</strong> bir seyir defteri.`,
        `Okuduklarımı, ikna olmadığım yerleri ve tökezlediğim yerleri buraya yazıyorum.`,
      ] },

    { tur: `metin`, zemin: `zemin-alt`, ara: `Burası ne <em>değil?</em>`,
      govde: [
        `Guru değilim, koçluk yapmıyorum, satacak bir şeyim yok. Kimseye "şöyle yaşa" demiyorum.`,
        `Kendi üzerimde bir deney yapıyorum; sadece ölçümleri paylaşıyorum.`,
      ] },

    { tur: `kapanis`, zemin: `zemin-koyu`,
      baslik: `Yazıların tamamı defterde.`,
      link: `notimetohurry.com`,
      kicik: `Acele yok zaten.` },
  ],
  metin: `Ben Murat. 1971 doğumluyum, 27 yıldır yazılım işindeyim.

Geçen yıl bir yapay zekâ eğitiminin ortasında, yıllarımı vererek öğrendiğim şeylerin saniyeler içinde önüme konduğunu gördüm. Kendimi fiber optik kablolarla koşu yarışına girmiş bir dinozor gibi hissettim.

Sonra şunu fark ettim: sorun makinenin hızında değil. Sorun, o hızı bir başarı ölçüsü sanıp kendime dayatmamda.

Bir yazılımcı bir şeye karar verdiğinde ne yapar? Tabii ki site açtım.

Hiçbir Yere Yetişmeyenler Kulübü — sakin yaşam felsefesini araştırdığım, denediğim ve dürüstçe sorguladığım bir seyir defteri. Ticari amacım yok, gizli ajandam yok, büyük iddialarım yok.

Kulübün şu anki tek üyesi benim. Yer var.`,
},

/* ---------------------------------------------------------- 02 */
{
  id: `02-rosa`,
  ad: `Alıntı — Hartmut Rosa`,
  tip: `tek`,
  etiketler: ETIKET,
  slaytlar: [
    { tur: `alinti`, zemin: `zemin-koyu`, eyebrow: `hızın zıddı ne?`,
      alinti: `Hızın asıl zıddı yavaşlık değil — bağ kurmak.`,
      kaynak: `Hartmut Rosa · sosyolog` },
  ],
  metin: `Alman sosyolog Hartmut Rosa'nın bu tespiti, bu kulübü kurarken kafamdaki en büyük düğümü çözdü.

Modern hayatın bizi yorması hızından değil; o hızın bizi dünyaya yabancılaştırmasından. Her şey "halledilecek bir iş"e dönüşünce manzara da, kahve de, insanlar da sadece bir yapılacaklar listesi maddesi oluyor.

Yani mesele daha yavaş yürümek değil. Mesele, bir şeyle gerçekten temas edebilmek.

Akıntının hızını yavaşlatamayız. Ama akıntının içinde sağlam bir kaya gibi durabiliriz.`,
},

/* ---------------------------------------------------------- 03 */
{
  id: `03-ne-degildir`,
  ad: `Sakin yaşam ne değildir?`,
  tip: `karusel`,
  etiketler: ETIKET,
  slaytlar: [
    { tur: `kapak`, zemin: `zemin-alt`, eyebrow: `önce şunu netleştirelim`,
      baslik: `Sakin yaşam ne <em>değildir?</em>`, kaydir: `kaydır →` },

    { tur: `metin`, zemin: ``, ara: `Köye yerleşmek değildir.`,
      govde: [`İşimiz var, şehirde yaşıyoruz, teknolojiyle ekmek kazanıyoruz. Herkesin bir zeytinliği yok — buna gerek de yok.`],
      kicik: `Sakin yaşam bir coğrafya değil, bir ilişki.` },

    { tur: `metin`, zemin: ``, ara: `Tembellik değildir.`,
      govde: [`Yavaşlık bir hız değil, bir <strong>vites</strong>. Neyi ne hızda yapacağına kendin karar verirsin: bazı şeyleri hızlandırırsın, bazılarını acele etmeden yaşarsın.`] },

    { tur: `metin`, zemin: ``, ara: `Teknoloji düşmanlığı değildir.`,
      govde: [`Düşman değil — ama efendi de değil. Faydalanırsın, işin bitince fişini çekersin.`],
      kicik: `Bu defteri, dünyayı hızlandıran şeyin ta kendisine sora sora tutuyorum.` },

    { tur: `kapanis`, zemin: `zemin-koyu`,
      baslik: `Peki <em>nedir?</em>`,
      kicik: `İşin, şehrin ve ekranların tam ortasında kalıp, o gürültünün içinde kendi ritmini kaybetmemek.`,
      link: `notimetohurry.com` },
  ],
  metin: `Bu listeyi başkasına ders olsun diye değil, kendime hatırlatmak için yazdım.

Çünkü "sakin yaşam" deyince akla hep aynı sahne geliyor: her şeyi bırak, bir zeytinliğe yerleş, telefonu denize at. Kulağa güzel geliyor ama çoğumuz için gerçekçi değil.

Bir de şunu dürüstçe söyleyeyim: bu felsefenin en zayıf yanı, kolayca bir "lüks"e ya da statü göstergesine dönüşebilmesi. Pahalı organik ürünler, güzel filtreli bir yavaşlık pazarlaması. Ona dikkat.

Sen bu dördünden hangisini duymaktan yoruldun?`,
},

/* ---------------------------------------------------------- 04 */
{
  id: `04-dinozor`,
  ad: `Karikatür — koşu bandındaki dinozor`,
  tip: `tek`,
  etiketler: ETIKET,
  slaytlar: [
    { tur: `gorsel`, zemin: ``, eyebrow: `ilk yazıdan`,
      ara: `Koşu bandında ne kadar hızlı koşarsan koş, vardığın yer hep aynı.`,
      src: `dinozor-kosu-bandi.jpg`,
      alt: `Koşu bandında koşan ama hiçbir yere varamayan, nefes nefese kalmış bir dinozor; yanından yapay zekâ robotu vınlayıp geçiyor.`,
      caption: `Makine hızlanıyor, ben yetişmeye çalışıyorum. İkimiz de tam olarak aynı yerde kalıyoruz.` },
  ],
  metin: `Bir yapay zekâ eğitiminin ortasında sandalyeye çöktüğüm anı tek kelimeyle özetleyeyim: yetersizlik.

İşin komik tarafı, ben hayatını teknolojiden kazanan biriyim. İstatistiksel olarak kendimi bir "öncü" hissetmem gerekirdi. Tam tersine — kendimi fiber optik kablolarla yarışa girmiş bir dinozor gibi hissettim.

Bizim en büyük hatamız şu: kalp atışımızı işlemcinin saat hızına senkronlamaya çalışıyoruz.

Makine hızlanabilir, bu onun doğası; hızlansın. Sorun makinenin hızında değil, o hızı bir başarı ölçütü sanıp kendimize dayatmamızda.

Koşu bandında ne kadar hızlı koşarsan koş, vardığın yer hep aynı: bulunduğun yer.`,
},

/* ---------------------------------------------------------- 05 */
{
  id: `05-dis-agrisi`,
  ad: `Epikuros — diş ağrısı`,
  tip: `karusel`,
  etiketler: ETIKET,
  slaytlar: [
    { tur: `kapak`, zemin: ``, eyebrow: `epikuros · mö 300`,
      baslik: `Hayatının en güzel anı pasta değildir.`, kaydir: `kaydır →` },

    { tur: `diyalog`, zemin: ``, eyebrow: `oturumdan`,
      soru: `Peki Epikuros "haz" derken tam olarak neyi kastediyordu?`,
      cevap: [
        `Çok basit bir gözlemle başlıyor: kendine dikkatli bak, aslında hazzın peşinde koşmuyorsun — <strong>rahatlamanın</strong> peşinde koşuyorsun.`,
        `Açsın diyelim. Canın ziyafet istemiyor, canın <strong>açlığın bitmesini</strong> istiyor. Bir dilim ekmek onu bitiriyor.`,
      ] },

    { tur: `kapanis`, zemin: `zemin-koyu`,
      baslik: `…<em>diş ağrının geçtiği andır.</em>`,
      kicik: `Pasta bir şey ekler; ağrının kesilmesi bir şey çıkarır. Mutluluk dediğimiz şey büyük ölçüde o çıkarma işlemi.` },
  ],
  metin: `İyi hayat üstüne bir şeyler yığarak kurulmuyor; seni kemiren şeyleri teker teker susturarak kuruluyor.

Tıpkı sağlık gibi. Sağlık hissettiğin bir şey değil — hastalığın yokluğu. Ancak kaybedince fark ediyorsun.

Bu cümleyi ilk okuduğumda kalkıp uzun süre gezindim. Çünkü ben hayatım boyunca "eklemeyi" çalıştım: bir tanenin üstüne ikinciyi, üçüncüyü.

Epikuros bunu MÖ 300'de, ortada bildirim sesi diye bir şey yokken söylemiş.

Bugün seni kemiren şeylerden hangisini susturabilirsin?`,
},

/* ---------------------------------------------------------- 06 */
{
  id: `06-kaplumbaga-cita`,
  ad: `Karikatür — kaplumbağa ve çita`,
  tip: `tek`,
  etiketler: ETIKET,
  slaytlar: [
    { tur: `gorsel`, zemin: `zemin-alt`, eyebrow: `roller değişebiliyor`,
      ara: `Yavaşlık bir tür değil, bir <em>karar.</em>`,
      src: `kaplumbaga-cita.jpg`,
      alt: `Stresli, koşuşturan bir kaplumbağa; karşısında yoga pozunda, kafası dank etmiş huzurlu bir çita.`,
      caption: `Bazen en hızlı olanımız en sakinimiz oluveriyor.` },
  ],
  metin: `Yavaşlık bir tür değil, bir karar.

Doğuştan hızlı olan da sakin olabiliyor; doğuştan yavaş olan da kendini yetişemediği bir yarışın içinde bulabiliyor. Kaplumbağa olmak seni otomatik olarak huzurlu yapmıyor.

Ben kendimi uzun süre kaplumbağa sandım. Meğer koşu bandındaki kaplumbağaymışım.

Sen hangisisin — nefes nefese kaplumbağa mı, yoga pozundaki çita mı?`,
},

/* ---------------------------------------------------------- 07 */
{
  id: `07-slow-food`,
  ad: `Slow Food — bir tabak makarna`,
  tip: `karusel`,
  etiketler: ETIKET,
  slaytlar: [
    { tur: `kapak`, zemin: `zemin-alt`, eyebrow: `roma · 1986`,
      baslik: `Her şey bir tabak makarnayla başladı.`, kaydir: `kaydır →` },

    { tur: `metin`, zemin: ``, ara: `Olay yeri: İspanyol Merdivenleri`,
      govde: [
        `Merdivenlerin dibine bir McDonald's açılıyor. Carlo Petrini adında bir İtalyan buna fena bozuluyor.`,
        `Ama pankartla değil, cam kırarak değil — elinde bir <strong>tabak makarnayla</strong>.`,
      ],
      kicik: `1989'da Paris'te bir manifesto imzalanıyor; hareket resmen doğuyor.` },

    { tur: `metin`, zemin: ``, ara: `Derdi hamburger değildi.`,
      govde: [
        `Petrini'yi çıldırtan şey <strong>tektipleşmeydi</strong>. Roma'da da Tokyo'da da ısırdığın hamburger birebir aynı tadıyorsa; ninenin tarifi, o vadinin üzümü, o köyün peyniri teker teker yok olur.`,
        `Onun için "hız" hiç dakikayla ilgili değildi: bizi yemeğe, yere ve birbirimize bağlayan ipleri koparan her şeydi.`,
      ] },

    { tur: `gorsel`, zemin: ``, eyebrow: `slow food · 1989`,
      ara: `Amblem olarak bir salyangoz seçtiler.`,
      src: `salyangoz-tavsan.jpg`,
      alt: `Kasklı, alev kabuklu bir salyangoz elinde gazetesiyle poz veriyor; podyumda şampiyon kaplumbağa, ikincilikte şaşkın tavşan.`,
      caption: `Acelesi olmayanın kaybedecek bir yarışı da yoktur.` },

    { tur: `kapanis`, zemin: `zemin-koyu`,
      baslik: `Bizim kulübün adı ne?`,
      kicik: `"Hiçbir Yere Yetişmeyenler." Meğer farkında olmadan koca bir salyangozun hayat düsturunu ad yapmışız.`,
      link: `notimetohurry.com` },
  ],
  metin: `Sakin yaşam havalı, kocaman bir felsefe olarak başlamamış. Bir tabakla, bir salyangozla, çok somut bir "dur bakalım"la başlamış.

Petrini'yi ilginç yapan şu: adam bir perhiz bekçisi değildi, keyfe bayılırdı. Tezi şuydu — gerçek keyif, yediğinin iyi, temiz ve adil olduğunu bilmekten geçer. Yani hazzı reddetmedi; hazzı sorumlulukla evlendirdi.

Bu bana iyi geldi: demek ki bu işe girmek için önce filozof olmak gerekmiyormuş.

Bir tabaktan koca bir aile türemiş — yavaş şehirler, yavaş moda, yavaş yaşam.`,
},

/* ---------------------------------------------------------- 08 */
{
  id: `08-lathe-biosas`,
  ad: `Lathe biosas — fark edilmeden yaşa`,
  tip: `tek`,
  etiketler: ETIKET,
  slaytlar: [
    { tur: `alinti`, zemin: `zemin-koyu`, eyebrow: `epikuros · mö 300`,
      alinti: `<em>Lathe biosas</em> — fark edilmeden yaşa.`,
      kaynak: `kişisel marka çağına not` },
  ],
  metin: `Bunu Instagram'da paylaşmanın komikliğinin farkındayım.

Epikuros, huzursuzluğumuzun neredeyse tamamının şu kovadan geldiğini söylüyor: şöhret, servet, statü, adam yerine konmak. Kötü oldukları için değil — dipsiz oldukları için. Kimse bir gün "tamam, yeterince tanınıyorum" demiyor.

Ve tavsiyesi bu: görünürlüğün peşinden koşma.

Peki ben burada ne arıyorum? Dürüst cevap: kendi çelişkimi taşıyorum. Bu hesabın işi seni burada tutmak değil. Bir cümle bırakıp seni telefondan kaldırabilirse görevini yapmış olacak.

Şimdi kapat gitsin.`,
},

/* ---------------------------------------------------------- 09 */
{
  id: `09-kontrol-ayrimi`,
  ad: `Stoacılar — kontrol ayrımı`,
  tip: `karusel`,
  etiketler: ETIKET,
  slaytlar: [
    { tur: `kapak`, zemin: ``, eyebrow: `ilk durak: stoacılar`,
      baslik: `Bu benim <em>elimde mi</em>, değil mi?`, kaydir: `kaydır →` },

    { tur: `metin`, zemin: ``, ara: `Epiktetos'un ayrımı`,
      govde: [
        `Bir yanda tamamen bizim elimizde olanlar: düşüncelerimiz, tepkilerimiz, kararlarımız.`,
        `Öbür yanda hiç elimizde olmayanlar: hava, trafik, geçmiş, başkasının bizim hakkımızda ne düşündüğü.`,
      ],
      kicik: `Yağmura kızmak kadar beyhude bir şey yok — ama gün boyu hepimiz yağmura kızıp duruyoruz.` },

    { tur: `metin`, zemin: `zemin-alt`, ara: `Ama bir sınırı var.`,
      govde: [
        `Deprem ülkesinde yaşadığımı kabullenmek akıllıca bir Stoacılık.`,
        `Kumluk zemine yirmi katlı bina dikip "gerisi kaderdir" demek Stoacılık <strong>değil</strong>; tembelliğin kadere kılıflanmış hâli.`,
      ] },

    { tur: `kapanis`, zemin: `zemin-koyu`,
      baslik: `İş, aleti nerede kullanacağını bilmekte.`,
      kicik: `Gerçekten elinde olmayana sükûnetle razı olmak — ama elinde olanı da "sükûnet" bahanesiyle savsaklamamak.` },
  ],
  metin: `Stoacılık bana bir "yaşam dini" gibi değil, bir alet gibi mantıklı geliyor.

O tek soru — "bu benim elimde mi, değil mi?" — günlük kaygının yarısını daha en baştan eliyor. Bu tarafı fena hâlde işime yarıyor.

Ama eleştirenler de haksız değil: bu felsefe bir alet olmaktan çıkıp "her şeyin cevabı" hâline gelince tehlikeye giriyor. Değiştirebileceğin şeyleri "kaderdir" diye bırakmana bahane olabiliyor.

Aynı felsefenin hem bir imparatora, hem sürgündeki bir devlet adamına, hem de eskiden köle olan birine hitap edebilmesi bu yüzden ilginç. Sarayda da işe yaramış, dibe vurmuşken de.`,
},

/* ---------------------------------------------------------- 10 */
{
  id: `10-deadline`,
  ad: `Karikatür — doğanın deadline'ı yok`,
  tip: `tek`,
  etiketler: ETIKET,
  slaytlar: [
    { tur: `gorsel`, zemin: ``, eyebrow: `elinde çekiç olan…`,
      ara: `Doğanın deadline'ı yok.`,
      src: `saksi-deadline.jpg`,
      alt: `Sakallı bir adam, bir elinde kronometre bir elinde büyüme grafiği, minicik bir filize sinirleniyor.`,
      caption: `Analitik bir zihin, doğanın takvimiyle tanışıyor.` },
  ],
  metin: `Elinde çekiç olan her şeyi çivi görür.

Ben 27 yıldır her şeyi otomatize etmeye çalışan bir adamım. Nereye baksam "bunu nasıl hızlandırırım" diye düşünüyorum. Sonra bir saksının başına geçip kronometre tutuyorum.

Doğanın deadline'ı yok. Filiz senin çeyrek hedefini umursamıyor.

Bu karikatürü kızdığım şeyi anlattığı için değil, beni anlattığı için astım.`,
},

/* ---------------------------------------------------------- 11 */
{
  id: `11-seneca-zaman`,
  ad: `Seneca — zamana cömertlik`,
  tip: `karusel`,
  etiketler: ETIKET,
  slaytlar: [
    { tur: `alinti`, zemin: `zemin-koyu`, eyebrow: `hayatın kısalığı üzerine`,
      alinti: `Hayat kısa değil; biz onun büyük kısmını boşa harcıyoruz.`,
      kaynak: `Seneca · yaklaşık MS 49` },

    { tur: `metin`, zemin: ``, ara: `Tokat gibi örneği şu:`,
      govde: [
        `Malımıza mülkümüze cimriyiz; kimseye beş kuruş kaptırmayız.`,
        `Ama zamanımızı herkese cömertçe dağıtırız — boş toplantılara, başkalarının hırslarına.`,
      ] },

    { tur: `kapanis`, zemin: `zemin-alt`,
      baslik: `Biri paranı çalsa ayağa kalkarsın.`,
      kicik: `Ömrünü çalana pek ses çıkarmazsın. Seneca bunu iki bin yıl önce yazmış; sanki bugünü anlatıyor.` },
  ],
  metin: `Bu mektubu okurken en çok şuraya takıldım: Seneca bunu iki bin yıl önce yazmış. Ortada ne bildirim vardı, ne sonsuz akış.

Demek ki sorun aletlerde değil, bizim zamanla kurduğumuz ilişkide. Alet sadece işi kolaylaştırmış.

Bugün zamanını en cömert kime dağıttın?`,
},

/* ---------------------------------------------------------- 12 */
{
  id: `12-herculaneum`,
  ad: `Külün içinden geri gelen kitap`,
  tip: `karusel`,
  etiketler: ETIKET,
  slaytlar: [
    { tur: `kapak`, zemin: `zemin-koyu`, eyebrow: `25 haziran 2026`,
      baslik: `İki bin yıl açılamayan bir rulo, bu yıl okundu.`, kaydir: `kaydır →` },

    { tur: `metin`, zemin: ``, ara: `Vezüv, MS 79`,
      govde: [
        `Herculaneum küllerin altında kalıyor. Bir villanın kütüphanesindeki yüzlerce papirüs rulosu karbonlaşıyor.`,
        `İki bin yıl boyunca hiç açılamıyorlar; açmaya kalkan herkes elindekini ufalıyor.`,
      ] },

    { tur: `metin`, zemin: `zemin-alt`, ara: `Sonra röntgen ve yapay zekâ.`,
      govde: [
        `Rulolardan biri <strong>hiç açılmadan</strong>, katman katman taranarak baştan sona okundu.`,
        `Çıkan metin, Epikurosçu Philodemos'un "Tanrılar Üzerine" adlı eserinin sekizinci kitabıydı — varlığı bile bilinmeyen bir cilt.`,
      ] },

    { tur: `gorsel`, zemin: ``, eyebrow: `adı çalınan adam`,
      ara: `Bugün "epikürien" ne demek?`,
      src: `epikuros-kapida.jpg`,
      alt: `Üzerinde EPİKÜR — Fine Dining yazan şık bir lokantanın kapısında, kaba tunikli Epikuros içeri alınmıyor.`,
      caption: `İki bin yıl sonra: adam kendi adının kapısından içeri alınmıyor.` },

    { tur: `kapanis`, zemin: `zemin-koyu`,
      baslik: `Acelesi yokmuş demek.`,
      kicik: `Bazı şeyler zamanında anlaşılmıyor — ama anlaşılan o ki kaybolmuyor da.`,
      link: `notimetohurry.com` },
  ],
  metin: `Bugün "epikürien" dendiğinde akla lüks lokanta geliyor. Oysa adam bahçesinde ekmek ve peynirle yaşadı.

Adı iki bin yıl boyunca çalındı, çarpıtıldı, tabelaya asıldı.

Ve tam da bu yıl, kendi okulunun kitapları külün içinden geri okunmaya başladı. Üstelik onu hızlandıran şeyle — yapay zekâyla.

Şu tabloyu bir düşünün: ben burada oturmuş yapay zekâya Epikuros'u soruyorum. Aynı anda başka bir yerde, bir başka yapay zekâ onun okulunun küllerini okuyor.

Acelesi yokmuş demek. Bu bize de bir teselli olsun.`,
},

];
