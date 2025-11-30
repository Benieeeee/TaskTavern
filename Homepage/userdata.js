
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


(function () {
    const currentUser = sessionStorage.getItem("currentUser");
    if (!currentUser) {
        alert("Access denied. Please log in first.");
        window.location.href = "../index.html";
        return;
    }

    const previewBox = document.getElementById("homeCharPreview");
    if (!previewBox) return;

    const maleKey = `${currentUser}_character`;
    const femaleKey = `${currentUser}_character_female`;
    const genderKey = `${currentUser}_gender`;

    // ===============================
    // GET GENDER
    // ===============================
    function getGender() {
        // fallback: male
        return localStorage.getItem(genderKey) || "male";
    }

    // ===============================
    // GET CHARACTER DATA
    // ===============================
    function getCharacterData() {
        const gender = getGender();
        if (gender === "female") {
            return JSON.parse(localStorage.getItem(femaleKey) || "{}");
        }
        return JSON.parse(localStorage.getItem(maleKey) || "{}");
    }

    // ===============================
    // ADD LAYER
    // ===============================
    function addLayer(src, className) {
        if (!src) return;
        const img = document.createElement("img");
        img.src = src;

        // If it's female, add .female-* class
        if (getGender() === "female" && !className.startsWith("f-")) {
            img.className = "f-" + className;
        } else {
            img.className = className;
        }
        previewBox.appendChild(img);
    }

    // ===============================
    // LOAD PREVIEW
    // ===============================
    function loadPreview() {
        const gender = getGender();
        const data = getCharacterData();
        previewBox.innerHTML = "";

        // Base
        const base = document.createElement("img");
        base.src = gender === "female" ? "Customization/Body F.png" : "Customization/Body M.png";
        base.className = gender === "female" ? "female-base" : "base";
        previewBox.appendChild(base);

        // Layers
        if (data.hat) addLayer(data.hat, data.hatClass || "hat");
        if (data.shirt) addLayer(data.shirt, data.shirtClass || "shirt");
        if (data.pants) addLayer(data.pants, data.pantsClass || "pants");
    }

    // Initial load
    loadPreview();

    // Update on storage changes
    window.addEventListener("storage", (e) => {
        if ([maleKey, femaleKey, genderKey].includes(e.key)) {
            loadPreview();
        }
    });

    // Update when returning to page
    document.addEventListener("visibilitychange", () => {
        if (!document.hidden) loadPreview();
    });
})();

document.addEventListener("DOMContentLoaded", () => {
    const currentUser = sessionStorage.getItem("currentUser");
    if (!currentUser) return;

    const usernameSpan = document.getElementById("homeUsername");
    const data = JSON.parse(localStorage.getItem(currentUser + "_character") || "{}");

    usernameSpan.textContent = data.username || "";
});

