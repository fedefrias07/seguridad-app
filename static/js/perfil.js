document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "/login";
        return;
    }

    try {
        const response = await fetch("/user-data", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            const user = await response.json();
            document.getElementById("username").innerText = user.username;
            document.getElementById("email").innerText = user.email;
        } else {
            window.location.href = "/login";
        }
    } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
        window.location.href = "/login";
    }
});

// Cerrar sesión
document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
});
