document.addEventListener("DOMContentLoaded", () => {
    const loginLink = document.getElementById("loginLink");
    const registerLink = document.getElementById("registerLink");
    const logoutButton = document.getElementById("logoutButton");
    const usernameSpan = document.getElementById("username");

    const token = localStorage.getItem("token");

    if (token) {
        // Usuario autenticado
        loginLink.classList.add("d-none");
        registerLink.classList.add("d-none");
        logoutButton.classList.remove("d-none");

        // Decodificar el token para obtener el nombre de usuario
        const payload = JSON.parse(atob(token.split(".")[1])); // Decodificar la parte del payload del token
        const username = payload.username; // Asegúrate de incluir el `username` en el token al generarlo

        if (username) {
            usernameSpan.textContent = username; // Mostrar el nombre de usuario
        }
    } else {
        // Usuario no autenticado
        loginLink.classList.remove("d-none");
        registerLink.classList.remove("d-none");
        logoutButton.classList.add("d-none");

        // Limpiar el nombre de usuario
        usernameSpan.textContent = "";
    }

    // Manejar el cierre de sesión
    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    });
});
