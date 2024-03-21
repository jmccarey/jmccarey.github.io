import os
from www.app import app as application
from pathlib import Path


workers = 4

threads = 2

bind = 'unix:/tmp/nginx.sock'

forwarded_allow_ips = '*'

secure_scheme_headers = { 'X-Forwarded-Proto': 'https' }

preload_app = True
 
pre_fork = lambda server, worker: Path("tmp/app-initialized").touch()

wsgi_app = application



