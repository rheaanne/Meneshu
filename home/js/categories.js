async function loadCategories() {
    const { data: categories, error } = await supabaseClient
        .from('categories')
        .select('*');

    if (error) {
        console.error('Error fetching categories:', error);
        return;
    }

    const categoriesTable = document.getElementById('categories-table');
    categoriesTable.innerHTML = '';

    categories.forEach(category => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${category.id}</td>
            <td>${category.name}</td>
            <td>${category.description}</td>
            <td><button onclick="deleteCategory(${category.id})">Delete</button></td>
        `;
        categoriesTable.appendChild(row);
    });
}

async function deleteCategory(id) {
    const { error } = await supabaseClient
        .from('categories')
        .delete()
        .eq('id', id);

    if (error) {
        alert('Failed to delete category.');
    } else {
        alert('Category deleted.');
        loadCategories();
    }
}

document.addEventListener('DOMContentLoaded', loadCategories);
