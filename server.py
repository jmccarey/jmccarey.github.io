import http.server
import socketserver
from time import sleep

PORT = 8000

Handler = http.server.SimpleHTTPRequestHandler
Handler.extensions_map.update({
      ".js": "text/javascript",
});

if __name__ == "__main__":
    httpd = socketserver.TCPServer(("", PORT), Handler)
    httpd.serve_forever()
    while True:
        try:
            sleep(1)
        except KeyboardInterrupt:
            httpd.shutdown()
            exit(0)