// Initialize Supabase client
console.log("Admin script is running!");

const { createClient } = supabase;
const supabaseClient = createClient(
    'https://svvmxxkcqexwjzckuhgr.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2dm14eGtjcWV4d2p6Y2t1aGdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1ODAxMTAsImV4cCI6MjA1NjE1NjExMH0.kFg45Xd3W7GsDXpabYCO9PfmyLCDXNddl6dNK4H6UQ0'
);

async function loadDashboardStats() {
    try {
        console.log("Fetching total orders and products...");

        // Fetch total orders count from `orders` table
        let { count: totalOrders, error: ordersError } = await supabaseClient
            .from('orders')
            .select('*', { count: 'exact', head: true });

        // Fetch total products count from `order_items` table
        let { count: totalProducts, error: productsError } = await supabaseClient
            .from('order_items')
            .select('*', { count: 'exact', head: true });

        console.log("Total Orders:", totalOrders);
        console.log("Total Products:", totalProducts);

        if (ordersError) console.error("Orders Error:", ordersError);
        if (productsError) console.error("Products Error:", productsError);

        // Update the UI
        document.getElementById('total-orders').textContent = `Total Orders: ${totalOrders ?? 0}`;
        document.getElementById('total-products').textContent = `Total Products: ${totalProducts ?? 0}`;

    } catch (error) {
        console.error("Error loading dashboard stats:", error);
    }
}

// Function to load all orders
async function loadOrders() {
    const { data: orders, error } = await supabaseClient
        .from('orders')
        .select('*');

    if (error) {
        console.error('Error loading orders:', error);
        return;
    }

    const ordersTable = document.getElementById('orders-table');
    ordersTable.innerHTML = ''; // Clear existing rows

    orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.name}</td>
            <td>${order.phone}</td>
            <td>${order.address}</td>
            <td>₱${order.total_amount ? order.total_amount.toFixed(2) : "0.00"}</td>
            <td class="${order.status.replace(/\s/g, '-')}">${order.status}</td>
            <td>
                <select onchange="updateOrderStatus(${order.id}, this.value)">
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="preparing" ${order.status === 'preparing' ? 'selected' : ''}>Preparing</option>
                    <option value="out for delivery" ${order.status === 'out for delivery' ? 'selected' : ''}>Out for Delivery</option>
                    <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                </select>
            </td>
        `;
        ordersTable.appendChild(row);
    });
}

// Function to update order status
async function updateOrderStatus(orderId, newStatus) {
    const { error } = await supabaseClient
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

    if (error) {
        console.error('Error updating status:', error);
        alert('Failed to update status');
    } else {
        alert('Order status updated successfully');
        loadOrders(); // Refresh orders list
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

// Event listeners
document.addEventListener("DOMContentLoaded", function () {
    checkLogin(); // Ensure login check happens on page load
    loadOrders(); // Load orders on page load
    loadDashboardStats(); // Load total orders & products

    // Attach event listener to logout button
    document.getElementById("logout-btn").addEventListener("click", logout);
});
