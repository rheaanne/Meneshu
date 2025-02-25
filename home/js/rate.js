const { createClient } = supabase;
const supabaseClient = createClient(
    'https://hfpvwihgujhlrpbfjaip.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmcHZ3aWhndWpobHJwYmZqYWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzODY5NTMsImV4cCI6MjA1NTk2Mjk1M30.mWMKeQR_eHn1CoXWycUdyuAKvNowaZ9Eg_XwxNtfutc'
);

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
        
        if (!rating) {
            alert('Please select a rating');
            return;
        }

        try {
            const { error } = await supabaseClient
                .from('feedback')
                .insert([{
                    order_id: orderId,
                    rating: parseInt(rating),
                    comment: comment,
                    created_at: new Date().toISOString()
                }]);

            if (error) throw error;

            alert('Thank you for your feedback!');
            window.location.href = 'index.html';

        } catch (error) {
            console.error('Error:', error);
            alert('Failed to submit feedback. Please try again.');
        }
    });
});