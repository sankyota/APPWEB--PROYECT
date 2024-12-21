const form = document.getElementById("register-form");

form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Evita el comportamiento predeterminado del formulario

    // Recopila los datos del formulario
    const data = {
        nombre: document.getElementById("nombre").value,
        marca_modelo: document.getElementById("marca_modelo").value,
        numero_serie: document.getElementById("numero_serie").value,
        fecha_adquisicion: document.getElementById("fecha_adquisicion").value,
        descripcion: document.getElementById("descripcion").value || null,
    };

    try {
        const response = await fetch("http://localhost:3000/api/activos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert("Error al registrar el activo: " + errorData.error);
        } else {
            alert("Activo registrado exitosamente");
            form.reset(); // Limpia el formulario
        }
    } catch (error) {
        console.error("Error de red:", error);
        alert("Error al registrar el activo");
    }
});
