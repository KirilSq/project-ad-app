import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  remove,
} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBlAIqRDsb7bM_BgogJGMikHQlC-mndwOk",
  authDomain: "project-add-ap.firebaseapp.com",
  projectId: "project-add-ap",
  storageBucket: "project-add-ap.firebasestorage.app",
  messagingSenderId: "278432857215",
  appId: "1:278432857215:web:89e7bffb14e2d9af50934a",
  measurementId: "G-8ZRG7HCHH5",
  databaseURL:
    "https://project-add-ap-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

function toggleNavbarElementsVisibility(isLoggedIn) {
  const userOnlyElements = document.getElementsByClassName("user-only");
  const guestOnlyElements = document.getElementsByClassName("guest-only");
  Array.from(userOnlyElements).forEach((el) => {
    el.style.display = isLoggedIn ? "block" : "none";
  });
  Array.from(guestOnlyElements).forEach((el) => {
    el.style.display = isLoggedIn ? "none" : "block";
  });
}

onAuthStateChanged(auth, (user) => {
  toggleNavbarElementsVisibility(!!user);
});

document.addEventListener("DOMContentLoaded", () => {
  toggleNavbarElementsVisibility(!!auth.currentUser);
});

async function removeFromFavorites(userId, adId) {
  try {
    await remove(ref(database, `users/${userId}/favorites/${adId}`));
  } catch (error) {
    console.error("Error removing from favorites: ", error);
  }
}

async function addToFavorites(userId, adId) {
  try {
    await set(ref(database, `users/${userId}/favorites/${adId}`), true);
  } catch (error) {
    console.error("Error adding to favorites: ", error);
  }
}

async function addToCart(userId, adId) {
  try {
    await set(ref(database, `users/${userId}/cart/${adId}`), true);
    return true;
  } catch (error) {
    console.error("Error adding to cart: ", error);
    return false;
  }
}

async function removeFromCart(userId, adId) {
  try {
    await remove(ref(database, `users/${userId}/cart/${adId}`));
    return true;
  } catch (error) {
    console.error("Error removing from cart: ", error);
    return false;
  }
}

async function updateUserBalance(userId, newBalance) {
  try {
    await set(ref(database, `users/${userId}/balance`), newBalance);
    return true;
  } catch (error) {
    console.error("Error updating balance: ", error);
    return false;
  }
}

async function updateUserDescription(userId, newDescription) {
  try {
    await set(ref(database, `users/${userId}/description`), newDescription);
    return true;
  } catch (error) {
    console.error("Error updating description: ", error);
    return false;
  }
}
