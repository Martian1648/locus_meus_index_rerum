const express = require('express');
const router = express.Router();
const db = require('../ir/index_rerum.js');

const CHECKOUT_LIMIT = 5;

function getCheckedOutById(checkedOutId) {
    const checkedOut = db.prepare(`
        SELECT *
        FROM checked_outs
        WHERE id = ?
    `).get(checkedOutId);

    if (!checkedOut) {
        return null;
    }

    return checkedOut;
}

router.get('/', (req, res) => {
    try {
        const checkedOuts = db.prepare(`
            SELECT *
            FROM checked_outs
            ORDER BY id
        `).all();

        res.json(checkedOuts);
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
        const checkedOut = getCheckedOutById(id);
        if (!checkedOut) {
            return res.status(404).json({ error: 'Not a checked out' });
        }
        res.json(checkedOut);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/user/:userId', (req, res) => {
    const userId = Number(req.params.userId);
    if (!Number.isInteger(userId)) {
        return res.status(400).json({ error: 'Not a number' });
    }
    try {
        const checkedOuts = db.prepare(`
            SELECT
                co.id,
                co.document_id,
                co.last_opened,
                co.bookmark_page,
                d.short_title,
                d.link,
                a.name AS author_name
            FROM checked_outs co
                     JOIN documents d ON d.id = co.document_id
                     JOIN authors a ON a.id = d.author_id
            WHERE co.user_id = ?
            ORDER BY co.last_opened DESC
        `).all(userId);
        res.json(checkedOuts);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/', (req, res) => {
    const userId = Number(req.body.user_id);
    const documentId = Number(req.body.document_id);
    if (!Number.isInteger(userId) || !Number.isInteger(documentId)) {
        return res.status(400).json({ error: 'not a number' });
    }
    try {
        const user = db.prepare(
            `SELECT id FROM users WHERE id = ?`)
            .get(userId);
        if (!user) {
            return res.status(404).json({ error: 'Not a user' });
        }
        const document = db.prepare(
            `SELECT id FROM documents WHERE id = ?`)
            .get(documentId);
        if (!document) {
            return res.status(404).json({ error: 'Not a document' });
        }
        const existing = db.prepare(`
                SELECT id FROM checked_outs
                WHERE user_id = ? AND document_id = ?
            `).get(userId, documentId);
        if (existing) {
            return res.status(409).json({ error: 'Document already checked out' });
        }
        const { count } = db.prepare(`
            SELECT COUNT(*) AS count
            FROM checked_outs
            WHERE user_id = ?
        `).get(userId);
        if (count >= CHECKOUT_LIMIT) {
            return res.status(409).json({ error: `Checkout limit of ${CHECKOUT_LIMIT} reached` });
        }
        const result = db.prepare(`
            INSERT INTO checked_outs (user_id, document_id)
            VALUES (?, ?)
        `).run(userId, documentId);
        const newCheckedOut = getCheckedOutById(result.lastInsertRowid);
        res.status(201).json(newCheckedOut);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.delete('/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
        return res.status(400).json({ error: 'Not a number' });
    }
    try {
        const result = db.prepare(`
            DELETE FROM checked_outs
            WHERE id = ?
        `).run(id);
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Not a checked out' });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/:id/last_opened', (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
        return res.status(400).json({ error: 'Not a number' });
    }
    try {
        const result = db.prepare(`
            UPDATE checked_outs
            SET last_opened = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(id);
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Not a checked out' });
        }
        const updated = getCheckedOutById(id);
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/:id/bookmark', (req, res) => {
    const id = Number(req.params.id);
    const bookmarkPage = Number(req.body.bookmark_page);
    if (!Number.isInteger(id)) {
        return res.status(400).json({ error: 'Not a number' });
    }
    if (!Number.isInteger(bookmarkPage) || bookmarkPage < 0) {
        return res.status(400).json({ error: 'bookmark_page must be a non-negative integer' });
    }
    try {
        const result = db.prepare(`
            UPDATE checked_outs
            SET bookmark_page = ?
            WHERE id = ?
        `).run(bookmarkPage, id);
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Not a checked out' });
        }
        const updated = getCheckedOutById(id);
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;