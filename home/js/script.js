// Open Modal
function openModal(id) {
    document.getElementById(id).style.display = "flex";
}

// Close Modal
function closeModal(id) {
    document.getElementById(id).style.display = "none";
}

// Close Modal when clicking outside of it
window.onclick = function(event) {
    let loginModal = document.getElementById('loginModal');
    let signupModal = document.getElementById('signupModal');

    if (event.target == loginModal) {
        loginModal.style.display = "none";
    }
    if (event.target == signupModal) {
        signupModal.style.display = "none";
    }
};
