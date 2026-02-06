import {
  ref,
  get,
  set,
  remove,
  update,
} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";

import { visualizeAds, setupNavbarElementsVisibility } from "./common.js";
import { database, auth, app } from "./firebase-config.js";

setupNavbarElementsVisibility();
const adsListElement = document.getElementById("ads-list");

let allAds = [];

function filterAndSortAds(
  allAds = [],
  parameters = {
    "min-price": null,
    "max-price": null,
    search: null,
    cat: null,
    "sort-by": null,
  },
) {
  let filteredAndSortedAds = [];
  if (!allAds || allAds.length === 0) {
    console.log("No ads to filter and sort");
    return [];
  }
  filteredAndSortedAds = [...allAds];
  console.log("filteredCount", filteredAndSortedAds.length);
  if (parameters["min-price"] !== null) {
    filteredAndSortedAds = filteredAndSortedAds.filter(
      (ad) => ad.price >= parameters["min-price"],
    );
  }
  console.log("filteredCount", filteredAndSortedAds.length);

  if (parameters["max-price"] !== null) {
    filteredAndSortedAds = filteredAndSortedAds.filter(
      (ad) => ad.price <= parameters["max-price"],
    );
  }
  if (parameters["search"] !== null && parameters["search"] !== "") {
    filteredAndSortedAds = filteredAndSortedAds.filter((ad) =>
      ad.title.toLowerCase().includes(parameters["search"].toLowerCase()),
    );
  }
  if (parameters["cat"] !== null && parameters["cat"] !== "") {
    filteredAndSortedAds = filteredAndSortedAds.filter(
      (ad) => ad.category === parameters["cat"],
    );
  }

  if (parameters["sort-by"] === "price-ascending") {
    filteredAndSortedAds.sort((a, b) => a.price - b.price);
  } else if (parameters["sort-by"] === "price-descending") {
    filteredAndSortedAds.sort((a, b) => b.price - a.price);
  }
  console.log("filteredCount", filteredAndSortedAds.length);

  return filteredAndSortedAds;
}

function visualizeAdsWithCurrentSearchParameters() {
  const urlParams = new URLSearchParams(window.location.search);
  const parameters = {
    "min-price": urlParams.get("min-price")
      ? parseFloat(urlParams.get("min-price"))
      : null,
    "max-price": urlParams.get("max-price")
      ? parseFloat(urlParams.get("max-price"))
      : null,
    search: urlParams.get("search") || null,
    cat: urlParams.get("cat") || null,
    "sort-by": urlParams.get("sort-by") || null,
  };
  const filteredAndSortedAds = filterAndSortAds(allAds, parameters);
  console.log("Filtered and sorted ads count:", filteredAndSortedAds.length);
  visualizeAds(filteredAndSortedAds, adsListElement, null);
}

const minPriceFilter = document.getElementById("min-price-filter");
const maxPriceFilter = document.getElementById("max-price-filter");
const sortByOption = document.getElementById("sort-select");
const categoryFilter = document.getElementById("category-filter");
const searchBar = document.getElementById("product-name-search-bar-input");

function updateURLSearchParameters() {
  const minPrice = minPriceFilter.value;
  const maxPrice = maxPriceFilter.value;
  const sortBy = sortByOption.value;
  const category = categoryFilter.value;
  const searchQuery = searchBar.value.trim();
  const urlParams = new URLSearchParams(window.location.search);

  if (minPrice !== "") {
    urlParams.set("min-price", minPrice);
  } else {
    urlParams.delete("min-price");
  }

  if (maxPrice !== "") {
    urlParams.set("max-price", maxPrice);
  } else {
    urlParams.delete("max-price");
  }

  if (sortBy && sortBy !== "price-ascending") {
    // Assuming price-ascending is default
    urlParams.set("sort-by", sortBy);
  } else {
    urlParams.delete("sort-by");
  }

  if (category && category !== "") {
    urlParams.set("cat", category);
  } else {
    urlParams.delete("cat");
  }

  if (searchQuery !== "") {
    urlParams.set("search", searchQuery);
  } else {
    urlParams.delete("search");
  }

  window.history.replaceState(
    {},
    "",
    `${window.location.pathname}?${urlParams}`,
  );
}

function clearFormAndSearchbar() {
  minPriceFilter.value = "";
  maxPriceFilter.value = "";
  sortByOption.value = "price-ascending";
  categoryFilter.value = "";
  searchBar.value = "";
}

document
  .getElementById("filter-and-sort-form")
  .addEventListener("submit", (e) => {
    e.preventDefault();
    updateURLSearchParameters();
    clearFormAndSearchbar();
    visualizeAdsWithCurrentSearchParameters();
  });

searchBar.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    updateURLSearchParameters();
    clearFormAndSearchbar();
    visualizeAdsWithCurrentSearchParameters();
  }
});

async function init() {
  try {
    const snapshot = await get(ref(database, "ads"));
    console.log("Loaded ads snapshot:", snapshot);
    if (snapshot.exists()) {
      const data = snapshot.val();
      allAds = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
      visualizeAdsWithCurrentSearchParameters();
    } else {
      console.log("No ads available");
    }
  } catch (error) {
    console.error("Error loading ads:", error);
  }
}

await init();
