document.addEventListener('DOMContentLoaded', () => {
    // Add click event listeners to all Order Now buttons
    document.querySelectorAll('.order-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get the parent menu card
            const menuCard = button.closest('.menu-card');
            
            // Create item data object
            const itemData = {
                image: menuCard.querySelector('img').src,
                name: menuCard.querySelector('h3').textContent,
                price: menuCard.querySelector('.price').textContent.replace('₱', '').trim(),
                description: menuCard.querySelector('.item-description')?.textContent || '',
                quantity: 1
            };

            // Get existing cart items or initialize empty array
            let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            
            // Check if item already exists in cart
            const existingItemIndex = cartItems.findIndex(item => item.name === itemData.name);
            
            if (existingItemIndex > -1) {
                // Increment quantity if item exists
                cartItems[existingItemIndex].quantity += 1;
            } else {
                // Add new item if it doesn't exist
                cartItems.push(itemData);
            }

            // Store updated cart in localStorage
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            
            // Show success message
            showMessage(`Added ${itemData.name} to cart`, 'success');
            
            // Optional: Ask user if they want to continue shopping or go to cart
            if (confirm('Item added to cart. Go to checkout?')) {
                window.location.href = 'delivery.html';
            }
        });
    });

    // Add utility function for messages
    function showMessage(message, type = 'success') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);
        setTimeout(() => messageDiv.remove(), 3000);
    }
});