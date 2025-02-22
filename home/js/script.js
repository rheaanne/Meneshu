document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".nav-links a, .order-btn").forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute("href");
            if (targetPage) {
                window.location.href = targetPage;
            }
        });
    });
});