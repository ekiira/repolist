const input = document.querySelector(".search-input");
const button = document.querySelector(".search-button");

button.addEventListener("click", () => {
  localStorage.setItem("user", input.value);
  input.value = ''
  window.location.href = "user.html";
});
