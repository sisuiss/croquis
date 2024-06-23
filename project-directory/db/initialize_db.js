const sqlite3 = require('sqlite3').verbose();
const dbUser = new sqlite3.Database('./user_images.db');
const dbOwn = new sqlite3.Database('./own_images.db');

// Create tables if they don't exist
dbUser.serialize(() => {
    dbUser.run(`CREATE TABLE IF NOT EXISTS images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        path TEXT
    )`);
});

dbOwn.serialize(() => {
    dbOwn.run(`CREATE TABLE IF NOT EXISTS images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        path TEXT
    )`);
});

dbUser.close();
dbOwn.close();
