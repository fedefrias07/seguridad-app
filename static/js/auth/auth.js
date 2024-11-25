
document.addEventListener("DOMContentLoaded", () => {

    const logoutButton = document.getElementById("logoutButton");

// Manejar el cierre de sesión
logoutButton.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
});

});