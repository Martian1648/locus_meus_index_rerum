const express = require('express');
const router = express.Router();
const db = require('../ir/index_rerum.js');

function getDocumentById(documentId) {
    const document = db.prepare(`
        SELECT documents.*, authors.name AS author_name
        FROM documents
        JOIN authors ON documents.author_id = authors.id
        WHERE documents.id = ?
    `).get(documentId);

    if (!document) {
        return null;
    }

    return document;
}

router.get('/', (req, res) => {
    try {
        const documents = db.prepare(`
            SELECT documents.*, authors.name AS author_name
            FROM documents
             JOIN authors ON documents.author_id = authors.id
            ORDER BY title
        `).all();

        res.json(documents);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/author/:authorId', (req, res) => {
    const authorId = Number(req.params.authorId);

    if (!Number.isInteger(authorId)) {
        return res.status(400).json({ error: 'Not a number' });
    }

    try {
        const documents = db.prepare(`
            SELECT *
            FROM documents
            WHERE author_id = ?
            ORDER BY title
        `).all(authorId);

        res.json(documents);
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
        const document = getDocumentById(id);

        if (!document) {
            return res.status(404).json({ error: 'Not a document' });
        }

        res.json(document);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;