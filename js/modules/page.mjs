import * as c from './constants.mjs';

class Page {
    constructor() {
        this.theme = c.light;

        let sessionTheme = this.getSessionTheme();
        this.applyTheme(sessionTheme);
    }

    // Move the navbar to the bottom of the page if the screen is medium or smaller
    // Swap dark mode toggle to an icon on the navbar
    adjustNavbar() {
        let nav = document.getElementById("navbar");
        let themeSwitch = document.getElementById("themeSwitch");
    
        if (window.innerWidth < 992) {
            nav.className = c.navBottomClasses;
            themeSwitch.innerHTML = "<i class='fas fa-adjust fa-1x'></i>";
            if (this.theme === c.dark) {
                themeSwitch.className = "nav-link active";
            } 
            else {
                themeSwitch.className = "nav-link";
            }
        } 
        else {
            nav.className = c.navTopClasses;
            if (this.theme === c.dark) {
                themeSwitch.innerHTML = "Light Mode";
                themeSwitch.className = "nav-link active";
            } 
            else {
                themeSwitch.innerHTML = "Dark Mode";
                themeSwitch.className = "nav-link";
            }
        }

    }

    getSessionTheme() {
        return c.themeFromName(sessionStorage.getItem('theme'));
    }

    // Apply theme to the page and store in the session
    // Theme is an array of 3 strings, 0: name, 1: body classes, 2: card classes
    applyTheme(theme) {
        document.body.className = theme[1];
        
        let cards = document.getElementsByClassName("card");

        // for each card, update the class to match the theme
        for (let i = 0; i < cards.length; i++) {
            cards[i].className = theme[2];
        }
        
        this.theme = theme;
        sessionStorage.setItem('theme', theme[0]);
    
        this.adjustNavbar();
    }
    
    // A method to toggle current display mode between light and dark
    toggleTheme() {
        this.theme === c.light ? this.applyTheme(c.dark) : this.applyTheme(c.light);
    }

    onLoad() {
        let sessionTheme = this.getSessionTheme();
        this.applyTheme(sessionTheme);
    }

    onResize() {
        this.adjustNavbar();
    }

}

export {Page};