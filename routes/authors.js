const express = require('express');
const router = express.Router();
const db = require('../ir/index_rerum.js');

function getAuthorById(authorId) {
    const author = db.prepare(`
        SELECT *
        FROM authors
        WHERE id = ?
    `).get(authorId);

    if (!author) {
        return null;
    }

    return author;
}

router.get('/', (req, res) => {
    try {
        const authors = db.prepare(`
            SELECT *
            FROM authors
            ORDER BY name
        `).all();

        res.json(authors);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/:id', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
        return res.status(400).json({ error: 'Not a number' });
    }

    try {
        const author = getAuthorById(id);

        if (!author) {
            return res.status(404).json({ error: 'Not an author' });
        }

        res.json(author);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;