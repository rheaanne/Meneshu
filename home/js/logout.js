document.getElementById("logout-btn").addEventListener("click", function() {
    localStorage.removeItem("isAdminLoggedIn");
    window.location.href = "login.html"; // Redirect to login
});
