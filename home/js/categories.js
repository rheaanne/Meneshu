// Initialize Supabase client
const supabaseClient = supabase.createClient(
    'https://svvmxxkcqexwjzckuhgr.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2dm14eGtjcWV4d2p6Y2t1aGdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1ODAxMTAsImV4cCI6MjA1NjE1NjExMH0.kFg45Xd3W7GsDXpabYCO9PfmyLCDXNddl6dNK4H6UQ0'
);

// Function to load all categories
async function loadCategories() {
    const { data: categories, error } = await supabaseClient
        .from('categories')
        .select('*');

    if (error) {
        console.error('Error fetching categories:', error);
        return;
    }

    const categoriesTable = document.getElementById('categories-table');
    categoriesTable.innerHTML = ''; // Clear existing rows

    categories.forEach(category => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${category.id}</td>
            <td>${category.name}</td>
            <td>${category.description}</td>
            <td>
                <button onclick="deleteCategory(${category.id})">Delete</button>
            </td>
        `;
        categoriesTable.appendChild(row);
    });
}

// Function to add a new category
async function addCategory() {
    const name = document.getElementById('category-name').value.trim();
    const description = document.getElementById('category-description').value.trim();

    if (!name || !description) {
        alert('Please fill in all fields.');
        return;
    }

    const { error } = await supabaseClient
        .from('categories')
        .insert([{ name, description }]);

    if (error) {
        alert('Failed to add category.');
        console.error('Error adding category:', error);
    } else {
        alert('Category added successfully!');
        document.getElementById('category-name').value = ''; // Clear input
        document.getElementById('category-description').value = '';
        loadCategories(); // Refresh the list
    }
}

// Function to delete a category
async function deleteCategory(id) {
    const confirmDelete = confirm('Are you sure you want to delete this category?');
    if (!confirmDelete) return;

    const { error } = await supabaseClient
        .from('categories')
        .delete()
        .eq('id', id);

    if (error) {
        alert('Failed to delete category.');
        console.error('Error deleting category:', error);
    } else {
        alert('Category deleted successfully!');
        loadCategories(); // Refresh the list
    }
}

// Attach event listener to add category button
document.getElementById('add-category-btn').addEventListener('click', addCategory);

// Load categories when the page loads
document.addEventListener('DOMContentLoaded', loadCategories);
