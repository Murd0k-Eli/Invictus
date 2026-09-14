//console.log("Hello, World!");

function showAlert() {
    alert("The external script file was successfully called!");
    alert("An alert Popped Up!");
}
// Find the button in the HTML document
const button = document.getElementById("myButton");

// Tell the button to run the showAlert function when clicked
button.addEventListener("click", showAlert);

// Console Logging


