// Función para cerrar sesión
function cerrarSesion() {
    localStorage.removeItem("token");
    window.location.href = "/login";  // Redirige al login después de cerrar sesión
}

// Añadir el evento de clic para el botón de logout
document.getElementById("logout")?.addEventListener("click", cerrarSesion);
