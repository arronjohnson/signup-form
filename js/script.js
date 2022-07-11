const INPUT_DELAY = 1000;
const PASSWORD_MIN_LENGTH = 8;
const WARNING_SYMBOL = "\u26A0\uFE0E";

const form = document.getElementById("form");
const inputConfirm = document.getElementById("pwd-confirm");
const inputPwd = document.getElementById("pwd");
const inputs = document.querySelectorAll(".form-input");
const listItems = document.querySelectorAll(".form-list li");
const listBullets = document.querySelectorAll(".form-list i");
const passwords = document.querySelectorAll("input[type='password']");
const showPassword = document.getElementById("show-password");

let inputTimer;

/* EVENT LISTENERS */
form.addEventListener("submit", (e) => submitForm(e));
showPassword.addEventListener("change", () => togglePasswordVisibility());

inputs.forEach((el) =>
  el.addEventListener("blur", (e) => validateInput(e.target), true)
);

passwords.forEach((el) => el.addEventListener("input", validatePasswords));

/* FORM FUNCTIONS */
function submitForm(event) {
  // prevent submission to avoid 405 errors
  event.preventDefault();
  // trigger error classes for all invalid fields
  inputs.forEach((el) => validateInput(el));

  const firstInvalid = document.querySelector("input:invalid");
  if (firstInvalid) {
    firstInvalid.focus();
  } else {
    // reset the form to simulate valid submission
    form.reset();
    inputs.forEach((el) => el.classList.remove("valid"));
    listBullets.forEach((el) => (el.className = "far fa-square"));
  }
}

function togglePasswordVisibility() {
  const newType = showPassword.checked ? "text" : "password";
  passwords.forEach((el) => (el.type = newType));
}

/* VALIDATION FUNCTIONS */
function validateInput(el) {
  const isValid = el.validity.valid;
  toggleClass(el, isValid);
  toggleMessage(el, isValid);

  if (el.id.startsWith("pwd")) {
    comparePasswords();
  }
}

function validatePasswords() {
  checkPwdRequirements();
  // delay validation while the user is typing
  clearTimeout(inputTimer);
  inputTimer = setTimeout(comparePasswords, INPUT_DELAY);
}

function checkPwdRequirements() {
  const password = inputPwd.value;
  const validations = [
    password.match(/[a-z]/),
    password.match(/[A-Z]/),
    password.match(/[0-9]/),
    password.length >= PASSWORD_MIN_LENGTH,
  ];

  // change the bullet icon to alert validity to the user
  for (let i = 0; i < listItems.length; i++) {
    const glyph = listItems[i].querySelector("i");

    if (validations[i]) {
      glyph.className = "i-active fas fa-square-check";
    } else {
      glyph.className = "far fa-square";
    }
  }
}

function comparePasswords() {
  if (!inputPwd.validity.valid) return;
  if (inputPwd.value == "" || inputConfirm.value == "") return;

  const match = passwordsMatch();
  const msg = match ? "" : "Passwords don't match";
  passwords.forEach((el) => {
    toggleClass(el, match);
    toggleMessage(el, match, msg);
  });
  inputConfirm.setCustomValidity(msg);
}

function passwordsMatch() {
  return inputPwd.value !== "" && inputPwd.value === inputConfirm.value;
}

/* VALIDATION STYLES */
function toggleClass(el, isValid) {
  if (isValid) {
    el.classList.add("valid");
    el.classList.remove("error");
  } else {
    el.classList.add("error");
    el.classList.remove("valid");
  }
}

function toggleMessage(el, isValid, msg = el.validationMessage) {
  const spanId = el.getAttribute("aria-describedby");
  const span = spanId ? document.getElementById(spanId) : false;

  if (span) {
    span.textContent = isValid ? "" : `${WARNING_SYMBOL} ${msg}`;
  }
}
