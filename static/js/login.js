document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (response.status === 200) {
            // Guardar el token en localStorage o sessionStorage
            localStorage.setItem("token", result.token);

            // Redirigir al usuario
            window.location.href = "/";
        } else {
            document.getElementById("loginMessage").innerText = result.error || "Error desconocido.";
        }
    } catch (error) {
        document.getElementById("loginMessage").innerText = "Error al iniciar sesión.";
        console.error(error);
    }
});