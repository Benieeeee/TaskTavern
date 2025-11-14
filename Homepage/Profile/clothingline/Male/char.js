document.addEventListener("DOMContentLoaded", () => {
    const clothingContainer = document.getElementById("characterDisplay");
    const usernameInput = document.getElementById("usernameInput");
    const nameDisplay = document.getElementById("charNameDisplay");
    const layers = { base: null, hat: null, shirt: null, pants: null };

    function clearCharacter() {
        clothingContainer.innerHTML = "";
        Object.keys(layers).forEach(k => layers[k] = null);
    }

    // 🚺 FEMALE BASE: Loads the Female body image
    function setBase() {
        clearCharacter();
        const gender = "male"; 
        const base = document.createElement("img");
        base.src = "../../../Customization/Body M.png"; // Set Female Body image path
        base.className = "base";
        clothingContainer.appendChild(base);
        layers.base = base;
        localStorage.setItem("gender", gender); 
        saveCharacter();
    }

    // 🌟 FIX 1: addLayer function accepts and sets the specific class (e.g., f-s2)
    function addLayer(type, src, specificClass) {
        if (layers[type]) layers[type].remove();
        const img = document.createElement("img");
        img.src = src;
        
        // Combines general type class and the unique class
        img.className = `${type} ${specificClass}`; 
        
        clothingContainer.appendChild(img);
        layers[type] = img;
        saveCharacter();
    }

    // 🌟 FIX 2: Extracts the specific class and uses the new addLayer function
    document.querySelectorAll(".clothing-btn img").forEach(img => {
        img.parentElement.addEventListener("click", () => {
            const src = img.getAttribute("src");
            // Gets the specific class (e.g., 'f-h1', 'f-s2')
            const specificClass = img.parentElement.classList[1]; 
            const type = detectType(src);
            
            if (type && specificClass) {
                addLayer(type, src, specificClass);
            }
        });
    });

    // 🌟 FIX 3: Updated detectType to recognize new female folder names
    function detectType(src) {
        // Checks for either old folder name (male) or new folder name (female)
        if (src.includes("Head Accesories") || src.includes("Male Head")) return "hat";
        if (src.includes("Clothing") || src.includes("Male Clothing")) return "shirt";
        if (src.includes("Pants") || src.includes("Male pants")) return "pants";
        return null;
    }

    function saveCharacter() {
        const data = {
            username: usernameInput.value,
            gender: localStorage.getItem("gender") || "male", 
            // Save the specific class names (f-h1, f-s2, etc.) for loading
            hatClass: layers.hat?.classList[1] || null,
            shirtClass: layers.shirt?.classList[1] || null,
            pantsClass: layers.pants?.classList[1] || null,
            hat: layers.hat?.src || null,
            shirt: layers.shirt?.src || null,
            pants: layers.pants?.src || null,
        };
        localStorage.setItem("characterData_male", JSON.stringify(data)); 
    }

    function loadCharacter() {
        const data = JSON.parse(localStorage.getItem("characterData_female") || "{}");
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
        alert("✅ Male character saved!");
    };

    document.getElementById("resetCharacterBtn").onclick = () => {
        if (confirm("Reset male character?")) {
            localStorage.removeItem("characterData_female");
            clearCharacter();
            usernameInput.value = "";
            nameDisplay.textContent = "Username :3";
            setBase();
        }
    };

    loadCharacter();
});