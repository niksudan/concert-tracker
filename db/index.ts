const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('database.db');

db.run(`
  CREATE TABLE IF NOT EXISTS artists_seen (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    mbid TEXT NOT NULL,
    lastSeenDate TEXT,
    lastSeenVenue TEXT,
    lastSeenCity TEXT,
    lastSeenCountry TEXT
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS artists_top (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    mbid TEXT NOT NULL,
    playcount INTEGER NOT NULL
  )
`);
