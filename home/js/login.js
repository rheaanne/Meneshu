document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent page reload

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Hardcoded credentials for testing (replace with DB check)
    if (username === "admin" && password === "admin123") {
        localStorage.setItem("isAdminLoggedIn", "true"); // Save session
        window.location.href = "admin.html"; // Redirect to dashboard
    } else {
        document.getElementById("error-message").textContent = "Invalid login credentials.";
    }
});
