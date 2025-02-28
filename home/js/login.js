function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Sample hardcoded login credentials (replace with Supabase or DB check)
    if (username === "admin" && password === "admin123") {
        localStorage.setItem("isLoggedIn", "true"); // Save login state
        window.location.href = "admin.html"; // Redirect to dashboard
    } else {
        alert("Invalid credentials! Please try again.");
    }
}