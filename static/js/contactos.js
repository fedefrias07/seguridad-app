// Función para obtener el token JWT
function obtenerToken() {
    return localStorage.getItem("token"); // Suponiendo que guardaste el token en localStorage
}

// Verificar autenticación antes de cargar la página
function verificarAutenticacion() {
    const token = obtenerToken();
    if (!token) {
        alert("Debes iniciar sesión para acceder a esta página.");
        window.location.href = "/login"; // Cambia esto a la ruta de tu página de inicio de sesión
        return false;
    }
    return true;
}

// Función para llenar la tabla con datos de la API
async function cargarContactos() {
    try {
        const token = obtenerToken();

        if (!token) {
            alert("Debes iniciar sesión para ver los contactos.");
            return; // No continuar si no hay token
        }

        const response = await fetch("/api/contactos", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                alert("Tu sesión ha expirado o no tienes permiso para ver esta información.");
                window.location.href = "/login"; // Redirigir al login si no está autorizado
            } else {
                alert("Error al obtener los contactos.");
            }
            throw new Error("Error en la solicitud de contactos: " + response.status);
        }

        const contactos = await response.json();
        const tableBody = document.getElementById("contactosTableBody");
        tableBody.innerHTML = ""; // Limpiar la tabla antes de llenarla

        contactos.forEach(contacto => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${contacto.id}</td>
                <td>${contacto.nombre}</td>
                <td>${contacto.apellido}</td>
                <td>${contacto.email}</td>
                <td>${contacto.telefono}</td>
                <td>${contacto.fecha_nacimiento}</td>
                <td>${contacto.ubicacion}</td>
                <td>${contacto.tags}</td>
                <td>
                    <a href="#" class="btn btn-primary btn-sm" onclick="editarContacto(${contacto.id})">Editar</a>
                    <a href="#" class="btn btn-danger btn-sm" onclick="eliminarContacto(${contacto.id})">Eliminar</a>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error(error);
        alert("No se pudieron cargar los contactos.");
    }
}


// Función para redirigir a la página de edición del contacto
function editarContacto(id) {
    window.location.href = `/editar-contacto?id=${id}`;  // Redirige a la página de edición con el ID del contacto
}


// Función para eliminar un contacto
async function eliminarContacto(contactoId) {
    const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este contacto?");
    if (confirmar) {
        try {
            const token = obtenerToken();
            if (!token) {
                alert("Debes iniciar sesión para realizar esta acción.");
                return;
            }

            const response = await fetch(`/api/contactos/${contactoId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                alert("Contacto eliminado con éxito.");
                cargarContactos(); // Recargar la lista de contactos después de eliminar
            } else {
                alert("Error al eliminar el contacto.");
            }
        } catch (error) {
            console.error(error);
            alert("No se pudo eliminar el contacto.");
        }
    }
}

// Verificar autenticación y cargar los contactos al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    if (verificarAutenticacion()) {
        cargarContactos();
    }
});

