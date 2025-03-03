const { createClient } = supabase;
const supabaseClient = createClient(
    'https://svvmxxkcqexwjzckuhgr.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2dm14eGtjcWV4d2p6Y2t1aGdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1ODAxMTAsImV4cCI6MjA1NjE1NjExMH0.kFg45Xd3W7GsDXpabYCO9PfmyLCDXNddl6dNK4H6UQ0'
);

function validateFeedback(rating, comment) {
    // Rating constraints
    if (!rating || !Number.isInteger(parseInt(rating)) || rating < 1 || rating > 5) {
        throw new Error('Please select a valid rating between 1 and 5 stars');
    }

    // Comment constraints
    if (comment && comment.length > 0) {  // Only validate if comment is not empty
        if (comment.length < 5) {
            throw new Error('Comment must be at least 5 characters long');
        }
        if (comment.length > 500) {
            throw new Error('Comment cannot exceed 500 characters');
        }
        // Basic profanity/injection check
        if (/[<>{}]/g.test(comment)) {
            throw new Error('Comment contains invalid characters');
        }
    }
}


document.addEventListener('DOMContentLoaded', () => {
    // Get order ID from URL parameters
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('orderId');
    
    if (orderId) {
        document.getElementById('orderNumber').textContent = orderId;
    }


    // Handle feedback submission
    document.getElementById('submitFeedback').addEventListener('click', async () => {
        const rating = document.querySelector('input[name="rating"]:checked')?.value;
        const comment = document.getElementById('feedbackText').value.trim();
        
        try {
            validateFeedback(rating, comment);

            const { error } = await supabaseClient
                .from('ratings')
                .insert([{
                    order_id: orderId,
                    rating: parseInt(rating),
                    comment: comment.length > 0 ? comment : null,
                    created_at: new Date().toISOString()
                }]);

            if (error) throw error;

            alert('Thank you for your feedback!');
            window.location.href = 'index.html';

        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'Failed to submit feedback. Please try again.');
        }
    });
});