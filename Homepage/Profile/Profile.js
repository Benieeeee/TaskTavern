const buttons = document.querySelectorAll(".collapsible");
const contents = document.querySelectorAll(".content");

buttons.forEach((btn, index) => {
    btn.addEventListener("click", () => {

        // If clicked section is already open → close it
        if (contents[index].style.maxHeight) {
            contents[index].style.maxHeight = null;
            buttons.forEach(b => b.classList.remove("hiddenFade"));
            return;
        }


        contents.forEach(c => c.style.maxHeight = null);

        // Show only this one
        contents[index].style.maxHeight = contents[index].scrollHeight + "px";

        // Fade out other buttons
        buttons.forEach((b, i) => {
            if (i !== index) b.classList.add("hiddenFade");
        });

        // Keep this one visible
        btn.classList.remove("hiddenFade");
    });
});


const button = document.getElementById('btnmale');
const image = document.getElementById('Male');

button.addEventListener('click', () => {
    image.style.display = 'block'; 
});

// Load saved data on page open
window.onload = function () {
    document.getElementById("usernameInput").value = localStorage.getItem("username") || "";
    document.getElementById("bodyLayer").src = localStorage.getItem("body") || "../Customization/Body M.png";
    document.getElementById("hairLayer").src = localStorage.getItem("hair") || "";
    document.getElementById("shirtLayer").src = localStorage.getItem("shirt") || "";
    document.getElementById("pantsLayer").src = localStorage.getItem("pants") || "";
};

// Save username
document.getElementById("usernameInput").addEventListener("input", function () {
    localStorage.setItem("username", this.value);
});

// Male button
document.getElementById("btnMale").addEventListener("click", function () {
    localStorage.setItem("body", "../Customization/Body M.png");
    document.getElementById("bodyLayer").src = "../Customization/Body M.png";
});

// Female button
document.getElementById("btnFemale").addEventListener("click", function () {
    localStorage.setItem("body", "../Customization/Body F.png");
    document.getElementById("bodyLayer").src = "../Customization/Body F.png";
});

// When selecting hairstyle
function selectHair(imgPath) {
    localStorage.setItem("hair", imgPath);
    document.getElementById("hairLayer").src = imgPath;
}

// When selecting shirt
function selectShirt(imgPath) {
    localStorage.setItem("shirt", imgPath);
    document.getElementById("shirtLayer").src = imgPath;
}

// When selecting pants
function selectPants(imgPath) {
    localStorage.setItem("pants", imgPath);
    document.getElementById("pantsLayer").src = imgPath;
}
