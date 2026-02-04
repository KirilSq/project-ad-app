import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBlAIqRDsb7bM_BgogJGMikHQlC-mndwOk",
  authDomain: "project-add-ap.firebaseapp.com",
  projectId: "project-add-ap",
  storageBucket: "project-add-ap.firebasestorage.app",
  messagingSenderId: "278432857215",
  appId: "1:278432857215:web:89e7bffb14e2d9af50934a",
  measurementId: "G-8ZRG7HCHH5",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

const signInSelectButton = document.getElementById("signin-select-btn");
const signUpSelectButton = document.getElementById("signup-select-btn");
const signUpElements = document.getElementsByClassName("signup-el");
const signInElements = document.getElementsByClassName("signin-el");
const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");
const signInBtn = document.querySelector(".submit-btn.signin-el");
const signUpBtn = document.querySelector(".submit-btn.signup-el");

if (signUpBtn) {
  signUpBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        window.location.href = "index.html";
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Registration error:", errorCode, errorMessage);
        alert("Registration failed:" + errorMessage);
      });
  });
}

if (signInBtn) {
  signInBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        window.location.href = "index.html";
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
