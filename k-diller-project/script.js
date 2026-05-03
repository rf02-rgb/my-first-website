const searchInput = document.getElementById("searchInput");
const searchDropdown = document.getElementById("searchDropdown");

searchInput.addEventListener("click", function(event) {
  event.stopPropagation();
  searchDropdown.classList.add("active");
});

searchDropdown.addEventListener("click", function(event) {
  event.stopPropagation();
});

document.addEventListener("click", function() {
  searchDropdown.classList.remove("active");
});