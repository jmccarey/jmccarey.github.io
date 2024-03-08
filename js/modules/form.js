import * as c from './constants.js';
import { Page } from './page.js';

/**
 * Class representing a form page and its functionality
 * @class
 * @classdesc The form page and its functionality
 * @extends Page
 * @requires constants
 * @example
 * let formPage = new FormPage();
 * window.onload = function() {
 *  formPage.onLoad();
 * }
 */
class FormPage extends Page {
    constructor() {
        super();
        this.webhook = c.webhook;
        this.tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        this.tooltipList = [...this.tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

        this.lastSubmission = sessionStorage.getItem('lastSubmission');
    }

    /**
     * @returns {boolean} True if the user is allowed to submit a form, false if not.
     */
    allowSubmission() {
        let lastSubmission = sessionStorage.getItem('lastSubmission');

        if (lastSubmission) {
            let timeSince = new Date().getTime() - lastSubmission;
            if (timeSince < 120000) {
                return false;
            }
        }

        return true;
    }

    /**
     * Disable the form submission button and update the button and tooltip text to indicate the form was submitted.
     */
    disableSubmission() {
        let btn = document.getElementById('submit');
        btn.innerHTML = "Message Sent!";
        btn.disabled = true;

        let tooltip = bootstrap.Tooltip.getInstance("#submitTooltip");
        tooltip.setContent({ '.tooltip-inner': "Your message was sent. If you need to send another, please wait a few minutes." });
    }

    /**
     * Builds a request body for a Discord webhook using form values.
     * @returns {object} The body of the webhook request.
     */
    buildRequestBody() {
        // Get each value from the form
        let name = document.getElementById('name').value;
        let email = document.getElementById('email').value;
        let phone = document.getElementById('phone').value;
        let message = document.getElementById('note').value;

        // Get the current time
        let date = new Date();
        let timestamp = date.toString();

        let senderString = `Name: ${name}\nEmail: ${email}\nPhone Number: ${phone}`;

        let titleString = `${name} sent a message at:\n${timestamp}`;

        let webhookBody = {
            "username": name,
            "avatar_url": "https://cdn2.iconfinder.com/data/icons/menu-elements/154/menu-bar-list-square-form-512.png",
            "content": `New form submission from ${name}.`,
            embeds: [{
                title: titleString,
                fields: [
                    { name: 'Sender', value: senderString },
                    { name: 'Message', value: message }
                ]
            }],
        };

        return webhookBody
    }

    /**
     * Event handler for form submission. Sends a request to the Discord webhook with the form values.
     * Disables form submission and stores the time of the submission in session storage to prevent spam.
     * @param {Event} event The form submission event.
     * @async
     */
    async postForm(event) {
        event.preventDefault();

        if (!this.allowSubmission()) {
            return;
        }

        let requestBody = this.buildRequestBody();

        let response = await fetch(this.webhook, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        else {
            this.disableSubmission();
            sessionStorage.setItem('lastSubmission', new Date().getTime());
        }

    }

    /**
     * On page load, always load the theme and check if the user is allowed to submit a form.
     */
    onLoad() {
        super.onLoad();

        let canSubmit = this.allowSubmission();

        if (!canSubmit) {
            this.disableSubmission();
        }
    }

}

export { FormPage };

