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

            // Store in localStorage
            localStorage.setItem('selectedMenuItem', JSON.stringify(itemData));
            
            // Redirect to delivery page
            window.location.href = 'delivery.html';
        });
    });
});