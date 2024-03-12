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
        this.tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        this.tooltipList = [...this.tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

        this.lastSubmission = sessionStorage.getItem('lastSubmission');

        if (!this.allowSubmission()) {
            this.disableSubmission();
        }
    }

    /**
     * @returns {boolean} True if the user is allowed to submit a form, false if not.
     */
    allowSubmission() {
        let lastSubmission = sessionStorage.getItem('lastSubmission');

        if (lastSubmission) {
            let timeNow = new Date().getTime() * 1000;
            let timeSince = timeNow - lastSubmission;
            if (timeSince < 1200) {
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
     * Event handler for form submission.
     * Disables form submission and stores the time of the submission in session storage to prevent spam.
     * @param {Event} event The form submission event.
     */
    postForm(event) {
        if (event) {
            event.preventDefault();
        }


        if (!this.allowSubmission()) {
            return;
        }


        this.disableSubmission();

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

