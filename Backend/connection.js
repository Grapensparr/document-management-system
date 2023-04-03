require('dotenv').config();
const mysql = require('mysql2');

connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: 'notes'
});

module.exports = connection;