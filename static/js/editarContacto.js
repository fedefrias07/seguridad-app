// Función para formatear la fecha al formato "yyyy-MM-dd"
function formatearFecha(fecha) {
    const fechaObj = new Date(fecha); // Convertir la fecha en un objeto Date
    const año = fechaObj.getFullYear();
    const mes = String(fechaObj.getMonth() + 1).padStart(2, '0'); // Los meses son de 0 a 11, así que sumamos 1
    const dia = String(fechaObj.getDate()).padStart(2, '0'); // Asegurarse de que el día tenga 2 dígitos
    return `${año}-${mes}-${dia}`; // Retornar la fecha en formato yyyy-MM-dd
}

// Función para obtener el ID del contacto de la URL
function obtenerIdContacto() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id'); // Obtener el parámetro 'id' de la URL
}

// Función para obtener el token desde el localStorage
function obtenerToken() {
    return localStorage.getItem("token"); // Suponiendo que guardaste el token en localStorage
}

// Cargar los datos del contacto al formulario al cargar la página
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
                "Authorization": `Bearer ${token}`,
            },
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
        
        // Convertir la fecha antes de asignarla al campo de fecha
        const fechaNacimientoFormateada = formatearFecha(contacto.fecha_nacimiento);
        document.getElementById("fecha_nacimiento").value = fechaNacimientoFormateada;

        document.getElementById("ubicacion").value = contacto.ubicacion;
        document.getElementById("tags").value = contacto.tags;

    } catch (error) {
        console.error(error);
        alert("No se pudo cargar la información del contacto.");
    }
}

// Manejar la edición del contacto
document.getElementById("editarContactoForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Obtener el ID del contacto desde la URL
    const contactoId = obtenerIdContacto();
    if (!contactoId) {
        alert("ID de contacto no encontrado");
        return;
    }

    // Obtener los datos del formulario
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const email = document.getElementById("email").value;
    const telefono = document.getElementById("telefono").value;
    const fecha_nacimiento = document.getElementById("fecha_nacimiento").value;
    const ubicacion = document.getElementById("ubicacion").value;
    const tags = document.getElementById("tags").value;

    // Obtener el token del almacenamiento local
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Debes iniciar sesión para editar el contacto.");
        window.location.href = "/login";
        return;
    }

    try {
        const response = await fetch(`/api/contactos/${contactoId}`, {
            method: "PUT", // Usar PUT para actualizar el contacto
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`, // Enviar el token en el encabezado
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

        if (response.ok) {
            mensajeDiv.innerHTML = `<div class="alert alert-success">${result.message}</div>`;
            document.getElementById("editarContactoForm").reset(); // Limpiar el formulario
            
            // Añadir un temporizador de 2 segundos antes de redirigir
            setTimeout(() => {
                window.location.href = "/contactos"; // Redirigir a la lista de contactos
        }, 2000); // 2000 milisegundos = 2 segundos

        } else {
            mensajeDiv.innerHTML = `<div class="alert alert-danger">${result.error}</div>`;
        }
    } catch (error) {
        console.error(error);
        document.getElementById("mensaje").innerHTML = `<div class="alert alert-danger">Error al actualizar el contacto.</div>`;
    }
});

// Llamar a la función para cargar el contacto cuando se cargue la página
document.addEventListener("DOMContentLoaded", cargarContacto);
