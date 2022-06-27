document.addEventListener("blur", (event) => validateInput(event), true);

function validateInput(event) {
  const isValid = event.target.validity.valid;
  const message = event.target.validationMessage;
  const spanId = event.target.getAttribute("aria-describedby");
  const span = spanId ? document.getElementById(spanId) : false;

  if (isValid) {
    event.target.className = "valid";
  } else {
    event.target.className = "error";
  }

  if (span) {
    span.textContent = isValid ? "" : `\u26A0\uFE0E ${message}`;
  }
}
