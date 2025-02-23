function togglePassword(fieldId) {
    var field = document.getElementById(fieldId);
    field.type = field.type === 'password' ? 'text' : 'password';
}

document.getElementById("signupForm").addEventListener("input", function() {
    let requiredFields = ["firstName", "lastName", "email", "phone", "signupPassword", "confirmPassword"];
    let allFilled = requiredFields.every(id => document.getElementById(id).value.trim() !== "");
    let checkboxChecked = document.querySelector(".checkbox-group input[required]").checked;
    document.getElementById("signupButton").disabled = !(allFilled && checkboxChecked);
});