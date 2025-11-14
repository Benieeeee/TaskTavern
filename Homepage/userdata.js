
const currentUser = sessionStorage.getItem("currentUser");

if (!currentUser) {
    // No one logged in → send back to login page
    window.location.href = "../index.html";
}


let userData = JSON.parse(localStorage.getItem(currentUser + "_data")) || {
    points: 0,
    tasks: []
};

// Example: show points in UI
const pointsDisplay = document.getElementById("points");
if (pointsDisplay) {
    pointsDisplay.textContent = userData.points;
}

function saveUserData() {
    localStorage.setItem(currentUser + "_data", JSON.stringify(userData));
}



document.addEventListener("DOMContentLoaded", () => {
    // Get the span inside the button
    const usernameSpan = document.querySelector("#displayNameBtn .btn-text");

    if (!usernameSpan) return; // safety check

    // Retrieve character data from localStorage
    const characterData = JSON.parse(localStorage.getItem("characterData") || "{}");
    const username = characterData.username || "Username :3";

    // Set the text inside the span
    usernameSpan.textContent = username;
});

