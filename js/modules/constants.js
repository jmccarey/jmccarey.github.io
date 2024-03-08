const lightClasses = "bg-light text-dark";
const darkClasses = "bg-black text-white";

const cardLightClasses = "card col-lg-5 col-md-6 col-sm-10 bg-light mx-auto border-secondary py-3 text-dark my-2";
const cardDarkClasses = "card col-lg-5 col-md-6 col-sm-10 mx-auto bg-dark border-dark py-3 text-white my-2";

const dark = ["dark", darkClasses, cardDarkClasses];
const light = ["light", lightClasses, cardLightClasses];

const navTopClasses = "navbar fixed-top navbar-expand-sm navbar-dark bg-dark";
const navBottomClasses = "navbar fixed-bottom navbar-expand-sm navbar-dark bg-dark";
const adjustIcon = "<i class='fas fa-adjust fa-1x'></i>";

const webhook = "https://discord.com/api/webhooks/1215097112367206471/28xR61XEkXzQodR4rS6qrXQPKrPKTbXnoDoRwEftLRMs7RpODc5S7i9KToHXgsDkU38S";

const cookieDurationDays = 30;
const cookieDurationMs = cookieDurationDays * 24 * 60 * 60 * 1000;

/**
 * Return a theme array based on the theme name
 * @param {string} themeName Name of the theme: dark or light
 * @returns {Array} Array of strings representing the theme: name, body classes, and card classes
 */
const themeFromName = function (themeName) {
    let theme = themeName === "dark" ? dark : light;
    return theme;
}

/**
 * Return an dictionary object of cookie key/value pairs
 * @param {string} cookie Cookie string from document.cookie
 * @returns {object} Dictionary of of cookie values or null
 */
const parseCookie = function (cookie) {
    if (cookie.length === 0) {
        return null;
    }

    try {
        let dCookie = {};
        cookie.split(";").forEach(function (c) {
            let [key, value] = c.split("=");
            dCookie[key.trim()] = value;
        });
        return dCookie;
    }
    catch (e) {
        return null;
    }
}

/**
 * Return a cookie string with the theme name
 * @param {string} themeName Name of the theme: dark or light
 * @returns {string} Cookie string with the theme name and expiration date
 */
const buildCookie = function (themeName) {
    let d = new Date();
    d.setTime(d.getTime() + cookieDurationMs);
    let expires = "expires=" + d.toUTCString();
    return `theme=${themeName};${expires};path=/`;
}

export { light, dark, navTopClasses, navBottomClasses, adjustIcon, webhook, themeFromName, parseCookie, buildCookie };

