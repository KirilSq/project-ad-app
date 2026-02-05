import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js";
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
  databaseURL: https://project-add-ap-default-rtdb.europe-west1.firebasedatabase.app/
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);


async function removeFromFavorites(userId, adId){
    try {
      await remove(ref(database , `users/${userId}/favorites/${adId}`));
    } catch(error){
        console.error("Error removing from favorites: ", error);
    }
    
}

