const form = document.getElementById("form");
const inputs = document.querySelectorAll("input");
const passwords = document.querySelectorAll("input[type='password']");
const inputPwd = document.getElementById("pwd");
const inputConfirm = document.getElementById("pwd-confirm");

let inputTimer;

form.addEventListener("submit", (event) => submitForm(event));

inputs.forEach((el) =>
  el.addEventListener("blur", (event) => validateInput(event.target), true)
);

passwords.forEach((el) =>
  el.addEventListener("input", () => {
    clearTimeout(inputTimer);
    inputTimer = setTimeout(validatePasswords, 1000);
  })
);

function submitForm(event) {
  inputs.forEach((el) => {
    validateInput(el);
    if (!el.validity.valid) {
      event.preventDefault();
    }
  });

  const firstInvalid = document.querySelector("input:invalid");
  if (firstInvalid) {
    firstInvalid.focus();
  }
}

function validateInput(el) {
  const isValid = el.validity.valid;
  toggleClass(el, isValid);
  toggleMessage(el, isValid);

  if (el.id.startsWith("pwd")) {
    validatePasswords();
  }
}

function validatePasswords() {
  if (inputPwd.value === "" || inputConfirm.value === "") {
    return false;
  }

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

function toggleClass(el, isValid) {
  el.className = isValid ? "valid" : "error";
}

function toggleMessage(el, isValid, msg = el.validationMessage) {
  const spanId = el.getAttribute("aria-describedby");
  const span = spanId ? document.getElementById(spanId) : false;

  if (span) {
    span.textContent = isValid ? "" : `\u26A0\uFE0E ${msg}`;
  }
}
