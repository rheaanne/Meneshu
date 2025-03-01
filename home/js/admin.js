// Initialize Supabase client correctly
console.log("Admin script is running!");

const { createClient } = supabase || window.supabase;
const supabaseClient = createClient(
    'https://svvmxxkcqexwjzckuhgr.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2dm14eGtjcWV4d2p6Y2t1aGdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1ODAxMTAsImV4cCI6MjA1NjE1NjExMH0.kFg45Xd3W7GsDXpabYCO9PfmyLCDXNddl6dNK4H6UQ0' 
);

// Function to load dashboard statistics
async function loadDashboardStats() {
    try {
        console.log("Fetching total orders, products, and sales...");

        // Fetch total orders count from `orders`
        let { count: totalOrders, error: ordersError } = await supabaseClient
            .from('orders')
            .select('*', { count: 'exact', head: true });

        // Fetch total unique products from `order_items`
        let { data: totalProductsData, error: productsError } = await supabaseClient
            .from('order_items')
            .select('product_id', { count: 'exact' });

        // Fetch total sales amount
        let { data: totalSalesData, error: salesError } = await supabaseClient
            .from('orders')
            .select('SUM(total_amount)', { head: true });

        // Extract total sales
        let totalSales = totalSalesData?.[0]?.sum || 0;

        console.log("Total Orders:", totalOrders || 0);
        console.log("Total Products:", totalProductsData?.length || 0);
        console.log("Total Sales: ₱", totalSales.toFixed(2));

        if (ordersError) console.error("Orders Error:", ordersError);
        if (productsError) console.error("Products Error:", productsError);
        if (salesError) console.error("Sales Error:", salesError);

      // Update UI with correct values (no duplicated labels)
        document.getElementById('total-orders').textContent = totalOrders ?? 0;
        document.getElementById('total-products').textContent = totalProducts ?? 0;
        document.getElementById('total-sales').textContent = totalSales.toFixed(2);

    } catch (error) {
        console.error("Error loading dashboard stats:", error);
    }
}

// Function to load all orders with items
async function loadOrders() {
    try {
        console.log("Fetching orders and order items...");

        // Fetch orders from the 'orders' table
        const { data: orders, error: ordersError } = await supabaseClient
            .from('orders')
            .select('*');

        if (ordersError) throw ordersError;

        // Fetch order items from the 'order_items' table
        const { data: orderItems, error: itemsError } = await supabaseClient
            .from('order_items')
            .select('*');

        if (itemsError) throw itemsError;

        // Create a map of order_id -> items (to group items under each order)
        const orderItemsMap = {};
        orderItems.forEach(item => {
            if (!orderItemsMap[item.order_id]) {
                orderItemsMap[item.order_id] = [];
            }
            orderItemsMap[item.order_id].push(item);
        });

        // Select the orders table in the HTML
        const ordersTable = document.getElementById('orders-table');
        ordersTable.innerHTML = ''; // Clear existing rows

        // Loop through each order and display its details
        orders.forEach(order => {
            const row = document.createElement('tr');

            // Fetch the items for this specific order
            const items = orderItemsMap[order.id] || [];

            // Generate item names and quantities as a list
            let itemsHTML = items.map(item => `
                <div>${item.item_name} (x${item.quantity})</div>
            `).join('');

            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.name || "N/A"}</td>
                <td>${order.phone || "N/A"}</td>
                <td>${order.address || "N/A"}</td>
                <td>${itemsHTML || "No Items"}</td>
                <td>${items.reduce((sum, item) => sum + item.quantity, 0)}</td>
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

    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

// Function to update order status
async function updateOrderStatus(orderId, newStatus) {
    try {
        const { error } = await supabaseClient
            .from('orders')
            .update({ status: newStatus })
            .eq('id', orderId);

        if (error) throw error;

        alert('Order status updated successfully');
        loadOrders(); // Refresh orders list

    } catch (error) {
        console.error('Error updating status:', error);
        alert('Failed to update status');
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
