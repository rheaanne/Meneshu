// Initialize Supabase client
const { createClient } = supabase;
const supabaseClient = createClient(
    'https://svvmxxkcqexwjzckuhgr.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2dm14eGtjcWV4d2p6Y2t1aGdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1ODAxMTAsImV4cCI6MjA1NjE1NjExMH0.kFg45Xd3W7GsDXpabYCO9PfmyLCDXNddl6dNK4H6UQ0'
);

// Add this function at the top level of your file
async function updateOrderStatus(orderId, newStatus) {
    try {
        // Update customer_order table
        const { error: orderError } = await supabaseClient
            .from('customer_order')
            .update({ status: newStatus })
            .eq('id', orderId);
            
        if (orderError) throw orderError;
        
        // Update delivery table with matching status
        const { error: deliveryError } = await supabaseClient
            .from('delivery')
            .update({ del_status: newStatus })
            .eq('order_id', orderId);
            
        if (deliveryError) throw deliveryError;
        
    } catch (error) {
        console.error('Error updating status:', error);
    }
}

// Utility Functions
function showMessage(message, type = 'error') {
    const existingMessage = document.querySelector('.message');
    if (existingMessage) existingMessage.remove();

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 5000);
}

function updateTotals() {
    let subtotal = 0;
    const deliveryFee = 50;

    const cartItems = document.querySelectorAll('.cart-item');
    const subtotalEl = document.querySelector('.summary-row:first-child span:last-child');
    const totalEl = document.querySelector('.summary-total span:last-child');

    cartItems.forEach(item => {
        // Update this line to handle prices with or without the peso sign
        const priceText = item.querySelector('.item-price').textContent;
        const price = parseFloat(priceText.replace(/[₱,]/g, '')) || 0;
        const quantity = parseInt(item.querySelector('.quantity-control input').value) || 1;
        subtotal += price * quantity;
    });

    const total = subtotal + deliveryFee;

    if (subtotalEl && totalEl) {
        subtotalEl.textContent = `₱${subtotal.toFixed(2)}`;
        totalEl.textContent = `₱${total.toFixed(2)}`;
    }

    // Show/hide empty cart message
    const emptyCart = document.querySelector('.empty-cart');
    if (emptyCart) {
        emptyCart.style.display = cartItems.length === 0 ? 'block' : 'none';
    }

    // Update localStorage with current cart state
    const cartData = Array.from(cartItems).map(item => ({
        image: item.querySelector('img').src,
        name: item.querySelector('h3').textContent,
        price: item.querySelector('.item-price').textContent.replace('₱', '').trim(),
        quantity: parseInt(item.querySelector('.quantity-control input').value) || 1
    }));
    localStorage.setItem('cartItems', JSON.stringify(cartData));
}


function validateForm(formData) {
    // Helper function to check for repeated or meaningless patterns
    function isNonsense(input) {
        return /^(.)\1{4,}$|^(123|abc|qwerty|test|Rgxdn Txuneyuw|khyun tdvt|trvwsvue6u|00000|11111){1,}$/i.test(input);
    }

    // Validate full name: Must contain at least two properly capitalized words and be a real name
    if (!formData.name || formData.name.length < 5 || 
        !/^[A-Z][a-z]+(?:\s[A-Z][a-z]+)+$/.test(formData.name) || 
        isNonsense(formData.name.replace(/\s+/g, ''))) {  
        throw new Error('Please enter a real full name (e.g., Juan Dela Cruz).');
    }

    // Validate phone number: Must start with 09 and contain exactly 11 digits
    if (!formData.phone || !/^09\d{9}$/.test(formData.phone)) {
        throw new Error('Please enter a valid phone number (e.g., 09123456789).');
    }

    // Validate address: Must be at least 10 characters, allow letters, numbers, and common address symbols
    if (!formData.address || formData.address.length < 10 || 
        !/^[A-Za-z0-9][A-Za-z0-9\s,.-]*$/.test(formData.address) || 
        isNonsense(formData.address.replace(/\s+/g, ''))) {
        throw new Error('Please enter a real and complete delivery address.');
    }

    // Validate landmark (optional): Must be at least 4 characters if provided and not nonsense
    if (formData.landmark && (formData.landmark.length < 4 || isNonsense(formData.landmark))) {
        throw new Error('Please enter a valid landmark or leave it empty.');
    }

    // Validate payment method: Must be selected
    if (!formData.payment_method) {
        throw new Error('Please select a payment method.');
    }
}



document.addEventListener('DOMContentLoaded', () => {
    // Check for stored cart items
    const storedItems = localStorage.getItem('cartItems');
    if (storedItems) {
        try {
            const cartItems = JSON.parse(storedItems);
            cartItems.forEach(itemData => addItemToCart(itemData));
        } catch (e) {
            console.error('Error loading cart items:', e);
            showMessage('Error loading cart items');
        }
    }

    function addItemToCart(itemData) {
        const cartItems = document.querySelector('.cart-items');
        if (!cartItems) return;
    
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="item-image">
                <img src="${itemData.image}" alt="${itemData.name}">
            </div>
            <div class="item-details">
                <h3>${itemData.name}</h3>
                <div class="item-price">₱${itemData.price}</div>
                <div class="item-controls">
                    <div class="quantity-control">
                        <button type="button" class="qty-btn minus" aria-label="Decrease quantity">−</button>
                        <input type="number" value="${itemData.quantity}" min="1" max="99" aria-label="Item quantity">
                        <button type="button" class="qty-btn plus" aria-label="Increase quantity">+</button>
                    </div>
                    <button type="button" class="remove-btn" aria-label="Remove item">
                        <span>Remove</span>
                    </button>
                </div>
            </div>
        `;
    
        cartItems.appendChild(cartItem);
        updateTotals();
    }
    

    // Event Delegation for Cart Controls
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('qty-btn')) {
            const input = e.target.parentElement.querySelector('input');
            let value = parseInt(input.value) || 1;
            
            if (e.target.classList.contains('minus')) {
                value = Math.max(1, value - 1);
            } else if (e.target.classList.contains('plus')) {
                value = Math.min(99, value + 1);
            }
            
            input.value = value;
            updateTotals();
        }
        
        if (e.target.closest('.remove-btn')) {
            if (confirm('Are you sure you want to remove this item?')) {
                const cartItem = e.target.closest('.cart-item');
                if (cartItem) {
                    cartItem.remove();
                    updateTotals();
                }
            }
        }
    });

    // Handle Form Submission
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = checkoutForm.querySelector('button[type="submit"]');
            if (!submitBtn) return;

            // Validate cart is not empty
            const cartItems = document.querySelectorAll('.cart-item');
            if (cartItems.length === 0) {
                showMessage('Your cart is empty. Please add items before checking out.');
                return;
            }

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner"></span> Processing...';

            try {
                const orderData = {
                    name: document.getElementById('name')?.value.trim(),
                    phone: document.getElementById('phone')?.value.trim(),
                    address: document.getElementById('address')?.value.trim(),
                    landmark: document.getElementById('landmark')?.value.trim(),
                    payment_method: document.querySelector('input[name="payment"]:checked')?.value,
                    subtotal: parseFloat(document.querySelector('.summary-row:first-child span:last-child').textContent.replace('₱', '')) || 0,
                    delivery_fee: 50,
                    total_amount: parseFloat(document.querySelector('.summary-total span:last-child').textContent.replace('₱', '')) || 0,
                    order_date: new Date().toISOString(),
                    status: 'pending'
                };

                // Validate form data
                validateForm(orderData);

                // Replace your customer insert code with this:
                let customerData;
                let customerError;

                // Insert order with ALL required fields
                const { data: order, error: orderError } = await supabaseClient
                .from('customer_order')
                .insert([{
                    name: orderData.name,
                    landmark: orderData.landmark || null,
                    address: orderData.address,
                    phone: orderData.phone,
                    payment_method: orderData.payment_method,
                    subtotal: orderData.subtotal,
                    delivery_fee: orderData.delivery_fee,
                    total_amount: orderData.total_amount,
                    order_date: orderData.order_date,
                    status: orderData.status
                }])
                .select()
                .single();
                
                const { data: existingCustomers, error: lookupError } = await supabaseClient
                .from('customer')
                .select('*')
                .eq('mobile_number', orderData.phone)
                .limit(1);

                if (lookupError) {
                console.error('Customer lookup error:', lookupError);
                }

                if (existingCustomers && existingCustomers.length > 0) {
                // Customer exists, use the existing customer data
                customerData = existingCustomers[0];
                console.log('Using existing customer:', customerData);
                } else {
                // Customer doesn't exist, create new customer
                const { data: newCustomer, error: insertError } = await supabaseClient
                .from('customer')
                .insert([{
                name: orderData.name,
                landmark: orderData.landmark || null,
                address: orderData.address,
                mobile_number: orderData.phone,
                payment_method: orderData.payment_method
                }])
                .select()
                .single();
    
                customerData = newCustomer;
                customerError = insertError;
    
                if (customerError) {
                console.error('Customer Error:', customerError);
                // Continue anyway since this is additional data
                }
                }
                
                if (orderError) {
                    console.error('Order Error:', JSON.stringify(orderError));
                    throw new Error(`Failed to create order: ${orderError.message || 'Unknown error'}`);
                }

                // Create order items
                const orderItems = Array.from(cartItems).map(item => ({
                    order_id: order.id,
                    item_name: item.querySelector('h3').textContent,
                    quantity: parseInt(item.querySelector('.quantity-control input').value) || 1,
                    price: parseFloat(item.querySelector('.item-price').textContent.replace('₱', '')) || 0
                }));

                // Insert order items
                const { error: itemsError } = await supabaseClient
                    .from('product')
                    .insert(orderItems);


                if (itemsError) {
                    console.error('Items Error:', itemsError);
                    throw new Error('Failed to process order items. Please try again.');
                } 



// Modify your form submission success handler
// With this enhanced version:
console.log('Order data:', order);
console.log('Customer data:', customerData);

if (order && order.id) {
    try {
        // Create delivery record with error handling
        const { error: deliveryError } = await supabaseClient
        .from('delivery')
        .insert([{
            order_id: order.id,
            del_fee: orderData.delivery_fee,
            del_status: 'pending'
        }]);
        
        if (deliveryError) console.error('Delivery record error:', deliveryError);
        
        // Create payment record only if customerData exists
        if (customerData && customerData.id) {
            const { error: paymentError } = await supabaseClient
            .from('payment')
            .insert([{
                payment_method: orderData.payment_method,
                payment_total: orderData.total_amount,
                cust_id: customerData.id,
                order_id: order.id
            }]);
            
            if (paymentError) console.error('Payment record error:', paymentError);
        } else {
            console.warn('Customer data missing or invalid:', customerData);
        }
        
        localStorage.removeItem('cartItems'); // Clear cart
        showMessage('Order placed successfully!', 'success');
        checkoutForm.reset();
        document.querySelector('.cart-items').innerHTML = '';
        updateTotals();
        
        // Disable the submit button during the wait
        submitBtn.disabled = true;
        submitBtn.textContent = 'Order Completed';
    
        // Update order status after delays
        setTimeout(async () => {
            await updateOrderStatus(order.id, 'pending');
            console.log('Order status updated to: pending');
            
            setTimeout(async () => {
                await updateOrderStatus(order.id, 'pending');
                console.log('Order status updated to: pending');
                
                setTimeout(async () => {
                    await updateOrderStatus(order.id, 'delivered');
                    console.log('Order status updated to: delivered');
                    
                    // Move redirect here to ensure it happens after delivery
                    setTimeout(() => {
                        console.log('Redirecting to rate page with order ID:', order.id);
                        window.location.href = `rate.html?orderId=${order.id}`;
                    }, 2000); // Small delay before redirect
                    
                }, 5000); // 5 seconds to delivered
                
            }, 1000); // 1 second to pending
            
        }, 1000); // 1 second to pending
    
        return;
    } catch (error) {
        console.error('Post-order processing error:', error);
        showMessage('Order placed but additional processing failed.', 'warning');
    }
} else {
    console.error('Missing order ID or invalid order data', { order });
    showMessage('Order placed but redirect failed. Please try again.', 'warning');
}

                // This code will only run if order.id is not present
                showMessage('Order placed but redirect failed. Please try again.', 'warning');

            } catch (error) {
                console.error('Error:', error);
                showMessage(error.message);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Place Order';
            }


        });
    }

    // Initialize totals
    updateTotals();
});