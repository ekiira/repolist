localStorage.removeItem("user");

const input = document.querySelector(".search-input");
const button = document.querySelector(".search-button");
const message = document.querySelector(".message");

button.addEventListener("click", () => {
  if (input.value) {
    message.textContent = "";
    localStorage.setItem("user", input.value);
    input.value = "";
    window.location.href = "user.html";
  } else {
    message.textContent = "Please enter username";
  }
});
