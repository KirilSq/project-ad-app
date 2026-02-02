let signInSelectButton = document.getElementById("signin-select-btn");
let signUpSelectButton = document.getElementById("signup-select-btn");
let signUpElements = document.getElementsByClassName("signup-el");
let signInElements = document.getElementsByClassName("signin-el");

function updateDisplayFromSignMode() {
  Array.from(signUpElements).forEach((element) => {
    element.classList.toggle("hidden");
  });
  Array.from(signInElements).forEach((element) => {
    element.classList.toggle("hidden");
  });
}

signInSelectButton.addEventListener("click", () => {
  if (!signInSelectButton.classList.contains("active")) {
    signInSelectButton.classList.add("active");
    signUpSelectButton.classList.remove("active");
    updateDisplayFromSignMode();
  }
});

signUpSelectButton.addEventListener("click", () => {
  if (!signUpSelectButton.classList.contains("active")) {
    signUpSelectButton.classList.add("active");
    signInSelectButton.classList.remove("active");
    updateDisplayFromSignMode();
  }
});
