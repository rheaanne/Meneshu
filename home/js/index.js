import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://octxrfafjrjqknskrxxf.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jdHhyZmFmanJqcWtuc2tyeHhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0MDczODQsImV4cCI6MjA1NTk4MzM4NH0.8pQmRYVxPlxsic6Nx6bZVu0VVCffwfMg-koiAz2KRyo'; // Replace with your Supabase Anon Key
const supabase = createClient(supabaseUrl, supabaseKey);

// Handle Login with Email & Password
async function login(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorDisplay = document.getElementById('loginError');
    errorDisplay.textContent = ''; // Clear previous errors

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        errorDisplay.textContent = 'Login failed: ' + error.message;
    } else {
        alert('Login successful! Redirecting...');
        window.location.href = 'dashboard.html'; // Change to your desired page
    }
}

// Handle Sign-Up with Email & Password
async function signup(event) {
    event.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorDisplay = document.getElementById('signupError');
    errorDisplay.textContent = ''; // Clear previous errors

    if (password !== confirmPassword) {
        errorDisplay.textContent = 'Passwords do not match!';
        return;
    }

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
    });

    if (error) {
        errorDisplay.textContent = 'Sign-up failed: ' + error.message;
    } else {
        alert('Sign-up successful! Please check your email to confirm your account.');
    }
}

// Handle Google Sign-In
async function loginWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }, // Redirect after login
    });

    if (error) {
        alert('Google login failed: ' + error.message);
    }
}

// Check if User is Logged In
async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        document.querySelector('.auth-buttons').innerHTML = `
            <p>Welcome, ${user.email}!</p>
            <button onclick="logout()" class="btn logout-btn">Logout</button>
        `;
    }
}

// Logout Function
async function logout() {
    await supabase.auth.signOut();
    alert('You have been logged out.');
    window.location.reload();
}

// Attach event listeners when the page loads
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginForm').addEventListener('submit', login);
    document.getElementById('signupForm').addEventListener('submit', signup);
    checkUser();
});