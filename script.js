
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (username === "praksha" && password === "praksha") {
    window.location.href = "home.html";
  } else {
    alert("Invalid credentials.");
  }
});
document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();
  
  window.location.href = "home.html";
});
