CREATE TABLE authors (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    birth TEXT NOT NULL,
    death TEXT NOT NULL,
    location TEXT NOT NULL,
    occupation TEXT,
    link TEXT,
    image TEXT
);

CREATE TABLE documents (
   id INTEGER PRIMARY KEY,
   title TEXT NOT NULL,
   short_title TEXT NOT NULL,
   year_published INTEGER,
   language TEXT NOT NULL,
   author_id INTEGER NOT NULL,
   link TEXT NOT NULL,
   FOREIGN KEY (author_id) REFERENCES authors(id)
);

CREATE TABLE  users(
                                    id INTEGER PRIMARY KEY,
                                    name TEXT NOT NULL
);
CREATE TABLE checked_outs(
   id INTEGER PRIMARY KEY,
   user_id INTEGER NOT NULL,
   document_id INTEGER NOT NULL,
   last_opened TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
   bookmark_page INTEGER NOT NULL DEFAULT 0,
   FOREIGN KEY (user_id) REFERENCES users(id),
   FOREIGN KEY (document_id) REFERENCES documents(id)
);