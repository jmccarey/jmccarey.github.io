import mimetypes
from http.server import SimpleHTTPRequestHandler
from flask import Flask, request, render_template, url_for, redirect, session
from requests import post
from datetime import datetime
from time import time
from json import dumps

app = Flask(__name__)
with open('secret',"r") as file:
	app.config['SECRET_KEY'] = file.read()

@app.route('/')
def index():
	return render_template('index.html')


@app.route('/contact', methods=['GET', 'POST'])
def contact(confirmation="", isDisabled="", btnText="Send Message"):
	if request.method == 'POST':
		# Get the form data
		form_data = request.form

		# Build the request body
		body = buildRequestBody(form_data)

		# Trigger the webhook
		response = triggerWebhook(body)

		if not response.ok:
			return render_template('contact/index.html', confirmation="Submission failed. Please try again later or email me directly.", isDisabled=False, btnText="Send Message")
			
		session["lastSubmission"] = time()
		return render_template('contact/index.html', confirmation="Message sent successfully!", isDisabled="disabled", btnText="Message Sent")
	
	if "lastSubmission" in session:
		if time() - session["lastSubmission"] < 60:
			return render_template('contact/index.html', confirmation="Please wait 60 seconds between submissions.", isDisabled="disabled", btnText="Message Sent")

	return render_template('contact/index.html', confirmation=confirmation, isDisabled=isDisabled, btnText=btnText)
	
@app.route('/projects')
def projects():
	# Render the projects page
	return render_template('projects/index.html')


def buildRequestBody(form_data):
	"""Build the request body for the discord webhook"""
	# Extract form values
	name = form_data['name']
	email = form_data['email']
	phone = form_data['phone']
	note = form_data['note']

	# Get the current time
	timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

	senderString = f"Name: {name}\nEmail: {email}\nPhone Number: {phone}"

	titleString = f"{name} sent a message at:\n{timestamp}"	

	webhook_body = {
    "username": name,
    "avatar_url": "https://cdn2.iconfinder.com/data/icons/menu-elements/154/menu-bar-list-square-form-512.png",
    "content": f"New form submission from {name}.",
    "embeds": [{
        "title": titleString,
        "fields": [
            {"name": 'Sender', "value": senderString},
            {"name": 'Message', "value": note}
        ]
    }],
	}

	# Convert the requst body to json
	webhook_body = dumps(webhook_body)


	# Return the request body
	return webhook_body


def triggerWebhook(body):
	"""Trigger the discord webhook stored in secret"""
	# Open the file and read the webhook
	with open ('webhook','r') as file:
		webhook = file.read()

	# Send a POST request to the external webhook
	response = post(url=webhook,
		headers={"Content-Type": "application/json"},
		data=body
	)
		
	return response





Handler = SimpleHTTPRequestHandler
Handler.extensions_map.update({
	'.js': 'application/javascript',
	'.css': 'text/css',
})

if __name__ == '__main__':
	mimetypes.add_type('application/javascript', '.js')
	mimetypes.add_type('text/css', '.css')
	app.run(debug=True, options={"request_handler": Handler })
