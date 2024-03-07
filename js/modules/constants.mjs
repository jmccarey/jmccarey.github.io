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

const themeFromName = function (themeName) {
    if (themeName === "dark") {
        return dark;
    } 
    else {
        return light;
    }
}

export { light, dark, navTopClasses, navBottomClasses, adjustIcon, webhook, themeFromName };

