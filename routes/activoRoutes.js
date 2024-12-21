const express = require('express');
const router = express.Router();
const db = require('../db'); 

// Crear un activo (POST)
router.post('/activos', (req, res) => {
    const { nombre, marca_modelo, numero_serie, fecha_adquisicion, descripcion } = req.body;

    if (!nombre || !marca_modelo || !numero_serie || !fecha_adquisicion) {
        return res.status(400).json({ error: 'Todos los campos obligatorios menos descripción' });
    }

    // Divide `marca_modelo` en `marca` y `modelo`
    const [marca, modelo] = marca_modelo.split(" ", 2);

    const query = `
        INSERT INTO activo (nombre, marca, modelo, numero_serie, fecha_compra, descripcion)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [nombre, marca, modelo, numero_serie, fecha_adquisicion, descripcion || null], (err, result) => {
        if (err) {
            console.error('Error al registrar activo:', err);
            return res.status(500).json({ error: 'Error al registrar el activo' });
        }
        res.status(201).json({ message: 'Activo registrado exitosamente', id: result.insertId });
    });
});

// Ruta para buscar datos del equipo por número de serie
router.get('/activos/numero-serie/:numero_serie', (req, res) => {
    const { numero_serie } = req.params;

    const query = `SELECT id, nombre AS equipo, CONCAT(marca, ' ', modelo) AS marca_modelo FROM activo WHERE numero_serie = ?`;

    db.query(query, [numero_serie], (err, results) => {
        if (err) {
            console.error('Error al buscar el equipo:', err);
            return res.status(500).json({ error: 'Error al buscar el equipo' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Equipo no encontrado' });
        }

        res.status(200).json(results[0]);
    });
});

// Obtener todos los activos (GET)
router.get('/activos', (req, res) => {
    const query = 'SELECT * FROM activo'; // Consulta para obtener todos los registros

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener activos:', err.sqlMessage || err);
            return res.status(500).json({ error: 'Error al obtener activos' });
        }

        res.status(200).json(results); // Devuelve todos los registros como un arreglo
    });
});

// Obtener todos los activos por id(GET)
router.get('/activos/:id', (req, res) => {
    const { id } = req.params; // Captura el ID desde los parámetros de la URL

    const query = 'SELECT * FROM activo WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error al obtener el activo:', err.sqlMessage || err);
            return res.status(500).json({ error: 'Error al obtener el activo' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Activo no encontrado' });
        }

        res.status(200).json(results[0]); // Devuelve el primer resultado (un único activo)
    });
});
// Actualizar un activo (PUT)
router.put('/activos/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, marca, modelo, numero_serie, estado, fecha_compra, descripcion } = req.body;

    const query = `
        UPDATE activo 
        SET nombre = ?, marca = ?, modelo = ?, numero_serie = ?, estado = ?, fecha_compra = ?, descripcion = ? 
        WHERE id = ?
    `;

    db.query(query, [nombre, marca, modelo, numero_serie, estado, fecha_compra, descripcion, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar el activo:', err.sqlMessage || err);
            return res.status(500).json({ error: 'Error al actualizar el activo' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Activo no encontrado' });
        }
        res.status(200).json({ message: 'Activo actualizado exitosamente' });
    });
});
// Eliminar un activo (DELETE)
router.delete('/activos/:id', (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM activo WHERE id = ?`;

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar el activo:', err.sqlMessage || err);
            return res.status(500).json({ error: 'Error al eliminar el activo' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Activo no encontrado' });
        }
        res.status(200).json({ message: 'Activo eliminado exitosamente' });
    });
});

module.exports = router;