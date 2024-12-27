const mysql = require('mysql2');

// Database connection
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect((err) => {
    if (err) {
        console.error('Failed to connect to the database:', err.stack);
        return;
    }
    console.log('Connected to the database');
});

// Fetch locations from the database
const fetchLocations = (callback) => {
    const query = 'SELECT name, latitude, longitude FROM locations';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Failed to fetch locations:', err.stack);
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
};

// Save a new location to the database
const saveLocation = (name, latitude, longitude, callback) => {
    const query = 'INSERT INTO locations (name, latitude, longitude) VALUES (?, ?, ?)';
    connection.query(query, [name, latitude, longitude], (err, results) => {
        if (err) {
            console.error('Failed to save location:', err.stack);
            callback(err);
        } else {
            callback(null);
        }
    });
};

// Export the functions for use in other files
module.exports = { fetchLocations, saveLocation };
