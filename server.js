require('dotenv').config();
const PORT = process.env.PORT || 3000;
const express = require('express');
const mysql = require('mysql');
const app = express();

const activoRoutes = require('./routes/activoRoutes');
const administradorRoutes = require('./routes/administradorRoutes');
const incidenciaRoutes = require('./routes/incidenciaRoutes.js')




app.use(express.static('public'));



// Middleware para procesar datos JSON
app.use(express.json());

// Usa las rutas de CRUD
app.use('/api', activoRoutes); 
app.use('/api', administradorRoutes);
app.use('/api', incidenciaRoutes)

// Configuración de la base de datos
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

// Ruta para "Ver activos"
app.get('/ver-activos', (req, res) => {
    res.sendFile(__dirname + '/public/ver-activos.html'); // Asegúrate de que el archivo esté en 'public'
});
// Ruta para "Registrar Activo"
app.get('/registrar-activo', (req, res) => {
    res.sendFile(__dirname + '/public/registrar-activo.html'); // Cambia según tu estructura de carpetas
});
// Ruta para "Registrar Incidencia"
app.get('/registrar-incidencia', (req, res) => {
    res.sendFile(__dirname + '/public/registrar-incidencia.html'); // Cambia según tu estructura de carpetas
});


// Conexión a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        process.exit(1); // Terminar el proceso si no se conecta a la base de datos
    }
    console.log('Conexión exitosa a la base de datos');
});

// Ruta principal
app.get('/', (req, res) => {
    res.send('¡Servidor local funcionando correctamente!');
});

// Probar conexión a la base de datos
app.get('/test-db', (req, res) => {
    db.query('SELECT 1 + 1 AS resultado', (err, results) => {
        if (err) {
            console.error('Error al probar la conexión:', err);
            return res.status(500).json({ error: 'Error al conectar con la base de datos' });
        }
        res.status(200).json({ message: 'Conexión exitosa', resultado: results[0].resultado });
    });
});







































// Inicio del servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});


