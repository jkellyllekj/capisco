
#!/usr/bin/env python3
import http.server
import socketserver
import mimetypes
import os
import sys

# Set proper MIME types
mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('text/css', '.css')
mimetypes.add_type('text/html', '.html')

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        # Disable caching
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def guess_type(self, path):
        # Force correct MIME types
        if path.endswith('.js'):
            return 'application/javascript'
        elif path.endswith('.css'):
            return 'text/css'
        elif path.endswith('.html'):
            return 'text/html'
        return super().guess_type(path)

    def do_GET(self):
        # Serve capisco-app.html as the main page
        if self.path == '/' or self.path == '/index.html':
            self.path = '/capisco-app.html'
        return super().do_GET()

if __name__ == "__main__":
    PORT = 5000
    Handler = MyHTTPRequestHandler
    
    try:
        with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as httpd:
            print(f"✓ Server running at http://0.0.0.0:{PORT}/")
            print(f"✓ Serving capisco-app.html as main page")
            print(f"✓ JavaScript files will be served with correct MIME types")
            httpd.serve_forever()
    except Exception as e:
        print(f"Error starting server: {e}")
        sys.exit(1)
