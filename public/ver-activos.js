const API_URL = "http://localhost:3000/api/activos"; // Cambia esta URL si es necesario
const tbody = document.querySelector(".data-table tbody");
const searchInput = document.getElementById("search");
const searchButton = document.getElementById("search-button");

// Función para eliminar un activo
async function deleteActivo(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });

        if (response.ok) {
            alert("Activo eliminado exitosamente.");
            loadActivos(); // Recargar los activos
        } else {
            alert("Error al eliminar el activo.");
        }
    } catch (error) {
        console.error("Error al eliminar el activo:", error);
    }
}

// Función para cargar datos desde la API
async function loadActivos(filter = "") {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        // Filtrar resultados si hay un filtro
        const filteredData = data.filter(item =>
            item.nombre.toLowerCase().includes(filter.toLowerCase())
        );

        // Limpiar la tabla antes de agregar nuevos datos
        tbody.innerHTML = "";

        // Rellenar la tabla con los datos
        filteredData.forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.nombre}</td>
                <td>${item.fecha_compra}</td>
                <td>${item.marca} ${item.modelo}</td>
                <td>${item.numero_serie}</td>
                <td>${item.estado}</td>
                <td>${item.id}</td>
                <td><button class="delete-button" data-id="${item.id}">Eliminar</button></td>
            `;

            // Agregar evento al botón de eliminación
            row.querySelector(".delete-button").addEventListener("click", () => {
                if (confirm(`¿Estás seguro de que deseas eliminar el activo con ID ${item.id}?`)) {
                    deleteActivo(item.id);
                }
            });

            tbody.appendChild(row);
        });
    } catch (error) {
        console.error("Error al cargar activos:", error);
    }
}

// Evento para el botón de búsqueda
searchButton.addEventListener("click", () => {
    const filter = searchInput.value;
    loadActivos(filter);
});

// Cargar datos al iniciar la página
loadActivos();
