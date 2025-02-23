document.addEventListener("DOMContentLoaded", function () {
    let sidebarLinks = document.querySelectorAll(".sidebar-link");
    let urlParams = new URLSearchParams(window.location.search);
    let category = urlParams.get("category");

    sidebarLinks.forEach(link => {
        if (link.href.includes(category)) {
            link.classList.add("active");
        }
    });
});