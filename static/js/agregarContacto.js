document.getElementById("agregarContactoForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Obtener datos del formulario
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const email = document.getElementById("email").value;
    const telefono = document.getElementById("telefono").value;
    const fecha_nacimiento = document.getElementById("fecha_nacimiento").value;
    const ubicacion = document.getElementById("ubicacion").value;
    const tags = document.getElementById("tags").value;

    try {
        const response = await fetch("/agregar-contacto", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nombre,
                apellido,
                email,
                telefono,
                fecha_nacimiento,
                ubicacion,
                tags,
            }),
        });

        const result = await response.json();

        const mensajeDiv = document.getElementById("mensaje");
        if (response.status === 201) {
            mensajeDiv.innerHTML = `<div class="alert alert-success">${result.message}</div>`;
            document.getElementById("agregarContactoForm").reset();
        } else {
            mensajeDiv.innerHTML = `<div class="alert alert-danger">${result.error}</div>`;
        }
    } catch (error) {
        console.error(error);
        document.getElementById("mensaje").innerHTML = `<div class="alert alert-danger">Error al agregar el contacto.</div>`;
    }
});
