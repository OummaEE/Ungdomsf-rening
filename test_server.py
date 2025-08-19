#!/usr/bin/env python3
"""
Simple HTTP Server for testing mobile layout
"""
import http.server
import socketserver
import sys
import os

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        sys.stdout.write(f"{self.log_date_time_string()} - {format%args}\n")
        sys.stdout.flush()

if __name__ == "__main__":
    # Change to the webapp directory
    os.chdir("/home/user/webapp")
    
    with socketserver.TCPServer(("0.0.0.0", PORT), MyHTTPRequestHandler) as httpd:
        print(f"Server running on port {PORT}")
        print(f"Open http://localhost:{PORT} to test the mobile layout")
        sys.stdout.flush()
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")