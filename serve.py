#!/usr/bin/env python3
"""No Time to Hurry — yerel geliştirme sunucusu.

Canlıdaki (nginx) yapının birebir aynısını sunar: kök index.html,
tr/ ve en/ sayfaları, css/ ve assets/. Tek fark: HER yanıtı
"önbellekleme" diyerek gönderir — böylece bir dosyayı değiştirip
tarayıcıyı yenilediğinde daima en güncel halini görürsün
(canlıda yaşadığımız önbellek kafa karışıklığı localde olmaz).

Kullanım:
    python serve.py            # http://localhost:8765
    python serve.py 9000       # farklı port

Durdurmak için Ctrl+C.
"""
import http.server
import socketserver
import sys
import os

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8765

# Sunucuyu bu betiğin bulunduğu klasörden (proje kökü) çalıştır —
# böylece /tr, /en, /css, /assets yolları canlıdaki gibi çözülür.
os.chdir(os.path.dirname(os.path.abspath(__file__)))


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, fmt, *args):
        # Sade log: sadece yol ve durum
        sys.stderr.write("  %s\n" % (fmt % args))


http.server.ThreadingHTTPServer.allow_reuse_address = True
with http.server.ThreadingHTTPServer(("127.0.0.1", PORT), Handler) as httpd:
    print("No Time to Hurry — yerel sunucu (onbelleksiz)")
    print("  Ana sayfa : http://localhost:%d/  (Turkce'ye yonlendirir)" % PORT)
    print("  Ingilizce : http://localhost:%d/en/index.html" % PORT)
    print("  Durdurmak : Ctrl+C")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nSunucu durduruldu.")
