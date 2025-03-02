console.log("Admin script is running!");

// Ensure Supabase is correctly initialized
const supabaseClient = supabase.createClient(
    'https://svvmxxkcqexwjzckuhgr.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2dm14eGtjcWV4d2p6Y2t1aGdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1ODAxMTAsImV4cCI6MjA1NjE1NjExMH0.kFg45Xd3W7GsDXpabYCO9PfmyLCDXNddl6dNK4H6UQ0'
);

console.log("Supabase client initialized:", supabaseClient);

// Load dashboard stats
async function loadDashboardStats() {
    try {
        console.log("Fetching total orders and total sales...");

        let { count: totalOrders, error: ordersError } = await supabaseClient
            .from('orders')
            .select('*', { count: 'exact' });

        if (ordersError) {
            console.error("Orders Fetch Error:", ordersError);
            totalOrders = 0;
        }

        let { data: totalSalesData, error: salesError } = await supabaseClient
            .from('orders')
            .select('total_amount');

        if (salesError) {
            console.error("Sales Fetch Error:", salesError);
            totalSalesData = [];
        }

        let totalSales = totalSalesData.reduce((sum, order) => sum + (order.total_amount || 0), 0);

        console.log("Total Orders:", totalOrders);
        console.log("Total Sales: ₱", totalSales.toFixed(2));

        // Ensure elements exist before updating
        const totalOrdersElement = document.getElementById('total-orders');
        const totalSalesElement = document.getElementById('total-sales');

        if (totalOrdersElement) totalOrdersElement.textContent = totalOrders;
        if (totalSalesElement) totalSalesElement.textContent = `₱${totalSales.toFixed(2)}`;

    } catch (error) {
        console.error("Error loading dashboard stats:", error);
    }
}

// Load orders from Supabase
async function loadOrders() {
    try {
        console.log("Fetching orders...");

        const { data: orders, error: ordersError } = await supabaseClient
            .from('orders')
            .select('*');

        if (ordersError) throw ordersError;
        console.log("Orders Data:", orders);

        const { data: orderItems, error: itemsError } = await supabaseClient
            .from('order_items')
            .select('*');

        if (itemsError) throw itemsError;
        console.log("Order Items Data:", orderItems);

        // 🔥 Fix: Map order items by order_id
        const orderItemsMap = {};
        orderItems.forEach(item => {
            if (!orderItemsMap[item.order_id]) orderItemsMap[item.order_id] = [];
            orderItemsMap[item.order_id].push(item);
        });

        const ordersTable = document.getElementById('orders-table');
        if (!ordersTable) {
            console.error("Orders table element not found!");
            return;
        }

        ordersTable.innerHTML = '';

        orders.forEach(order => {
            const items = orderItemsMap[order.id] || [];
            let itemsHTML = items.length > 0
                ? items.map(item => `<div>${item.item_name} (x${item.quantity})</div>`).join('')
                : "<div>No Items</div>";

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.order_date || "N/A"}</td>
                <td>${order.name || "N/A"}</td>
                <td>${order.phone || "N/A"}</td>
                <td>${order.address || "N/A"}</td>
                <td>${itemsHTML}</td>
                <td>${items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                <td>₱${order.total_amount ? order.total_amount.toFixed(2) : "0.00"}</td>
                <td class="${order.status.toLowerCase().replace(/\s/g, '-')}">${order.status}</td>
                <td>
                    <select class="order-status" data-id="${order.id}">
                        <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="Preparing" ${order.status === 'Preparing' ? 'selected' : ''}>Preparing</option>
                        <option value="Out for Delivery" ${order.status === 'Out for Delivery' ? 'selected' : ''}>Out for Delivery</option>
                        <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>  
                    </select>
                </td>
                <td>
                    <button class="delete-btn" data-id="${order.id}">Delete</button>
                </td>
            `;

            ordersTable.appendChild(row);
        });

        document.querySelectorAll(".order-status").forEach(select => {
            select.addEventListener("change", async function () {
                await updateOrderStatus(this.dataset.id, this.value);
            });
        });

        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", async function () {
                const orderId = this.dataset.id;
                if (confirm("Are you sure you want to delete this order?")) {
                    await deleteOrder(orderId);
                }
            });
        });

    } catch (error) {
        console.error('Error loading orders:', error);
    }
}


// Update order status
async function updateOrderStatus(orderId, newStatus) {
    try {
        console.log("Updating order ID:", orderId, "to status:", newStatus);
        
        const { error } = await supabaseClient
            .from('orders')
            .update({ status: newStatus })
            .eq('id', orderId);

        if (error) throw error;

        alert('Order status updated successfully');
        loadOrders();

    } catch (error) {
        console.error('Error updating status:', error);
        alert('Failed to update status');
    }
}

// Delete order
async function deleteOrder(orderId) {
    try {
        console.log("Deleting order with ID:", orderId);

        const { error } = await supabaseClient
            .from('orders')
            .delete()
            .eq('id', orderId);

        if (error) {
            console.error("Delete Error:", error);
            alert("Failed to delete order: " + error.message);
            return;
        }

        alert("Order deleted successfully");
        loadOrders();

    } catch (error) {
        console.error("Unexpected error deleting order:", error);
        alert("An unexpected error occurred while deleting the order.");
    }
}

// Check if the user is logged in
function checkLogin() {
    console.log("Checking login status...");
    if (localStorage.getItem("isAdminLoggedIn") !== "true") {
        console.log("User not logged in. Redirecting...");
        window.location.href = "login.html";
    }
}

// Log out function
function logout() {
    console.log("Logging out...");
    localStorage.removeItem("isAdminLoggedIn");
    window.location.href = "login.html";
}

// Event listeners
document.addEventListener("DOMContentLoaded", function () {
    checkLogin();
    loadOrders();
    loadDashboardStats();

    const logoutButton = document.getElementById("logout-btn");
    if (logoutButton) logoutButton.addEventListener("click", logout);
});
