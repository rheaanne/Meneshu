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
                price: parseFloat(menuCard.querySelector('.price').textContent.replace('₱', '').trim()),
                description: menuCard.querySelector('.item-description')?.textContent || '',
                quantity: 1
            };

            // Retrieve existing cart from localStorage or initialize an empty array
            let cart = JSON.parse(localStorage.getItem('cart')) || [];

            // Check if item already exists in cart
            let existingItem = cart.find(item => item.name === itemData.name);

            if (existingItem) {
                // If item exists, increase quantity
                existingItem.quantity += 1;
            } else {
                // Otherwise, add new item
                cart.push(itemData);
            }

            // Save updated cart to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Redirect to delivery page
            window.location.href = 'delivery.html';
        });
    });
});
