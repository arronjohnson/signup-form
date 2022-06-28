const INPUT_DELAY = 1000;
const WARNING_SYMBOL = "\u26A0\uFE0E";

const form = document.getElementById("form");
const inputConfirm = document.getElementById("pwd-confirm");
const inputPwd = document.getElementById("pwd");
const inputs = document.querySelectorAll(".form-input");
const passwords = document.querySelectorAll("input[type='password']");
const showPassword = document.getElementById("show-password");

let inputTimer;

/* EVENT LISTENERS */
form.addEventListener("submit", (e) => submitForm(e));
showPassword.addEventListener("change", () => togglePasswordVisibility());

inputs.forEach((el) =>
  el.addEventListener("blur", (e) => validateInput(e.target), true)
);

// delay validation while the user is typing
passwords.forEach((el) =>
  el.addEventListener("input", () => {
    clearTimeout(inputTimer);
    inputTimer = setTimeout(validatePasswords, INPUT_DELAY);
  })
);

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
    validatePasswords();
  }
}

function validatePasswords() {
  if (!inputPwd.validity.valid) return;

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
