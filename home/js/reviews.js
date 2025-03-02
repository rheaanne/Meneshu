console.log("Admin script is running!");

// Initialize Supabase
const supabaseClient = supabase.createClient(
    'https://svvmxxkcqexwjzckuhgr.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2dm14eGtjcWV4d2p6Y2t1aGdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1ODAxMTAsImV4cCI6MjA1NjE1NjExMH0.kFg45Xd3W7GsDXpabYCO9PfmyLCDXNddl6dNK4H6UQ0'
);

// Fetch reviews on page load
document.addEventListener("DOMContentLoaded", fetchReviews);

// Function to fetch reviews
async function fetchReviews() {
    console.log("Fetching reviews...");

    try {
        // Fetch data from Supabase
        let { data: reviews, error } = await supabaseClient
            .from("feedback")
            .select('*');

        console.log("Raw Supabase response:", reviews);

        if (error) {
            console.error("Error fetching reviews:", error.message, error);
            return;
        }

        // Get the reviews table body
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
                <td><button class="delete-btn" data-id="${review.order_id}">🗑 Delete</button></td>
            `;

            reviewsBody.appendChild(row);
        });

        // Attach event listeners to delete buttons
        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", function () {
                const reviewId = this.dataset.id;
                if (confirm("Are you sure you want to delete this review?")) {
                    deleteReview(reviewId);
                }
            });
        });

        console.log("Reviews displayed successfully.");
    } catch (error) {
        console.error("Unexpected error fetching reviews:", error);
    }
}

// Function to delete a review
async function deleteReview(id) {
    console.log(`Attempting to delete review ID: ${id}`);

    if (!id) {
        console.error("Invalid review ID:", id);
        return;
    }

    try {
        const { error } = await supabaseClient
            .from("feedback")
            .delete()
            .eq("order_id", id); // Make sure "id" matches the actual column name in Supabase

        if (error) {
            console.error("Error deleting review:", error.message, error);
            alert("Failed to delete review. Check console for details.");
            return;
        }

        console.log(`Review ID ${id} deleted successfully.`);

        // Refresh the reviews list
        fetchReviews();
    } catch (error) {
        console.error("Unexpected error deleting review:", error);
    }
}
