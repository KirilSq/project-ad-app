import {
  ref,
  set,
  remove,
  update,
} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";

import { createAd, setupNavbarElementsVisibility } from "./common.js";
import { database, auth, app } from "./firebase-config.js";

setupNavbarElementsVisibility();

const createAdBtn = document.getElementById("create-ad-btn");
const titleInput = document.getElementById("ad-title-input");
const descriptionInput = document.getElementById("ad-description-input");
const priceInput = document.getElementById("ad-price-input");
const categoryInput = document.getElementById("category-input");

if (createAdBtn && auth.currentUser) {
  createAdBtn.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = titleInput.value;
    const description = descriptionInput.value;
    const price = parseFloat(priceInput.value);
    const category = categoryInput.value;
    const userId = auth.currentUser.uid;

    try {
      const userSnapshot = await get(ref(db, `users/${userId}`));
      const userData = userSnapshot.exists() ? userSnapshot.val() : {};

      const adData = {
        userId: userId,
        userEmail: auth.currentUser.email || userData.email || "No email",
        userContactInfo: userData.contactInfo || "",
        title: title,
        description: description,
        price: price,
        category: category,
        createdAt: new Date().toISOString(),
      };

      const adId = await createAd(userId, adData);
      console.log("Created ad:", adId);

      titleInput.value = "";
      descriptionInput.value = "";
      priceInput.value = "";
    } catch (error) {
      console.error("Error creating ad: ", error);
      alert("Failed to create ad: " + error.message);
    }
  });
}

function addCategoriesToSelect(categories) {
  const categorySelect = document.getElementById("category-input");

  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat.slug;
    option.textContent = cat.name;
    categorySelect.appendChild(option);
  });
}

const response = await fetch("../json/categories.json");
const data = await response.json();
addCategoriesToSelect(data.categories);
