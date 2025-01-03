// db.js
const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gestionactivosti',
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        process.exit(1); // Detiene la ejecución si no se conecta
    }
    console.log('Conectado a la base de datos');
});

module.exports = db;