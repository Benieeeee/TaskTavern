
const users = [];
for (let i = 1; i <= 30; i++) {
  users.push({ username: `Student${i}`, password: "Letran400" });
}

// Get elements
const form = document.getElementById("loginForm");
const usernameInput = document.getElementById("Username");
const passwordInput = document.getElementById("Password");
const messageBox = document.getElementById("message");

// Password rule elements
const letter = document.getElementById("letter");
const capital = document.getElementById("capital");
const number = document.getElementById("number");
const lengthEl = document.getElementById("length");

// Handle form submission securely
form.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent automatic redirect

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  // Check if the username and password match
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
  
    sessionStorage.setItem("loggedIn", "true");

    alert("Login successful! Welcome, " + username + "!");

    window.location.href = "Homepage/Home.html";
  } else {

    alert("Invalid username or password. Access denied.");
    usernameInput.value = "";
    passwordInput.value = "";
    usernameInput.focus();
  }
});

passwordInput.onfocus = function () {
  messageBox.style.display = "block";
};

passwordInput.onblur = function () {
  messageBox.style.display = "none";
};

passwordInput.onkeyup = function () {
  const value = passwordInput.value;

  // Validate lowercase
  if (/[a-z]/.test(value)) {
    letter.classList.remove("invalid");
    letter.classList.add("valid");
  } else {
    letter.classList.remove("valid");
    letter.classList.add("invalid");
  }

  // Validate uppercase
  if (/[A-Z]/.test(value)) {
    capital.classList.remove("invalid");
    capital.classList.add("valid");
  } else {
    capital.classList.remove("valid");
    capital.classList.add("invalid");
  }


  if (/[0-9]/.test(value)) {
    number.classList.remove("invalid");
    number.classList.add("valid");
  } else {
    number.classList.remove("valid");
    number.classList.add("invalid");
  }

  if (value.length >= 8) {
    lengthEl.classList.remove("invalid");
    lengthEl.classList.add("valid");
  } else {
    lengthEl.classList.remove("valid");
    lengthEl.classList.add("invalid");
  }
};





