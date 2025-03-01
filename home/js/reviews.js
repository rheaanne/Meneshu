// Initialize Supabase
const SUPABASE_URL = "https://svvmxxkcqexwjzckuhgr.supabase.co"; // Replace with your Supabase URL
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2dm14eGtjcWV4d2p6Y2t1aGdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1ODAxMTAsImV4cCI6MjA1NjE1NjExMH0.kFg45Xd3W7GsDXpabYCO9PfmyLCDXNddl6dNK4H6UQ0"; // Replace with your actual anon key

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Function to fetch reviews
async function fetchReviews() {
    console.log("Fetching reviews...");

    try {
        // Fetch data from 'feedback' table
        const { data, error } = await supabase
            .from("feedback") // Table name
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;

        console.log("Fetched reviews:", data);

        // Get the table body element
        const reviewsBody = document.getElementById("reviews-body");
        reviewsBody.innerHTML = ""; // Clear existing content

        // Populate table with reviews
        data.forEach(review => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${review.order_id}</td>
                <td>${review.rating} ⭐</td>
                <td>${review.comment}</td>
                <td>${new Date(review.created_at).toLocaleString()}</td>
                <td><button onclick="deleteReview(${review.id})">Delete</button></td>
            `;

            reviewsBody.appendChild(row);
        });

    } catch (error) {
        console.error("Error fetching reviews:", error.message);
    }
}

// Function to delete a review
async function deleteReview(id) {
    console.log(`Deleting review ID: ${id}`);

    try {
        const { error } = await supabase
            .from("feedback")
            .delete()
            .eq("id", id);

        if (error) throw error;

        console.log(`Review ID ${id} deleted successfully.`);

        // Refresh the reviews list
        fetchReviews();
    } catch (error) {
        console.error("Error deleting review:", error.message);
    }
}

// Fetch reviews when the page loads
document.addEventListener("DOMContentLoaded", fetchReviews);
