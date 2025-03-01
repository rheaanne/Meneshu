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
        updateData.password = password;
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
        window.location.href = "login.html";
    }
}

// Function to log out
function logout() {
    localStorage.removeItem("isAdminLoggedIn");
    window.location.href = "login.html";
}

// Ensure sections scroll smoothly without being covered by the header
document.addEventListener('DOMContentLoaded', function () {
    checkLogin();
    loadSettings();

    document.getElementById('save-settings').addEventListener('click', saveSettings);
    document.getElementById('logout-btn').addEventListener('click', logout);

    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    // Smooth scrolling for sidebar links
    document.querySelectorAll('.settings-sidebar a').forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const headerHeight = document.querySelector('header').offsetHeight; // Get header height
                const offsetTop = targetSection.offsetTop - headerHeight - 20; // Adjust offset to prevent overlap

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Ensure only the clicked section is centered
                document.querySelectorAll('.settings-card').forEach(section => {
                    section.classList.remove('active');
                });
                targetSection.classList.add('active');
            }
        });
    });

    // Handle form submissions
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            alert(`${this.id.replace('-form', '')} updated successfully!`);
        });
    });

    // Handle delete account
    document.getElementById('delete-account').addEventListener('click', function () {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            alert('Account deleted successfully!');
        }
    });
});
