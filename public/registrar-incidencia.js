document.getElementById("buscar-equipo").addEventListener("click", async () => {
    const numeroSerie = document.getElementById("numero_serie").value;

    if (!numeroSerie) {
        alert("Por favor, ingrese el número de serie");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/activos/numero-serie/${numeroSerie}`);
        if (!response.ok) {
            throw new Error("Equipo no encontrado");
        }

        const data = await response.json();
        // Rellena los campos con los datos obtenidos
        document.getElementById("equipo").value = data.equipo;
        document.getElementById("marca_modelo").value = data.marca_modelo;
        document.getElementById("id").value = data.id;

        alert("Datos del equipo cargados correctamente");
    } catch (error) {
        alert(error.message);
    }
});

document.getElementById("register-incident-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = {
        activo_id: document.getElementById("id").value,
        descripcion: document.getElementById("descripcion").value,
        usuario_id: 1, // Cambiar por el usuario actual
        estado: "Abierta",
    };

    try {
        const response = await fetch("http://localhost:3000/api/incidencias", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Error al registrar la incidencia");
        }

        alert("Incidencia registrada exitosamente");
        document.getElementById("register-incident-form").reset();
    } catch (error) {
        alert(error.message);
    }
});
