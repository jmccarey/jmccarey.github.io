import os
from json import loads

workers = int(os.environ.get('GUNICORN_PROCESSES', '2'))

threads = int(os.environ.get('GUNICORN_THREADS', '4'))

bind = os.environ.get('GUNICORN_BIND', 'localhost:8000')

forwarded_allow_ips = '*'

secure_scheme_headers = { 'X-Forwarded-Proto': 'https' }

secretKey = os.environ.get("FLASK_SECRET")

webhook = os.environ.get("CONTACT_WEBHOOK")

with open("www/static/projects.json", "r") as file:
	projects = loads(file.read())