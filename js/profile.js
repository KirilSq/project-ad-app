import {
  ref,
  set,
  remove,
  update,
} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";

import { setupNavbarElementsVisibility } from "./common.js";
import { database, auth, app } from "./firebase-config.js";

setupNavbarElementsVisibility();

async function loadUserProfile(userId) {
  const emailInfo = document.getElementById("email-info");
  const contactInfo = document.getElementById("contact-info");
  const descriptionInfo = document.getElementById("description-info");
  const personalAdsList = document.getElementById("personal-ads-list");
  const balanceInfo = document.querySelector("#balance-info");
  const dbRef = ref(database);
  get(child(dbRef, `users/${userId}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
        const userData = snapshot.val();
        emailInfo.textContent = userData.email;
        contactInfo.textContent = userData.contactInfo;
        descriptionInfo.textContent = userData.description;
        balanceInfo.textContent = `€${userData.balance.toFixed(2)}`;
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    loadUserProfile(user.uid);
  }
});
