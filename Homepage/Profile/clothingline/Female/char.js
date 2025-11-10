document.addEventListener("DOMContentLoaded", () => {
  const clothingContainer = document.getElementById("characterDisplay");
  const btnMale = document.getElementById("btnMale");
  const btnFemale = document.getElementById("btnFemale");
  const usernameInput = document.getElementById("usernameInput");
  const nameDisplay = document.getElementById("charNameDisplay");

  const layers = { base: null, hair: null, shirt: null, pants: null, accessory: null };

  function clearCharacter() {
    clothingContainer.innerHTML = "";
    Object.keys(layers).forEach(k => layers[k] = null);
  }

  function setBase(gender) {
    clearCharacter();
    const base = document.createElement("img");
    base.src = gender === "male" ? "../Customization/Body M.png" : "../Customization/Body F.png";
    base.className = "base";
    clothingContainer.appendChild(base);
    layers.base = base;
    localStorage.setItem("gender", gender);
    saveCharacter();
  }

  function addLayer(type, src) {
    if (layers[type]) layers[type].remove();
    const img = document.createElement("img");
    img.src = src;
    img.className = type;
    clothingContainer.appendChild(img);
    layers[type] = img;
    saveCharacter();
  }

  btnMale.onclick = () => setBase("male");
  btnFemale.onclick = () => setBase("female");

  document.querySelectorAll(".collapsible").forEach(btn => {
    btn.addEventListener("click", function () {
      const content = this.nextElementSibling;
      content.style.maxHeight = content.style.maxHeight ? null : content.scrollHeight + "px";
    });
  });

  document.querySelectorAll(".content button img").forEach(img => {
    img.parentElement.addEventListener("click", () => {
      const src = img.getAttribute("src");
      const type = detectType(src);
      addLayer(type, src);
    });
  });

  function detectType(src) {
    if (src.includes("Head")) return "hair";
    if (src.includes("Clothing")) return "shirt";
    if (src.includes("Pants")) return "pants";
  }

  function saveCharacter() {
    const data = {
      username: usernameInput.value,
      gender: localStorage.getItem("gender"),
      hair: layers.hair?.src || null,
      shirt: layers.shirt?.src || null,
      pants: layers.pants?.src || null,
    };
    localStorage.setItem("characterData", JSON.stringify(data));
  }

  function loadCharacter() {
    const data = JSON.parse(localStorage.getItem("characterData") || "{}");
    if (data.username) usernameInput.value = data.username;
    if (data.gender) setBase(data.gender);
    if (data.hair) addLayer("hair", data.hair);
    if (data.shirt) addLayer("shirt", data.shirt);
    if (data.pants) addLayer("pants", data.pants);
    if (data.accessory) addLayer("accessory", data.accessory);
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
    }
  };

  loadCharacter();
});
