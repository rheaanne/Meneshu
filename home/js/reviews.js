console.log("Admin script is running!");

// Initialize Supabase
const supabaseClient = supabase.createClient(
    'https://svvmxxkcqexwjzckuhgr.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2dm14eGtjcWV4d2p6Y2t1aGdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1ODAxMTAsImV4cCI6MjA1NjE1NjExMH0.kFg45Xd3W7GsDXpabYCO9PfmyLCDXNddl6dNK4H6UQ0'
);

// Function to fetch reviews
async function fetchReviews() {
    console.log("Attempting to fetch reviews...");

    try {
        // Fetch data from Supabase
        let { data: reviews, error } = await supabaseClient
            .from('feedback')
            .select('*');

        // Log full API response for debugging
        console.log("Fetch complete. Data:", reviews);
        if (error) {
            console.error("Error fetching reviews:", error.message, error);
            return;
        }

        // Check if reviews-body exists
        const reviewsBody = document.getElementById("reviews-body");
        if (!reviewsBody) {
            console.error("Element with ID 'reviews-body' not found.");
            return;
        }

        // Handle empty reviews case
        if (!reviews || reviews.length === 0) {
            console.warn("No reviews found.");
            reviewsBody.innerHTML = "<tr><td colspan='5'>No reviews available.</td></tr>";
            return;
        }

        // Clear existing reviews
        reviewsBody.innerHTML = "";

        // Populate table with reviews
        reviews.forEach(review => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${review.order_id || "N/A"}</td>
                <td>${review.rating} ⭐</td>
                <td>${review.comment || "No comment"}</td>
                <td>${new Date(review.created_at).toLocaleString()}</td>
                <td><button onclick="deleteReview('${review.id}')">🗑 Delete</button></td>
            `;

            reviewsBody.appendChild(row);
        });

    } catch (error) {
        console.error("Unexpected error fetching reviews:", error);
    }
}

// Function to delete a review
async function deleteReview(id) {
    console.log(`Deleting review ID: ${id}`);

    try {
        const { error } = await supabaseClient
            .from("feedback")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("Error deleting review:", error.message, error);
            alert("Failed to delete review.");
            return;
        }

        console.log(`Review ID ${id} deleted successfully.`);

        // Refresh the reviews list
        fetchReviews();
    } catch (error) {
        console.error("Unexpected error deleting review:", error);
    }
}

// Fetch reviews when the page loads
document.addEventListener("DOMContentLoaded", fetchReviews);
