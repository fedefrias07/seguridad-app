// Cargar el contacto en el formulario

function obtenerIdContacto() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id'); // Obtener el parámetro 'id' de la URL
}

function obtenerToken() {
    return localStorage.getItem("token"); // Suponiendo que guardaste el token en localStorage
}


async function cargarContacto() {
    const contactoId = obtenerIdContacto();
    if (!contactoId) {
        alert("ID de contacto no encontrado");
        return;
    }

    const token = obtenerToken();
    if (!token) {
        alert("Debes iniciar sesión para acceder a esta página.");
        window.location.href = "/login";
        return;
    }

    try {
        const response = await fetch(`/api/contactos/${contactoId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            alert("Error al cargar el contacto.");
            return;
        }

        const contacto = await response.json();

        // Rellenar el formulario con los datos del contacto
        document.getElementById("nombre").value = contacto.nombre;
        document.getElementById("apellido").value = contacto.apellido;
        document.getElementById("email").value = contacto.email;
        document.getElementById("telefono").value = contacto.telefono;
        document.getElementById("fecha_nacimiento").value = contacto.fecha_nacimiento;
        document.getElementById("ubicacion").value = contacto.ubicacion;
        document.getElementById("tags").value = contacto.tags;

    } catch (error) {
        console.error(error);
        alert("No se pudo cargar la información del contacto.");
    }
}

// Editar el contacto
async function editarContacto(event) {
    event.preventDefault();

    const contactoId = obtenerIdContacto();
    const token = obtenerToken();

    if (!contactoId || !token) {
        alert("Error en la solicitud de modificación.");
        return;
    }

    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const email = document.getElementById("email").value;
    const telefono = document.getElementById("telefono").value;
    const fecha_nacimiento = document.getElementById("fecha_nacimiento").value;
    const ubicacion = document.getElementById("ubicacion").value;
    const tags = document.getElementById("tags").value;

    const data = {
        nombre,
        apellido,
        email,
        telefono,
        fecha_nacimiento,
        ubicacion,
        tags
    };

    try {
        const response = await fetch(`/api/contactos/${contactoId}`, {
            method: "PUT",  // Cambiar a POST para actualizar el contacto
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert("Contacto actualizado con éxito.");
            window.location.href = "/contactos"; // Redirigir a la lista de contactos
        } else {
            alert("Error al actualizar el contacto.");
        }
    } catch (error) {
        console.error(error);
        alert("Error en la solicitud.");
    }
}
