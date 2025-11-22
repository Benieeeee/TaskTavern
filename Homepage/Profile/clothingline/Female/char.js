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
    const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    let total = 0;

    days.forEach(short => {
        const key = currentUser + "_" + short + "_totalPoints";
        total += parseInt(localStorage.getItem(key)) || 0;
    });

    return total;
}

// ======================================================
//  LOCKED ITEMS CONFIG (FEMALE VERSION)
// ======================================================
const lockedItems = {
    // female hats
    "f-h3": 50,
    "f-h4": 80,
    "f-h5": 110,

    // female shirts
    "f-s3": 60,
    "f-s4": 90,
    "f-s5": 120,

    // female pants
    "f-p3": 70,
    "f-p4": 100,
    "f-p5": 130
};

// ======================================================
//  FEMALE CHARACTER SCRIPT
// ======================================================
document.addEventListener("DOMContentLoaded", () => {
    const clothingContainer = document.getElementById("characterDisplay");
    const usernameInput = document.getElementById("usernameInput");
    const nameDisplay = document.getElementById("charNameDisplay");

    let layers = { base: null, hat: null, shirt: null, pants: null };
    let userPoints = getTotalUserPoints();

    // ======================================================
    //  CLEAR CHARACTER
    // ======================================================
    function clearCharacter() {
        clothingContainer.innerHTML = "";
        Object.keys(layers).forEach(k => layers[k] = null);
    }

    // ======================================================
    //  SET FEMALE BASE
    // ======================================================
    function setBase() {
        clearCharacter();
        const base = document.createElement("img");
        base.src = "../../../Customization/Body F.png";
        base.className = "base";
        clothingContainer.appendChild(base);
        layers.base = base;

        localStorage.setItem(currentUser + "_gender", "female");
        saveCharacter();
    }

    // ======================================================
    //  CHECK LOCKED STATE
    // ======================================================
    function isLocked(classname) {
        return lockedItems[classname] && userPoints < lockedItems[classname];
    }

    // ======================================================
    //  UPDATE LOCKED BUTTON APPEARANCE
    // ======================================================
    function updateButtonLocks() {
        document.querySelectorAll(".clothing-btn").forEach(btn => {
            const specificClass = btn.classList[1];

            if (isLocked(specificClass)) {
                btn.classList.add("locked");
            } else {
                btn.classList.remove("locked");
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
    //  BUTTON CLICKS
    // ======================================================
    document.querySelectorAll(".clothing-btn").forEach(btn => {
        btn.addEventListener("click", () => {

            const specificClass = btn.classList[1];
            const img = btn.querySelector("img");
            const src = img.getAttribute("src");

            // LOCK CHECK
            if (isLocked(specificClass)) {
                btn.style.animation = "shake 0.3s";
                setTimeout(() => btn.style.animation = "", 300);

                alert(
                    `❌ Item Locked!\n` +
                    `Required: ${lockedItems[specificClass]} points\n` +
                    `You Have: ${userPoints} points`
                );
                return;
            }

            const type = detectType(src);
            if (type) addLayer(type, src, specificClass);
        });
    });

    // ======================================================
    //  DETECT LAYER TYPE (FEMALE SUPPORT ADDED)
    // ======================================================
    function detectType(src) {
        const lower = src.toLowerCase();

        if (lower.includes("head") || lower.includes("hat")) return "hat";
        if (lower.includes("shirt") || lower.includes("cloth")) return "shirt";
        if (lower.includes("pant")) return "pants";

        return null;
    }

    // ======================================================
    //  SAVE CHARACTER
    // ======================================================
    function saveCharacter() {
        const data = {
            username: usernameInput.value,
            gender: "female",
            hatClass: layers.hat?.classList[1] || null,
            shirtClass: layers.shirt?.classList[1] || null,
            pantsClass: layers.pants?.classList[1] || null,
            hat: layers.hat?.src || null,
            shirt: layers.shirt?.src || null,
            pants: layers.pants?.src || null,
        };

        localStorage.setItem(currentUser + "_character_female", JSON.stringify(data));
    }

    // ======================================================
    //  LOAD CHARACTER
    // ======================================================
    function loadCharacter() {
        const data = JSON.parse(localStorage.getItem(currentUser + "_character_female") || "{}");

        if (data.username) usernameInput.value = data.username;

        setBase();

        if (data.hat && data.hatClass) addLayer("hat", data.hat, data.hatClass);
        if (data.shirt && data.shirtClass) addLayer("shirt", data.shirt, data.shirtClass);
        if (data.pants && data.pantsClass) addLayer("pants", data.pants, data.pantsClass);

        updateName();
    }

    // ======================================================
    //  NAME LIVE UPDATE
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
        alert("✨ Female character saved!");
    };

    // ======================================================
    //  RESET BUTTON
    // ======================================================
    document.getElementById("resetCharacterBtn").onclick = () => {
        if (confirm("Reset female character?")) {
            localStorage.removeItem(currentUser + "_character_female");
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
    updateButtonLocks();
});

const femaleData = {
    hat: selectedHatSrc,
    hatClass: selectedHatClass,
    shirt: selectedShirtSrc,
    shirtClass: selectedShirtClass,
    pants: selectedPantsSrc,
    pantsClass: selectedPantsClass
};
localStorage.setItem(`${currentUser}_character_female`, JSON.stringify(femaleData));
localStorage.setItem(`${currentUser}_gender`, "female"); // switch to female immediately
