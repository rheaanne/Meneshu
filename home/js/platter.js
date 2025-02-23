document.addEventListener("DOMContentLoaded", function () {
    let navLinks = document.querySelectorAll(".nav-links a");
    let currentPage = window.location.pathname.split("/").pop();

    navLinks.forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }
    });
});