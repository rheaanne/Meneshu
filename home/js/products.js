// Initialize Supabase client
const supabaseClient = supabase.createClient(
    'https://svvmxxkcqexwjzckuhgr.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2dm14eGtjcWV4d2p6Y2t1aGdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1ODAxMTAsImV4cCI6MjA1NjE1NjExMH0.kFg45Xd3W7GsDXpabYCO9PfmyLCDXNddl6dNK4H6UQ0'
);

// Function to load all products
async function loadProducts() {
    const { data: products, error } = await supabaseClient
        .from('products')
        .select('*');

    if (error) {
        console.error('Error fetching products:', error);
        return;
    }

    const productsTable = document.getElementById('products-table');
    productsTable.innerHTML = ''; // Clear existing rows

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

// Function to add a new product
async function addProduct(event) {
    event.preventDefault(); // Prevent page reload

    const name = document.getElementById('product-name').value.trim();
    const price = parseFloat(document.getElementById('product-price').value);
    const category = document.getElementById('product-category').value.trim();
    const stock = parseInt(document.getElementById('product-stock').value, 10);

    if (!name || !price || !category || !stock) {
        alert("Please fill in all fields.");
        return;
    }

    const { error } = await supabaseClient
        .from('products')
        .insert([{ name, price, category, stock }]);

    if (error) {
        alert("Failed to add product.");
    } else {
        alert("Product added successfully!");
        document.getElementById('add-product-form').reset(); // Clear form
        loadProducts(); // Refresh product list
    }
}

// Function to delete a product
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

// Attach event listener to the form
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    document.getElementById('add-product-form').addEventListener('submit', addProduct);
});
