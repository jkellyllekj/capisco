#!/usr/bin/env python

import http.server
import socketserver
import mimetypes
import json
import urllib.parse
import os
import sys
from pathlib import Path
from lesson_processor import CapiscoLessonProcessor

# Set proper MIME types
mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('text/css', '.css')
mimetypes.add_type('text/html', '.html')

class CapiscoRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        self.processor = CapiscoLessonProcessor(fast_mode=True)  # Enable fast mode for speed
        super().__init__(*args, **kwargs)

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
        path_str = str(path)
        if path_str.endswith('.js'):
            return 'application/javascript'
        elif path_str.endswith('.css'):
            return 'text/css'
        elif path_str.endswith('.html'):
            return 'text/html'
        return super().guess_type(path)

    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        # Serve capisco-app.html as the main page
        if self.path == '/' or self.path == '/index.html':
            self.path = '/capisco-app.html'
        return super().do_GET()

    def do_POST(self):
        """Handle POST requests for lesson generation"""
        if self.path == '/generate-lesson':
            try:
                # Get content length and read POST data
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                
                # Parse JSON data
                data = json.loads(post_data.decode('utf-8'))
                video_url = data.get('videoUrl', '')
                source_lang = data.get('sourceLang', 'it')
                target_lang = data.get('targetLang', 'en')
                
                print(f"🎬 Processing lesson request:")
                print(f"   Video: {video_url}")
                print(f"   Languages: {source_lang} → {target_lang}")
                
                # Generate lesson using optimized fast processor
                lesson_data = self.processor.generate_dynamic_lesson_fast(
                    video_url, source_lang, target_lang
                )
                
                # Send JSON response
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                
                response = json.dumps(lesson_data, ensure_ascii=False, indent=2)
                self.wfile.write(response.encode('utf-8'))
                
            except Exception as e:
                print(f"❌ Error processing lesson: {e}")
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                
                error_response = json.dumps({
                    "error": f"Failed to generate lesson: {str(e)}"
                })
                self.wfile.write(error_response.encode('utf-8'))
        else:
            # Handle other POST requests normally
            self.send_response(404)
            self.end_headers()

if __name__ == "__main__":
    PORT = 5000
    Handler = CapiscoRequestHandler
    
    try:
        with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as httpd:
            print(f"✅ Capisco Server running at http://0.0.0.0:{PORT}/")
            print(f"✅ Frontend: capisco-app.html")
            print(f"✅ API endpoint: /generate-lesson")
            print(f"✅ Ready to process YouTube videos into language lessons!")
            httpd.serve_forever()
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)