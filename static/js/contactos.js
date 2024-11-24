// Función para agregar una fila de contacto a la tabla
function agregarFilaContacto(contacto) {
    const tableBody = document.getElementById("contactosTableBody");

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
}

// Ejemplo de datos de contacto que se pueden obtener desde una API o base de datos
const contactos = [
    { id: 1, nombre: 'Juan', apellido: 'Pérez', email: 'juan.perez@email.com', telefono: '(123) 456-7890', fecha_nacimiento: '1985-07-12', ubicacion: 'Buenos Aires, Argentina', tags: 'Amigo, Trabajo' },
    { id: 2, nombre: 'Ana', apellido: 'González', email: 'ana.gonzalez@email.com', telefono: '(987) 654-3210', fecha_nacimiento: '1990-09-25', ubicacion: 'Madrid, España', tags: 'Familia' }
];

// Llenar la tabla con los datos
contactos.forEach(contacto => agregarFilaContacto(contacto));

// Funciones para editar y eliminar (por ahora solo muestran un alert)
function editarContacto(id) {
    alert("Editar contacto con ID: " + id);
}

function eliminarContacto(id) {
    if (confirm("¿Estás seguro de eliminar este contacto?")) {
        alert("Eliminar contacto con ID: " + id);
        // Aquí puedes agregar lógica para eliminar el contacto de la base de datos
    }
}
