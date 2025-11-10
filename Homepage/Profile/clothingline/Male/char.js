document.addEventListener("DOMContentLoaded", () => {
    const clothingContainer = document.getElementById("characterDisplay");
    const usernameInput = document.getElementById("usernameInput");
    const nameDisplay = document.getElementById("charNameDisplay");
    const layers = { base: null, hat: null, shirt: null, pants: null };

    function clearCharacter() {
        clothingContainer.innerHTML = "";
        Object.keys(layers).forEach(k => layers[k] = null);
    }

    function setBase() {
        clearCharacter();
        const gender = "male"; // Locked to male
        const base = document.createElement("img");
        base.src = "../../../Customization/Body M.png";
        base.className = "base";
        clothingContainer.appendChild(base);
        layers.base = base;
        localStorage.setItem("gender", gender); 
        saveCharacter();
    }

    // 🌟 UPDATED: Now accepts the specific class for individual positioning
    function addLayer(type, src, specificClass) {
        if (layers[type]) layers[type].remove();
        const img = document.createElement("img");
        img.src = src;
        
        // This combines the general type class and the specific class
        img.className = `${type} ${specificClass}`; 
        
        clothingContainer.appendChild(img);
        layers[type] = img;
        saveCharacter();
    }

    // 🌟 UPDATED: Extracts the specific class from the button
    document.querySelectorAll(".clothing-btn img").forEach(img => {
        img.parentElement.addEventListener("click", () => {
            const src = img.getAttribute("src");
            // Gets the specific class (e.g., 'h1', 's2', 'p3')
            const specificClass = img.parentElement.classList[1]; 
            const type = detectType(src);
            
            if (type && specificClass) {
                addLayer(type, src, specificClass);
            }
        });
    });

    function detectType(src) {
        if (src.includes("Head Accesories")) return "hat";
        if (src.includes("Clothing")) return "shirt";
        if (src.includes("Pants")) return "pants";
        return null;
    }

    function saveCharacter() {
        const data = {
            username: usernameInput.value,
            gender: localStorage.getItem("gender") || "male", 
            // NOTE: We need to save the specific class to load it correctly later
            hatClass: layers.hat?.classList[1] || null,
            shirtClass: layers.shirt?.classList[1] || null,
            pantsClass: layers.pants?.classList[1] || null,
            hat: layers.hat?.src || null,
            shirt: layers.shirt?.src || null,
            pants: layers.pants?.src || null,
        };
        localStorage.setItem("characterData", JSON.stringify(data));
    }

    function loadCharacter() {
        const data = JSON.parse(localStorage.getItem("characterData") || "{}");
        if (data.username) usernameInput.value = data.username;
        setBase(); 
        
        // Load layers using the saved class names
        if (data.hat && data.hatClass) addLayer("hat", data.hat, data.hatClass);
        if (data.shirt && data.shirtClass) addLayer("shirt", data.shirt, data.shirtClass);
        if (data.pants && data.pantsClass) addLayer("pants", data.pants, data.pantsClass);
        
        updateName();
    }

    usernameInput.addEventListener("input", updateName);
    function updateName() {
        nameDisplay.textContent = usernameInput.value || "Username :3";
        saveCharacter();
    }

    document.getElementById("saveCharacterBtn").onclick = () => {
        saveCharacter();
        alert("✅ Character saved!");
    };

    document.getElementById("resetCharacterBtn").onclick = () => {
        if (confirm("Reset character?")) {
            localStorage.removeItem("characterData");
            clearCharacter();
            usernameInput.value = "";
            nameDisplay.textContent = "Username :3";
            setBase();
        }
    };

    loadCharacter();
});