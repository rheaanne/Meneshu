// Initialize Supabase client
const supabaseClient = supabase.createClient(
    'https://svvmxxkcqexwjzckuhgr.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2dm14eGtjcWV4d2p6Y2t1aGdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1ODAxMTAsImV4cCI6MjA1NjE1NjExMH0.kFg45Xd3W7GsDXpabYCO9PfmyLCDXNddl6dNK4H6UQ0'
);

// Function to load current settings
async function loadSettings() {
    const { data: settings, error } = await supabaseClient
        .from('admin_settings')
        .select('*')
        .single();

    if (error) {
        console.error('Error fetching settings:', error);
        return;
    }

    // Populate fields with existing settings
    document.getElementById('admin-username').value = settings.username || '';
    document.getElementById('theme-selector').value = settings.theme || 'light';
}

// Function to save settings
async function saveSettings() {
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;
    const theme = document.getElementById('theme-selector').value;

    let updateData = { username, theme };

    if (password.trim() !== '') {
        updateData.password = password; // Only update password if entered
    }

    const { error } = await supabaseClient
        .from('admin_settings')
        .update(updateData)
        .eq('id', 1);

    if (error) {
        alert('Failed to save settings.');
        console.error('Error updating settings:', error);
    } else {
        alert('Settings updated successfully!');
        applyTheme(theme);
    }
}

// Function to apply selected theme
function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
    }
}

// Function to check if the user is logged in
function checkLogin() {
    if (localStorage.getItem("isAdminLoggedIn") !== "true") {
        window.location.href = "login.html"; // Redirect to login if not logged in
    }
}

// Function to log out
function logout() {
    localStorage.removeItem("isAdminLoggedIn"); // Remove login session
    window.location.href = "login.html"; // Redirect to login page
}

// Load settings when the page is ready
document.addEventListener('DOMContentLoaded', function () {
    checkLogin(); // Ensure user is logged in
    loadSettings(); // Load current settings

    // Attach event listeners
    document.getElementById('save-settings').addEventListener('click', saveSettings);
    document.getElementById('logout-btn').addEventListener('click', logout);

    // Apply saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
});

document.addEventListener('DOMContentLoaded', function () {
    // Handle profile form submission
    document.getElementById('profile-form').addEventListener('submit', function (event) {
        event.preventDefault();
        // Add your form submission logic here
        alert('Profile updated successfully!');
    });

    // Handle password form submission
    document.getElementById('password-form').addEventListener('submit', function (event) {
        event.preventDefault();
        // Add your form submission logic here
        alert('Password changed successfully!');
    });

    // Handle notification preferences form submission
    document.getElementById('notification-form').addEventListener('submit', function (event) {
        event.preventDefault();
        // Add your form submission logic here
        alert('Notification preferences updated successfully!');
    });

    // Handle privacy settings form submission
    document.getElementById('privacy-form').addEventListener('submit', function (event) {
        event.preventDefault();
        // Add your form submission logic here
        alert('Privacy settings updated successfully!');
    });

    // Handle account settings form submission
    document.getElementById('account-form').addEventListener('submit', function (event) {
        event.preventDefault();
        // Add your form submission logic here
        alert('Account settings updated successfully!');
    });

    // Handle delete account button click
    document.getElementById('delete-account').addEventListener('click', function () {
        // Add your delete account logic here
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            alert('Account deleted successfully!');
        }
    });
});