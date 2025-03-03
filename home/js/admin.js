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
            .from('customer_order')
            .select('*', { count: 'exact' });

        if (ordersError) {
            console.error("Orders Fetch Error:", ordersError);
            totalOrders = 0;
        }

        let { data: totalSalesData, error: salesError } = await supabaseClient
            .from('customer_order')
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
            .from('customer_order')
            .select('*')
            .order('id', { ascending: true });
            

        if (ordersError) throw ordersError;
        console.log("Orders Data:", orders);

        const { data: orderItems, error: itemsError } = await supabaseClient
            .from('product')
            .select('*');

        if (itemsError) throw itemsError;
        console.log("Order Items Data:", orderItems);

        // 🔥 Fix: Map order items by order_id
        const orderItemsMap = {};
        orderItems.forEach(item => {
            if (!orderItemsMap[item.order_id]) orderItemsMap[item.order_id] = [];
            orderItemsMap[item.order_id].push(item);
        });

        const ordersTable = document.getElementById('customer_order-table');
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
                <td class="${(order.status || '').toLowerCase().replace(/\s/g, '-')}" ${order.status || 'Pending'}
                </td>
                    <select class="order-status" data-id="${order.id}">
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="preparing" ${order.status === 'preparing' ? 'selected' : ''}>Preparing</option>
                        <option value="delivering" ${order.status === 'delivering' ? 'selected' : ''}>Delivering</option>
                        <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>  
                    </select>
                </td>
            `;

            ordersTable.appendChild(row);
        });

        document.querySelectorAll(".order-status").forEach(select => {
            select.addEventListener("change", async function () {
                await updateOrderStatus(this.dataset.id, this.value);
            });
        });

    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

// Update order status
async function updateOrderStatus(orderId, newStatus) {
    try {
        // Convert status to lowercase for consistency with delivery.js
        const lowerStatus = newStatus.toLowerCase();
        
        console.log("Updating order ID:", orderId, "to status:", lowerStatus);
        
        // Update customer_order table
        const { error: orderError } = await supabaseClient
            .from('customer_order')
            .update({ status: lowerStatus })
            .eq('id', orderId);

        if (orderError) {
            console.error('Order update error:', orderError);
            throw orderError;
        }
        
        // Also update delivery table with matching status
        const { error: deliveryError } = await supabaseClient
            .from('delivery')
            .update({ del_status: lowerStatus })
            .eq('order_id', orderId);
            
        if (deliveryError) {
            console.error('Delivery update error:', deliveryError);
            // Continue anyway since the main order was updated
        }

        alert('Order status updated successfully');
        loadOrders(); // Reload to show updated status

    } catch (error) {
        console.error('Error updating status:', error);
        alert('Failed to update status: ' + (error.message || 'Unknown error'));
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
