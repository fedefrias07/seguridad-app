document.getElementById("registerForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("/registro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, email, password }),
        });

        const result = await response.json();

        if (response.status === 201) {
            // Redirigir al usuario a la página de inicio de sesión
            window.location.href = "/login";
        } else {
            // Mostrar el mensaje de error
            document.getElementById("responseMessage").innerText = result.error || "Error desconocido.";
        }
    } catch (error) {
        document.getElementById("responseMessage").innerText = "Error al registrar el usuario.";
        console.error(error);
    }
});