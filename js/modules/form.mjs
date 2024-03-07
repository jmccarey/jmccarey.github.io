import * as c from './constants.mjs';
import {Page} from './page.mjs';

class FormPage extends Page{
    constructor(){
        super();
        this.webhook = c.webhook;
        this.tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        this.tooltipList = [...this.tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

        this.lastSubmission = sessionStorage.getItem('lastSubmission');
    }

    allowSubmission(){
        let lastSubmission = sessionStorage.getItem('lastSubmission');
    
        if(lastSubmission){
            let timeSince = new Date().getTime() - lastSubmission;
            console.log(timeSince);
            if(timeSince < 120000){
                return false;
            }
        }
    
        return true;
    }
    
    disableSubmission(){
        let btn = document.getElementById('submit');
        btn.innerHTML = "Message Sent!";
        btn.disabled = true;
        
        let tooltip = bootstrap.Tooltip.getInstance("#submitTooltip");
        tooltip.setContent({ '.tooltip-inner': "Your message was sent. If you need to send another, please wait a few minutes." });
    }
    
    buildRequestBody(){
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
                { name: 'Sender', value: senderString},
                { name: 'Message', value: message}
              ]
            }],
        };
    
        return webhookBody
    }


    async postForm(event){
        event.preventDefault();

        if(!allowSubmission()){
            return;
        }

        let requestBody = buildRequestBody();
        
        let response = await fetch(webhook, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        else{
            disableSubmission();
            sessionStorage.setItem('lastSubmission', new Date().getTime());
        }

    }

    onLoad(){
        super.onLoad();

        // tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        // tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    
        if (!allowSubmission()){
            disableSubmission();
        }
    }

}

export {FormPage};

