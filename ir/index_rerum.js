const Database =require('better-sqlite3')
const path = require('path')

const dbPath = path.join(__dirname, 'index_rerum')
const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS authors(
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    birth TEXT NOT NULL,
    death TEXT NOT NULL,
    location TEXT NOT NULL,
    occupation TEXT,
    link TEXT,
    image TEXT
);

CREATE TABLE IF NOT EXISTS documents(
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    short_title TEXT NOT NULL,
    year_published INTEGER,
    language TEXT NOT NULL,
    author_id INTEGER NOT NULL,
    link TEXT NOT NULL,
    FOREIGN KEY (author_id) REFERENCES authors(id)
);
`)

module.exports=db;