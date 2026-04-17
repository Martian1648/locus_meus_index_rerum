const Database =require('better-sqlite3')
const path = require('path')

const dbPath = path.join(__dirname, 'index_rerum')
const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS authors(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    middle_name TEXT,
    last_name TEXT NOT NULL,
    suffix TEXT,
    birth_year TEXT,
    death_year TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS documents(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    author_id INTEGER NOT NULL,
    type TEXT,
    publish_date TEXT,
    link TEXT NOT NULL,
    FOREIGN KEY (author_id) REFERENCES authors(id)
);
`)

module.exports=db;