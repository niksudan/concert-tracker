const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('database.db');

// Delete table
// db.run(`
//   DROP TABLE artists_seen
// `);

// Clear table
// db.run(`
//   DELETE from artists_seen
// `);

// Create table
db.run(`
  CREATE TABLE IF NOT EXISTS artists_seen (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    mbid TEXT NOT NULL
  )
`);

// Delete table
// db.run(`
//   DROP TABLE artists_top
// `);

// Clear table
// db.run(`
//   DELETE from artists_top
// `);

// Create table
db.run(`
  CREATE TABLE IF NOT EXISTS artists_top (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    mbid TEXT NOT NULL,
    playcount INTEGER NOT NULL
  )
`);
