// Initialize Supabase client
console.log("Orders script is running!");

const { createClient } = supabase;
const supabaseClient = createClient(
    'https://svvmxxkcqexwjzckuhgr.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2dm14eGtjcWV4d2p6Y2t1aGdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1ODAxMTAsImV4cCI6MjA1NjE1NjExMH0.kFg45Xd3W7GsDXpabYCO9PfmyLCDXNddl6dNK4H6UQ0'
);

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
            <td>₱${order.total_amount.toFixed(2)}</td>
            <td>${order.status}</td>
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

// Load orders when the page loads
document.addEventListener('DOMContentLoaded', loadOrders);
