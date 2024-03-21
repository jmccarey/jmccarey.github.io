import mimetypes
from http.server import SimpleHTTPRequestHandler
from flask import Flask, request, render_template, url_for, redirect, session
from requests import post
from datetime import datetime
from time import time
from json import dumps
import www.constants as const

app = Flask(__name__)
app.config['SECRET_KEY'] = const.secretKey

@app.route('/')
def index():
	"""Render the home page."""
	return render_template('index.html')


@app.route('/contact', methods=['GET', 'POST'])
def contact(confirmation="", isDisabled="", btnText="Send Message"):
	"""Render the contact page.

	Args:
		confirmation (str): The confirmation message.
		isDisabled (str): The disabled attribute for the button.
		btnText (str): The text for the button.

	Returns:
		str: The rendered template.
	"""

	if request.method == 'POST':
		if "lastSubmission" in session:
			if time() - session["lastSubmission"] < 60:
				return redirect(url_for("contact", confirmation="Please wait 60 seconds between submissions.", isDisabled="disabled", btnText="Message Sent"))

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

@app.route('/projects/<page>', methods=['GET', 'POST'])
def projects(page=1, pageProjects=[]):
	"""Render the projects page.
	
	Args:
		page (int): The page number.
		projects (list): A list of projects.
		
	Returns:
		str: The rendered template.
	"""

	try:
		page = int(page)
	except ValueError:
		return redirect(url_for("error", code=404,message="Page not found."))

	if request.method == 'POST':
		# Redirect to the requested page
		page = int(request.form['goPage'])
		return redirect(url_for("projects", page=page))


	# If the user goes below the first page, redirect to the first page
	if page <= 0:
		return redirect(url_for("projects", page=1))

	
	
	# Load a JSON file with project data from static
	#with open("./static/projects.json", 'r') as file:
	# with open(url_for("static", filename="projects.json"), 'r') as file:
	# 	data = file.read()
	# 	projects = loads(data)

	# If the user goes over the last page, redirect to the last page
	if page > len(const.projects):
		return redirect(url_for("projects", page=len(const.projects)))
	
	# Projects is a list of list of dicts
	# Get the list for the current page

	pageProjects = const.projects[page - 1][:]

	while len(pageProjects) < 4:
		pageProjects.append({"visibility": "hidden"})


	# Render the template with the list of projects
	
	return render_template('projects/index.html', page=page, pageProjects=pageProjects)


@app.route('/error')
def error(code=404, message="Page not found"):
	return render_template('error.html', code=code, message=message)


def buildRequestBody(form_data):
	"""Build the request body for the webhook.

	Args:
		form_data (dict): A dictionary containing the form data.
	Returns: 
		str: The request body for the webhook.
	"""
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
	"""Trigger the discord webhook stored in secret
	
	Args: 
		body (str): The request body for the webhook.

	Returns:
		requests.models.Response: The response from the webhook.
	"""

	# Send a POST request to the external webhook
	response = post(url=const.webhook,
		headers={"Content-Type": "application/json"},
		data=body
	)
		
	return response


# Run a dev server if this file is run
if __name__ == '__main__':
	Handler = SimpleHTTPRequestHandler
	Handler.extensions_map.update({
		'.js': 'application/javascript',
		'.css': 'text/css',
	})
	mimetypes.add_type('application/javascript', '.js')
	mimetypes.add_type('text/css', '.css')
	app.run(debug=True, options={"request_handler": Handler })
