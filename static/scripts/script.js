//console.log("Hello, World!");
document.addEventListener("DOMContentLoaded", function() {
    const button = document.getElementById("myButton");
    if (button) {
        console.log("The button was successfully found!");
        function showAlert() {
            alert("The external script file was successfully called!");
            alert("An alert Popped Up!");
        }
        button.addEventListener("click", showAlert);
        console.log("The external script file was successfully called!");
        console.log("The button was successfully found and the event listener was added!");
    }

    const consent = localStorage.getItem("cookieConsent");
    const banner = document.getElementById("cookie-banner");
    const acceptButton = document.getElementById("accept-cookies");
    const rejectButton = document.getElementById("reject-cookies");

    if (banner) {
        // Only show the banner if no consent has been recorded (neither accepted nor rejected)
        if (!consent) {
            banner.style.display = "flex";
            console.log("Cookie banner displayed");
        } else if (consent === "accepted") {
            loadAnalytics();
        }
    }

    if (acceptButton && banner) {
        acceptButton.addEventListener("click", () => {
            localStorage.setItem("cookieConsent", "accepted");
            banner.style.display = "none";
            loadAnalytics();
        });
    }

    if (rejectButton && banner) {
        rejectButton.addEventListener("click", () => {
            localStorage.setItem("cookieConsent", "rejected");
            banner.style.display = "none";
        });
    }
});

function loadAnalytics() {
    // Insert Google Analytics or tracking scripts here safely post-consent
    console.log("Analytics loaded");
}


