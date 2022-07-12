const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Fhj4?5JUi!',
    database: 'projet7'
});

module.exports = db;