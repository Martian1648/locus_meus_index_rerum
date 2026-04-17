CREATE TABLE documents(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    author_id INTEGER NOT NULL,
    aut
    type TEXT,
    publish_date TEXT,
    link TEXT NOT NULL,
    FOREIGN KEY (author_id) REFERENCES authors(id)
);

CREATE TABLE authors(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    middle_name TEXT,
    last_name TEXT NOT NULL,
    suffix TEXT,
    birth_year TEXT,
    death_year TEXT NOT NULL
);