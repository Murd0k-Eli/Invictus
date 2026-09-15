//console.log("Hello, World!");
document.addEventListener("DOMContentLoaded", function() {
    function showAlert() {
        alert("The external script file was successfully called!");
        alert("An alert Popped Up!");
    }
    // Find the button in the HTML document
    const button = document.getElementById("myButton");
    // Tell the button to run the showAlert function when clicked
    button.addEventListener("click", showAlert);
    // Console Logging
    console.log("The external script file was successfully called!");
    console.log("The button was successfully found and the event listener was added!");
    
    const consent = localStorage.getItem("cookieConsent");
    const banner = document.getElementById("cookie-banner");
    if (!consent) {
        banner.style.display = "flex";
    } else if (consent === "accepted") {
        loadAnalytics();
    }

    document.getElementById("accept-cookies").addEventListener("click", () => {
        localStorage.setItem("cookieConsent", "accepted");
        banner.style.display = "none";
        loadAnalytics();
    });

    document.getElementById("reject-cookies").addEventListener("click", () => {
        localStorage.setItem("cookieConsent", "rejected");
        banner.style.display = "none";
    });
});

function loadAnalytics() {
    // Insert Google Analytics or tracking scripts here safely post-consent
    console.log("Analytics loaded");
}


