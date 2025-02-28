document.getElementById("save-settings").addEventListener("click", async function() {
    const username = document.getElementById("admin-username").value;
    const password = document.getElementById("admin-password").value;

    if (!username || !password) {
        alert("Please fill out all fields.");
        return;
    }

    const { error } = await supabaseClient
        .from('admin')
        .update({ username: username, password: password })
        .eq('id', 1); // Assuming admin ID is 1

    if (error) {
        alert("Failed to update settings.");
    } else {
        alert("Settings updated successfully.");
    }
});
