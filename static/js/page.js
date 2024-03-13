import * as c from './constants.js';

/**
 * Class representing the page and its theme
 * @class
 * @classdesc The page and its theme
 * @requires constants
 * @example
 * let page = new Page();
 * window.onload = function() {
 *   page.onLoad();
 * }
 */
class Page {
    constructor() {
        this.theme = c.light;

        let savedTheme = this.getSavedTheme();

        this.applyTheme(savedTheme);
    }

    /**
     * Adjust the navbar based on the window width.
     * If the window is less than 992px (medium or smaller), move the navbar to the bottom and change the dark mode toggle to an icon.
     */
    adjustNavbar() {
        let nav = document.getElementById("navbar");
        let themeSwitch = document.getElementById("themeSwitch");

        if (window.innerWidth < 992) {
            nav.className = c.navBottomClasses;
            themeSwitch.innerHTML = c.adjustIcon;
            if (this.theme === c.dark) {
                themeSwitch.className = "nav-link active text-center";
            }
            else {
                themeSwitch.className = "nav-link text-center";
            }
        }
        else {
            nav.className = c.navTopClasses;
            if (this.theme === c.dark) {
                themeSwitch.innerHTML = "Light Mode";
                themeSwitch.className = "nav-link active text-center";
            }
            else {
                themeSwitch.innerHTML = "Dark Mode";
                themeSwitch.className = "nav-link text-center";
            }
        }

    }

    /**
     * Attempt to find a theme preference. The order of precedence is:
     * 1. Session storage 2. Cookie 3. System preference 4. Default (light)
     * @returns {Array} The theme array representing the user's saved theme
     */
    getSavedTheme() {
        let sessionTheme = sessionStorage.getItem('theme');
        let dCookie = c.parseCookie(document.cookie);

        if (sessionTheme !== null) {
            return c.themeFromName(sessionTheme); // 1
        }
        else if (dCookie !== null) {
            let cookieTheme = dCookie['theme'];
            if (cookieTheme !== undefined) {
                return c.themeFromName(cookieTheme); // 2
            }
        }


        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return c.dark; // 3
        }
        else {
            return c.light; // 4
        }

    }

    /**
     * Apply theme to the page and store in the session
     * @param {Array} theme Array of strings representing the theme: name, body classes, and card classes
     */
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

    /**
     * Toggle the theme between light and dark
     */
    toggleTheme() {
        this.theme === c.light ? this.applyTheme(c.dark) : this.applyTheme(c.light);
    }

    /**
     * Update function to be used by the event listener
     * When the page is loaded, apply the theme from the session
     */
    onLoad() {
        let sessionTheme = this.getSavedTheme();
        this.applyTheme(sessionTheme);
    }

    /**
     * Update function to be used by the event listener
     * Adjust the navbar when the window is resized
     */
    onResize() {
        this.adjustNavbar();
    }

    /**
     * Update function to be used by the event listener
     * Before the page is unloaded, save the theme to a cookie
     */
    onBeforeUnload() {
        document.cookie = c.buildCookie(this.theme[0]);
    }

}

export { Page };