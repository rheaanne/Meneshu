// Initialize Supabase
const SUPABASE_URL = "https://octxrfafjrjqknskrxxf.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jdHhyZmFmanJqcWtuc2tyeHhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0MDczODQsImV4cCI6MjA1NTk4MzM4NH0.8pQmRYVxPlxsic6Nx6bZVu0VVCffwfMg-koiAz2KRyo";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Handle Login with Email & Password
async function login(event) {
    event.preventDefault(); // Prevent form from refreshing page
    
    const email = document.querySelector("#loginModal input[type='email']").value;
    const password = document.querySelector("#loginModal input[type='password']").value;

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        alert("Login failed: " + error.message);
    } else {
        alert("Login successful! Redirecting...");
        window.location.href = "dashboard.html"; // Change to your desired page
    }
}

// Handle Sign-Up with Email & Password
async function signup(event) {
    event.preventDefault(); // Prevent form refresh

    const name = document.querySelector("#signupModal input[type='text']").value;
    const email = document.querySelector("#signupModal input[type='email']").value;
    const password = document.querySelector("#signupModal input[type='password']").value;
    const confirmPassword = document.querySelector("#signupModal input[type='password']:nth-child(4)").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { full_name: name }
        }
    });

    if (error) {
        alert("Sign-up failed: " + error.message);
    } else {
        alert("Sign-up successful! Please check your email to confirm your account.");
    }
}

// Handle Google Sign-In
async function loginWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin // Redirect after login
        }
    });

    if (error) {
        alert("Google login failed: " + error.message);
    }
}

// Check if User is Logged In
async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
        document.querySelector(".auth-buttons").innerHTML = `
            <p>Welcome, ${user.email}!</p>
            <button onclick="logout()" class="btn logout-btn">Logout</button>
        `;
    }
}

// Logout Function
async function logout() {
    await supabase.auth.signOut();
    alert("You have been logged out.");
    window.location.reload();
}

// Attach event listeners when the page loads
document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#loginModal form").addEventListener("submit", login);
    document.querySelector("#signupModal form").addEventListener("submit", signup);
    checkUser();
});
