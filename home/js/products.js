const supabaseClient = supabase.createClient(
    'https://svvmxxkcqexwjzckuhgr.supabase.co',
    'your-anon-key'
);

async function loadProducts() {
    const { data: products, error } = await supabaseClient
        .from('products')
        .select('*');

    if (error) {
        console.error('Error fetching products:', error);
        return;
    }

    const productsTable = document.getElementById('products-table');
    productsTable.innerHTML = '';

    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>₱${product.price.toFixed(2)}</td>
            <td>${product.stock}</td>
            <td>
                <button onclick="deleteProduct(${product.id})">Delete</button>
            </td>
        `;
        productsTable.appendChild(row);
    });
}

async function deleteProduct(id) {
    const { error } = await supabaseClient
        .from('products')
        .delete()
        .eq('id', id);

    if (error) {
        alert('Failed to delete product.');
    } else {
        alert('Product deleted.');
        loadProducts();
    }
}

document.addEventListener('DOMContentLoaded', loadProducts);
