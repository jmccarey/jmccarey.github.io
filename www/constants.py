from json import loads
import os

with open("www/static/projects.json", "r") as file:
	projects = loads(file.read())

secretKey = os.environ.get("FLASK_SECRET")

webhook = os.environ.get("CONTACT_WEBHOOK")