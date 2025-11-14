
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
    const currentUser = sessionStorage.getItem("currentUser");
    if (!currentUser) return;

    const usernameSpan = document.querySelector("#displayNameBtn .btn-text");
    if (!usernameSpan) return;

    const data = JSON.parse(localStorage.getItem(currentUser + "_characterData") || "{}");
    const username = data.username || "Username :3";

    usernameSpan.textContent = username;
});


