let lightClasses = "bg-light text-dark";
let darkClasses = "bg-black text-white";

let cardLightClasses = "card col-lg-5 col-md-6 col-sm-10 bg-light mx-auto border-secondary py-3 text-dark my-2"
let cardDarkClasses = "card col-lg-5 col-md-6 col-sm-10 mx-auto bg-dark border-dark py-3 text-white my-2"

let storedTheme = sessionStorage.getItem('theme');

// Move the navbar to the bottom of the page if the screen is medium or smaller
// Swap dark mode toggle to an icon on the navbar
function adjustNavbar() {
    let nav = document.getElementById("navbar");
    let themeSwitch = document.getElementById("themeSwitch");
    let storedTheme = sessionStorage.getItem('theme');

    if (window.innerWidth < 992) {
        nav.className = "navbar fixed-bottom navbar-expand-sm navbar-dark bg-dark";
        themeSwitch.innerHTML = "<i class='fas fa-adjust fa-1x'></i>";
        if (storedTheme === darkClasses) {
            themeSwitch.className = "nav-link active";
        } else {
            themeSwitch.className = "nav-link";
        }
    } else {
        nav.className = "navbar fixed-top navbar-expand-sm navbar-dark bg-dark";
        if (storedTheme === darkClasses) {
            themeSwitch.innerHTML = "Light Mode";
            themeSwitch.className = "nav-link active";
        } else {
            themeSwitch.innerHTML = "Dark Mode";
            themeSwitch.className = "nav-link";
        }
    }
}

// Update the display mode to dark mode and store the preference
function darkMode() {
    let body = document.body;
    body.className = darkClasses;
    
    let cards = document.getElementsByClassName("card");
    // for each card, update the class to dark mode
    for (let i = 0; i < cards.length; i++) {
        cards[i].className = cardDarkClasses;
    }

    sessionStorage.setItem('theme', darkClasses);

    adjustNavbar();
}

// Update the display mode to light mode and store the preference
function lightMode() {
    let body = document.body;
    body.className = lightClasses;

    let cards = document.getElementsByClassName("card");
    // for each card, update the class to light mode
    for (let i = 0; i < cards.length; i++) {
        cards[i].className = cardLightClasses
    }

    sessionStorage.setItem('theme', lightClasses);

    adjustNavbar();
}

// A function to toggle current display mode between light and dark
function toggleTheme() {
    storedTheme = sessionStorage.getItem('theme');
    if (storedTheme === lightClasses) {
        darkMode();
    } else {
        lightMode();
    }

    adjustNavbar();
}

// When the page loads, check for a stored theme preference and apply it
window.onload = function() {
    let storedTheme = sessionStorage.getItem('theme');
    if (storedTheme === lightClasses || !storedTheme) {
        lightMode();
    }
    else{
        darkMode();
    }
    adjustNavbar();
}

// When the window is resized, move the navbar to the bottom if the screen is small
window.onresize = function() {
    adjustNavbar();
}