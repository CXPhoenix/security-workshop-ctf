import "../src/index.css";

const form = document.querySelector("#form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchUrl = new URL("./search", "https://www.google.com/");
  searchUrl.searchParams.append("q", form["search-input"].value);
  window.location.href = searchUrl.href;
});

const searchInput = document.querySelector("#search-input");
searchInput.focus();

const submitButton = document.querySelector("#submit-button");
submitButton.addEventListener("click", () => {
  form.dispatchEvent(new Event("submit"));
});
