// ======================================================
//  MUST READ THE CURRENT USER FIRST
// ======================================================
const currentUser = sessionStorage.getItem("currentUser");
if (!currentUser) {
    window.location.href = "../index.html";
}

// ======================================================
//  FETCH USER TOTAL POINTS (ALL DAYS)
// ======================================================
function getTotalUserPoints() {
    const days = ["mon","tue","wed","thu","fri","sat","sun"];
    let total = 0;

    days.forEach(short => {
        const key = currentUser + "_" + short + "_totalPoints";
        total += parseInt(localStorage.getItem(key)) || 0;
    });

    return total;
}

// ======================================================
//  LOCKED ITEMS CONFIG
// ======================================================
const lockedItems = {
    // hats
    "h3": 500,
    "h4": 1000,
    "h5": 1500,

    // shirts
    "s3": 600,
    "s4": 1100,
    "s5": 1600,

    // pants
    "p3": 700,
    "p4": 1200,
    "p5": 1700
};

// ======================================================
//  MAIN CHARACTER SCRIPT
// ======================================================

document.addEventListener("DOMContentLoaded", () => {
    const clothingContainer = document.getElementById("characterDisplay");
    const usernameInput = document.getElementById("usernameInput");
    const nameDisplay = document.getElementById("charNameDisplay");
    const layers = { base: null, hat: null, shirt: null, pants: null };

    let userPoints = getTotalUserPoints();

    // ======================================================
    //  CLEAR CHARACTER
    // ======================================================
    function clearCharacter() {
        clothingContainer.innerHTML = "";
        Object.keys(layers).forEach(k => layers[k] = null);
    }

    // ======================================================
    //  SET BASE
    // ======================================================
    function setBase() {
        clearCharacter();
        const base = document.createElement("img");
        base.src = "../../../Customization/Body M.png";
        base.className = "base";
        clothingContainer.appendChild(base);
        layers.base = base;
        saveCharacter();
    }

    // ======================================================
    //  CHECK IF ITEM IS LOCKED
    // ======================================================
    function isLocked(classname) {
        return lockedItems[classname] && userPoints < lockedItems[classname];
    }

    // ======================================================
    //  UPDATE BUTTON APPEARANCE
    // ======================================================
    function updateButtonLocks() {
        document.querySelectorAll(".clothing-btn").forEach(btn => {
            const specificClass = btn.classList[1];

            if (isLocked(specificClass)) {
                btn.classList.add("locked");   // dark & disabled visual
            } else {
                btn.classList.remove("locked"); // normal
            }
        });
    }

    // ======================================================
    //  ADD LAYER
    // ======================================================
    function addLayer(type, src, specificClass) {
        if (layers[type]) layers[type].remove();
        const img = document.createElement("img");
        img.src = src;
        img.className = `${type} ${specificClass}`;

        clothingContainer.appendChild(img);
        layers[type] = img;

        saveCharacter();
    }

    // ======================================================
    //  BUTTON CLICK EVENTS
    // ======================================================
    document.querySelectorAll(".clothing-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const specificClass = btn.classList[1];
            const img = btn.querySelector("img");
            const src = img.getAttribute("src");

            // 🔒 ITEM LOCKED?
            if (isLocked(specificClass)) {
                btn.style.animation = "shake 0.3s";
                setTimeout(() => btn.style.animation = "", 300);

                alert(
                    `❌ This item is locked!\n`+
                    `Required: ${lockedItems[specificClass]} points\n` +
                    `You have: ${userPoints} points`
                );
                return;
            }

            const type = detectType(src);
            if (type && specificClass) {
                addLayer(type, src, specificClass);
            }
        });
    });

    // ======================================================
    //  DETECT TYPE
    // ======================================================
    function detectType(src) {
        if (src.includes("Head Accesories")) return "hat";
        if (src.includes("Clothing")) return "shirt";
        if (src.includes("Pants")) return "pants";
        return null;
    }

    // ======================================================
    //  SAVE CHARACTER
    // ======================================================
    function saveCharacter() {
        const data = {
            username: usernameInput.value,
            hatClass: layers.hat?.classList[1] || null,
            shirtClass: layers.shirt?.classList[1] || null,
            pantsClass: layers.pants?.classList[1] || null,
            hat: layers.hat?.src || null,
            shirt: layers.shirt?.src || null,
            pants: layers.pants?.src || null,
        };
        localStorage.setItem(currentUser + "_character", JSON.stringify(data));
    }

    // ======================================================
    //  LOAD CHARACTER
    // ======================================================
    function loadCharacter() {
        const data = JSON.parse(localStorage.getItem(currentUser + "_character") || "{}");
        
        if (data.username) usernameInput.value = data.username;
        setBase();

        if (data.hat && data.hatClass) addLayer("hat", data.hat, data.hatClass);
        if (data.shirt && data.shirtClass) addLayer("shirt", data.shirt, data.shirtClass);
        if (data.pants && data.pantsClass) addLayer("pants", data.pants, data.pantsClass);

        updateName();
    }

    // ======================================================
    //  LIVE NAME UPDATE
    // ======================================================
    usernameInput.addEventListener("input", updateName);
    function updateName() {
        nameDisplay.textContent = usernameInput.value || "Username :3";
        saveCharacter();
    }

    // ======================================================
    //  SAVE BUTTON
    // ======================================================
    document.getElementById("saveCharacterBtn").onclick = () => {
        saveCharacter();
        alert("Character saved!");
    };

    // ======================================================
    //  RESET CHARACTER
    // ======================================================
    document.getElementById("resetCharacterBtn").onclick = () => {
        if (confirm("Reset character?")) {
            localStorage.removeItem(currentUser + "_character");
            clearCharacter();
            usernameInput.value = "";
            nameDisplay.textContent = "Username :3";
            setBase();
        }
    };

    // ======================================================
    //  INITIAL LOAD
    // ======================================================
    loadCharacter();
    updateButtonLocks();   // 🔥 ACTIVATES DARK LOCKED BUTTONS
});
