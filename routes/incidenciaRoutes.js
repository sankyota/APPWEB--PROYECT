const express = require('express');
const router = express.Router();
const db = require('../db'); // Asegúrate de importar correctamente tu conexión a la base de datos

// Crear una nueva incidencia (POST)
router.post('/incidencias', (req, res) => {
    const { activo_id, empleado_id, descripcion, usuario_id } = req.body;

    // Validación básica
    if (!activo_id || !descripcion || !usuario_id) {
        return res.status(400).json({ error: 'Los campos activo_id, descripcion y usuario_id son obligatorios' });
    }

    const query = `
        INSERT INTO incidencia (activo_id, empleado_id, descripcion, usuario_id, fecha_reporte, estado) 
        VALUES (?, ?, ?, ?, DEFAULT, DEFAULT)
    `;
    db.query(query, [activo_id, empleado_id, descripcion, usuario_id], (err, result) => {
        if (err) {
            console.error('Error al insertar incidencia:', err.sqlMessage || err);
            return res.status(500).json({ error: 'Error al crear la incidencia' });
        }
        res.status(201).json({ message: 'Incidencia creada exitosamente', id: result.insertId });
    });
});

// Obtener una incidencia por ID (GET)
router.get('/incidencias/:id', (req, res) => {
    const { id } = req.params; // Obtén el ID de los parámetros de la URL
    const query = 'SELECT * FROM incidencia WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error al obtener la incidencia:', err.sqlMessage || err);
            return res.status(500).json({ error: 'Error al obtener la incidencia' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Incidencia no encontrada' });
        }

        res.status(200).json(results[0]); // Envía la incidencia encontrada
    });
});
// Obtener todas las incidencias (GET)
router.get('/incidencias', (req, res) => {
    const query = 'SELECT * FROM incidencia'; // Consulta para obtener todos los registros

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener las incidencias:', err.sqlMessage || err);
            return res.status(500).json({ error: 'Error al obtener las incidencias' });
        }

        res.status(200).json(results); // Devuelve todos los registros como un arreglo
    });
});

// Actualizar una incidencia (PUT)
router.put('/incidencias/:id', (req, res) => {
    const { id } = req.params; // ID de la incidencia a actualizar
    const { activo_id, empleado_id, descripcion, usuario_id, estado } = req.body;

    const query = `
        UPDATE incidencia 
        SET activo_id = ?, empleado_id = ?, descripcion = ?, usuario_id = ?, estado = ?
        WHERE id = ?
    `;

    db.query(query, [activo_id, empleado_id, descripcion, usuario_id, estado, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar la incidencia:', err.sqlMessage || err);
            return res.status(500).json({ error: 'Error al actualizar la incidencia' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Incidencia no encontrada' });
        }
        res.status(200).json({ message: 'Incidencia actualizada exitosamente' });
    });
});

// Eliminar una incidencia (DELETE)
router.delete('/incidencias/:id', (req, res) => {
    const { id } = req.params; // ID de la incidencia a eliminar

    const query = `DELETE FROM incidencia WHERE id = ?`;

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar la incidencia:', err.sqlMessage || err);
            return res.status(500).json({ error: 'Error al eliminar la incidencia' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Incidencia no encontrada' });
        }
        res.status(200).json({ message: 'Incidencia eliminada exitosamente' });
    });
});

module.exports = router;
