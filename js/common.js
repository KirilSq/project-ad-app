import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js";
import {
  ref,
  set,
  remove,
  update,
  push,
  child,
} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";

import { database, auth, app } from "./firebase-config.js";

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

export function setupNavbarElementsVisibility() {
  document.addEventListener("DOMContentLoaded", () => {
    toggleNavbarElementsVisibility(!!auth.currentUser);
    onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed, user:", user?.email);
      toggleNavbarElementsVisibility(!!user);
    });
  });
  //Todo: Refactor so the following addition isn't randomly in this method
  const signOutBtn = document.getElementById("signout-btn");
  if (signOutBtn) {
    signOutBtn.addEventListener("click", async () => {
      try {
        await signOut(auth);
        console.log("User signed out successfully");
      } catch (error) {
        console.error("Error signing out: ", error);
      }
    });
  }
}
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

export async function createAd(userId, adData) {
  const newAdKey = push(child(ref(database), "ads")).key;
  const updates = {};
  updates["ads/" + newAdKey] = adData;
  updates[`users/${userId}/ads/${newAdKey}`] = adData;

  return update(ref(database), updates);
}

export async function deleteAd(userId, adId) {
  const updates = {};
  updates["ads/" + adId] = null;
  updates[`users/${userId}/ads/${adId}`] = null;
  return update(ref(database), updates);
}

export function visualizeAds(ads, listElement, buttons) {
  listElement.innerHTML = "";

  if (!ads || ads.length === 0) {
    listElement.textContent = "No ads found.";
    return;
  }

  ads.forEach((ad) => {
    const li = document.createElement("li");
    li.className = "ad-card";

    li.innerHTML = `
      <div class="ad-content">
        <h3>${ad.title}</h3>
        <p class="category">${ad.category || "General"}</p>
        <p class="description">${ad.description}</p>
        <p class="price">€${parseFloat(ad.price).toFixed(2)}</p>
        <p class="meta">Posted by: ${ad.userEmail}</p>
      </div>
    `;

    if (buttons) {
      li.appendChild(buttons);
    }

    listElement.appendChild(li);
  });
}
