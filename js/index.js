import { setupNavbarElementsVisibility } from "./common.js";

async function initialize() {
  try {
    const response = await fetch("json/categories.json");
    const data = await response.json();
    renderCategories(data.categories);
    setupSearch();
    setupNavbarElementsVisibility();
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

function renderCategories(categories) {
  const categoryList = document.getElementById("category-list");

  categories.forEach((cat) => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="pages/listings.html?cat=${cat.slug}">${cat.name}</a>`;
    categoryList.appendChild(li);
  });
}

function setupSearch() {
  const searchInput = document.getElementById("product-name-search-bar-input");

  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const query = searchInput.value.trim();
      if (query === "") {
        window.location.href = `pages/listings.html`;
      } else {
        window.location.href = `pages/listings.html?search=${encodeURIComponent(query)}`;
      }
    }
  });
}

initialize();
