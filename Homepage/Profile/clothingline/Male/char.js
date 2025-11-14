document.addEventListener("DOMContentLoaded", () => {

    const currentUser = sessionStorage.getItem("currentUser");
    if (!currentUser) return; // safety

    const clothingContainer = document.getElementById("characterDisplay");
    const usernameInput = document.getElementById("usernameInput");
    const nameDisplay = document.getElementById("charNameDisplay");
    const layers = { base: null, hat: null, shirt: null, pants: null };

    function clearCharacter() {
        clothingContainer.innerHTML = "";
        for (let key in layers) layers[key] = null;
    }

    function setBase() {
        clearCharacter();
        const base = document.createElement("img");
        base.src = "../../../Customization/Body M.png";
        base.className = "base";
        clothingContainer.appendChild(base);
        layers.base = base;
        saveCharacter();
    }

    function addLayer(type, src, specificClass) {
        if (layers[type]) layers[type].remove();
        const img = document.createElement("img");
        img.src = src;
        img.className = `${type} ${specificClass}`;
        clothingContainer.appendChild(img);
        layers[type] = img;
        saveCharacter();
    }

    document.querySelectorAll(".clothing-btn img").forEach(img => {
        img.parentElement.addEventListener("click", () => {
            const src = img.src;
            const specificClass = img.parentElement.classList[1];
            const type = detectType(src);
            if (type) addLayer(type, src, specificClass);
        });
    });

    function detectType(src) {
        if (src.includes("Head Accesories")) return "hat";
        if (src.includes("Clothing")) return "shirt";
        if (src.includes("Pants")) return "pants";
        return null;
    }

    /** SAVE PER USER **/
    function saveCharacter() {
        const data = {
            username: usernameInput.value.trim(),
            hat: layers.hat?.src || null,
            shirt: layers.shirt?.src || null,
            pants: layers.pants?.src || null,
            hatClass: layers.hat?.classList[1] || null,
            shirtClass: layers.shirt?.classList[1] || null,
            pantsClass: layers.pants?.classList[1] || null,
        };
        localStorage.setItem(currentUser + "_characterData", JSON.stringify(data));
    }

    /** LOAD PER USER **/
    function loadCharacter() {
        const data = JSON.parse(localStorage.getItem(currentUser + "_characterData") || "{}");

        usernameInput.value = data.username || "";
        nameDisplay.textContent = data.username || "Username :3";

        setBase();

        if (data.hat) addLayer("hat", data.hat, data.hatClass);
        if (data.shirt) addLayer("shirt", data.shirt, data.shirtClass);
        if (data.pants) addLayer("pants", data.pants, data.pantsClass);
    }

    usernameInput.addEventListener("input", () => {
        nameDisplay.textContent = usernameInput.value || "Username :3";
        saveCharacter();
    });

    document.getElementById("saveCharacterBtn").onclick = () => {
        saveCharacter();
        alert("Character saved!");
    };

    document.getElementById("resetCharacterBtn").onclick = () => {
        localStorage.removeItem(currentUser + "_characterData");
        usernameInput.value = "";
        nameDisplay.textContent = "Username :3";
        setBase();
    };

    loadCharacter();
});
