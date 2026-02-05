import {
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";

import { database, auth, app } from "./firebase-config.js";

const signInSelectButton = document.getElementById("signin-select-btn");
const signUpSelectButton = document.getElementById("signup-select-btn");
const signUpElements = document.getElementsByClassName("signup-el");
const signInElements = document.getElementsByClassName("signin-el");
const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");
const signInBtn = document.querySelector(".submit-btn.signin-el");
const signUpBtn = document.querySelector(".submit-btn.signup-el");

async function writeInitialUserData(userId, email) {
  try {
    await set(ref(database, `users/${userId}`), {
      email: email,
      balance: 0,
      contactInfo: "",
      favorites: {},
      cart: {},
      ads: {},
      description: "",
    });
  } catch (error) {
    console.error("Error writing initial user data: ", error);
  }
}

if (signUpBtn) {
  signUpBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      await writeInitialUserData(user.uid, email);
      window.location.href = "../index.html";
    } catch (error) {
      console.error("Registration error:", error.code, error.message);
      alert("Registration failed: " + error.message);
    }
  });
}

if (signInBtn) {
  signInBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        window.location.href = "../index.html";
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Sign-in error:", errorCode, errorMessage);
        alert("Sign-in failed:" + errorMessage);
      });
  });
}

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
